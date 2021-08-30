import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { 
    Backdrop,
    Button,
    CircularProgress, 
    Fade,
    Grid,
    Modal,
    TextField, 
    Typography 
} from '@material-ui/core';

import Rating from '@material-ui/lab/Rating';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import { SET_CUSTOMER_MSG } from '../../../actions/types';
import isEmpty from '../../../utils/isEmpty';
import { sendTransactionNotification } from '../../../actions/chat';
import { cancelNegotiation, completeTransaction } from '../../../actions/listings';

import SuccessModal from '../../../components/common/SuccessModal';
import Spinner from '../../../components/common/Spinner';
import Toast from '../../../components/common/Toast';

import { COLORS, SHADOW } from '../../../utils/constants';

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    root: {
        backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius,
        width: '50vw',
        boxShadow: SHADOW,
        padding: theme.spacing(3, 5),

        [theme.breakpoints.down('md')]: {
            width: '50vw',
        },
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(5, 2),
            width: '80vw',
        },
    },

    item: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        textAlign: 'center'
    },

    icon: {
        color: theme.palette.primary.main,
        fontSize: theme.spacing(5)
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

const CompleteTransactionModal = (props) => {
	const classes = useStyles();
	const dispatch = useDispatch();
    const history = useHistory();

    const { msg } = useSelector(state => state.customer);
    const { paymentMade, sessionId } = useSelector(state => state.chat);
    
    const errorsState = useSelector(state => state.errors);
    const [open, setOpen] = useState(false);

    const [Message, setMessage] = useState('');
    const [sellerRating, setSellerRating] = useState(null);
    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState({});

    const toast = useRef();
    const successModal = useRef();

    useEffect(() => {
        setOpen(props.open);
    }, [props.open]);

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


    const handleSetRating = (e, value) => {
        setSellerRating(value);
    }

    const cancelNegotiation = () => {
        props.cancelNegotiation(sessionId, history);
    };

    const completeTransaction = () => {
        setErrors({});
        let data = {
            ChatSessionId: sessionId,
            Message,
            Rating: sellerRating ? parseInt(sellerRating) : 0,
            ReceivedExpectedFunds: true
        };

        if (isEmpty(Message)) {
            delete data.Message;
        }

        if (!sellerRating) {
            delete data.Rating;
        }

        setErrors({});
        setLoading(true);

        props.completeTransaction(data, history);
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
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            onClose={() => setOpen(false)}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <section className={classes.root}>
                    {loading && <Spinner text="One moment . . ." />}
                    <SuccessModal ref={successModal} dismissAction={dismissSuccessModal} />
                    {!isEmpty(errors) && 
                        <Toast 
                        ref={toast}
                        title="ERROR"
                            duration={5000}
                            msg={errors.msg || ''}
                            type="error"
                        />
                    }
                    <Typography variant="subtitle1" component="p">CompleteTransactionModal</Typography>
                    <Grid container direction="column" spacing={2}>
                        <Grid item>
                            <form onSubmit={onSubmit}>
                                <Grid container direction="column" spacing={3}>
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
                                    {paymentMade &&
                                        <>
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
                                                    onClick={completeTransaction}
                                                    // disabled={seller === customerId && disableSellerSubmitButton || seller !== customerId && disableBuyerSubmitButton ? true : false}
                                                    // disabled={loading ? true : false}
                                                >
                                                    {!loading ? 'Payment Received' : <CircularProgress style={{ color: '#f8f8f8' }} />}
                                                </Button>
                                            </Grid>
                                        </>
                                    }
                                </Grid>
                            </form>
                        </Grid>
                    </Grid>
                </section>
            </Fade>
        </Modal>
	);
};

CompleteTransactionModal.propTypes = {
    cancelNegotiation: PropTypes.func.isRequired,
    completeTransaction: PropTypes.func.isRequired,
    sendTransactionNotification: PropTypes.func.isRequired
};

export default connect(undefined, { cancelNegotiation, completeTransaction, sendTransactionNotification })(CompleteTransactionModal);
