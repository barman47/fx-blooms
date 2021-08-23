import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { 
    Button,
    CircularProgress, 
    Grid,
    TextField, 
    Typography 
} from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import { makeStyles } from '@material-ui/core/styles';
import { HttpTransportType, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import PropTypes from 'prop-types';

// eslint-disable-next-line
import { PAYMENT_MADE, SET_CUSTOMER_MSG, SET_LISTING } from '../../../actions/types';
import isEmpty from '../../../utils/isEmpty';
import { sendTransactionNotification } from '../../../actions/chat';
import { cancelNegotiation, completeTransaction } from '../../../actions/listings';
// eslint-disable-next-line
import { DASHBOARD, EDIT_LISTING } from '../../../routes';

import { HUB_URL } from '../../../utils/constants';
import SuccessModal from '../../../components/common/SuccessModal';
import Spinner from '../../../components/common/Spinner';
import Toast from '../../../components/common/Toast';


import validateCompleteTransaction from '../../../utils/validation/customer/completeTransaction';

const useStyles = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(2),  
        paddingRight: theme.spacing(2),  
    },

    button: {
        paddingBottom: theme.spacing(2),
        paddingTop: theme.spacing(2),
    },

    radio: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr'
    },

    rating: {
        color: theme.palette.primary.main
    }
}));

const Actions = (props) => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const { disableBuyerSubmitButton, disableSellerSubmitButton, seller } = useSelector(state => state.chat.chat);
    const { customerId, msg } = useSelector(state => state.customer);
    const errorsState = useSelector(state => state.errors);
    // eslint-disable-next-line
    const { paymentMade, paymentReceived, sessionId } = useSelector(state => state.chat);

    const [Message, setMessage] = useState('');
    const [sellerRating, setSellerRating] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const [connection, setConnection] = useState(null);
    const [connected, setConnected] = useState(false);

    const [errors, setErrors] = useState({});

    const toast = useRef();
    const successModal = useRef();

    useEffect(() => {
        const connect = new HubConnectionBuilder().withUrl(HUB_URL, {
            skipNegotiation: true,
            transport: HttpTransportType.WebSockets
        }).configureLogging(LogLevel.Information).withAutomaticReconnect().build();
        console.log(connect);
        setConnection(connect);
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (connection && !connected) {
            connection.start()
                .then(() => {
                    console.log('connected');
                    setConnected(true);
                    connection.on('TransferNotification', notification => {
                        console.log('notification ', notification);
                        dispatch({
                            type: PAYMENT_MADE,
                            payload: { ...JSON.parse(notification) }
                        }); 
                    });
                })
                .catch(err => {
                    setConnected(false);
                    console.error(err);
                });
        }
    }, [connection, dispatch, connected]);

    useEffect(() => {
        if (!isEmpty(errors)) {
            toast.current.handleClick();
        }
    }, [errors]);

    useEffect(() => {
        if (errorsState?.msg) {
            setErrors(errorsState);
            setLoading(false);
        }
    }, [errorsState]);

    useEffect(() => {
        if (msg) {
            successModal.current.openModal();
            successModal.current.setModalText(msg);
        }
    }, [dispatch, msg]);


    // const handleEditListing = () => {
    //     dispatch({
    //         type: SET_LISTING,
    //         payload: listing
    //     });
    //     return history.push(`${DASHBOARD}${EDIT_LISTING}`);
    // };

    const handleSetRating = (e, value) => {
        setSellerRating(value);
    }

    const cancelNegotiation = () => {
        props.cancelNegotiation(sessionId, history);
    };

    const completeTransaction = (submit) => {
        setErrors({});
        const data = {
            Message,
            Rating: sellerRating
        };

        if (submit) {
            const { errors, isValid } = validateCompleteTransaction(data);

            if (!isValid) {
                return setErrors(errors);
            }
        }

        setErrors({});
        setLoading(true);

        props.completeTransaction({
            ChatSessionId: sessionId,
            Rating: !sellerRating ? 0 : parseInt(sellerRating),
            Message,
            ReceivedExpectedFunds: true
        }, history);
    };

    const dismissSuccessModal = () => {
        dispatch({
            type: SET_CUSTOMER_MSG,
            payload: null
        });
    };    

    const handlePayment = () => {
        props.sendTransactionNotification(sessionId);
    };

    const onSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <>
            <SuccessModal ref={successModal} dismissAction={dismissSuccessModal} />
            <section className={classes.root}>
                {loading && <Spinner text="One moment . . ." />}
                {!isEmpty(errors) && 
                    <Toast 
                        ref={toast}
                        title="ERROR"
                        duration={5000}
                        msg={errors.msg || ''}
                        type="error"
                    />
                }
                <Typography variant="subtitle1" component="p">Actions</Typography>
                <Grid container direction="column" spacing={2}>
                    <Grid item>
                        <form onSubmit={onSubmit}>
                            <Grid container direction="column" spacing={3}>
                                    {customerId === seller ? 
                                        <Grid item xs={12}>
                                            <Button 
                                                className={classes.button}
                                                type="submit"
                                                variant="outlined"
                                                color="primary"
                                                fullWidth
                                                disabled={loading || paymentReceived ? true : false}
                                                onClick={() => completeTransaction()}
                                            >
                                                Payment Received
                                            </Button>
                                        </Grid>
                                        :
                                        <Grid item xs={12}>
                                            <Button 
                                                className={classes.button}
                                                type="submit"
                                                variant="outlined"
                                                color="primary"
                                                fullWidth
                                                disabled={loading || paymentMade ? true : false}
                                                onClick={handlePayment}
                                            >
                                                I've Made Payment
                                            </Button>
                                        </Grid>
                                    }
                                    {!paymentMade && 
                                        <Grid item xs={12}>
                                            <Button 
                                                className={classes.button}
                                                type="submit"
                                                variant="outlined"
                                                color="primary"
                                                fullWidth
                                                onClick={cancelNegotiation}
                                                disabled={loading ? true : false}
                                            >
                                                Cancel Negotiation
                                            </Button>
                                        </Grid>
                                    }
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" component="p">Rate this user</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Rating 
                                        color="primary" 
                                        name="seller-rating"  
                                        value={sellerRating} 
                                        onChange={handleSetRating}
                                        className={classes.rating}
                                        disabled={loading ? true : false}
                                    />
                                    <br />
                                    {errors.Rating && <small style={{ color: '#f44336' }}>{errors.Rating}</small>}
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField 
                                        type="text"
                                        variant="outlined"
                                        value={Message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Enter message"
                                        multiline
                                        rows={5}
                                        fullWidth
                                        helperText={errors.Message}
                                        error={errors.Message ? true : false}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button 
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        onClick={() => completeTransaction(true)}
                                        disabled={seller === customerId && disableSellerSubmitButton ? true : seller !== customerId && disableBuyerSubmitButton}
                                        // disabled={loading ? true : false}
                                    >
                                        {!loading ? 'Submit' : <CircularProgress style={{ color: '#f8f8f8' }} />}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            </section>
        </>
    );
};

Actions.propTypes = {
    cancelNegotiation: PropTypes.func.isRequired,
    completeTransaction: PropTypes.func.isRequired,
    sendTransactionNotification: PropTypes.func.isRequired
};

export default connect(undefined, { cancelNegotiation, completeTransaction, sendTransactionNotification })(Actions);