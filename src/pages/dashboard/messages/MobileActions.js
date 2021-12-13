import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { 
    Button,
    Grid
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import { SET_CUSTOMER_MSG } from '../../../actions/types';
import isEmpty from '../../../utils/isEmpty';
import { CHAT_CONNECTION_STATUS } from '../../../utils/constants';
import { sendTransactionNotification } from '../../../actions/chat';
import { cancelNegotiation, completeTransaction } from '../../../actions/listings';

import SuccessModal from '../../../components/common/SuccessModal';
import Spinner from '../../../components/common/Spinner';
import Toast from '../../../components/common/Toast';

const { CONNECTED, RECONNECTED } = CHAT_CONNECTION_STATUS;

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(2),
        height: '100%'
    },

    button: {
        paddingBottom: theme.spacing(0.5),
        paddingTop: theme.spacing(0.5),
    }
}));

const Actions = (props) => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const { customerId, msg, userName } = useSelector(state => state.customer);
    const errorsState = useSelector(state => state.errors);
    
    const { connectionStatus, chat } = useSelector(state => state.chat);
    const buyer = useSelector(state => state.chat?.chat?.buyer);
    const buyerUsername = useSelector(state => state.chat?.chat?.buyerUsername);
    const buyerHasMadePayment = useSelector(state => state.chat?.chat?.buyerHasMadePayment);
    const buyerHasRecievedPayment = useSelector(state => state.chat?.chat?.buyerHasRecievedPayment);
    const seller = useSelector(state => state.chat?.chat?.seller);
    const sellerUsername = useSelector(state => state.chat?.chat?.sellerUsername);
    const sellerHasMadePayment = useSelector(state => state.chat?.chat?.sellerHasMadePayment);
    const sellerHasRecievedPayment = useSelector(state => state.chat?.chat?.sellerHasRecievedPayment);
    const isDeleted = useSelector(state => state.chat?.chat?.isDeleted);

    const [loading, setLoading] = useState(false);
    const [chatDisconnected, setChatDisconnected] = useState(false);


    const [errors, setErrors] = useState({});

    const toast = useRef();
    const successModal = useRef();

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

    useEffect(() => {
        if(connectionStatus !== undefined) {
            if (connectionStatus === CONNECTED || connectionStatus === RECONNECTED) {
                setChatDisconnected(false);
            } else {
                setChatDisconnected(true);
            }
        }
    }, [connectionStatus]);

    // const handleSetRating = (e, value) => {
    //     setSellerRating(value);
    // }

    const cancelNegotiation = () => {
        props.cancelNegotiation(chat.id, history);
    };

    const completeTransaction = () => {
        setErrors({});
        let data = {
            ChatSessionId: chat.id,
            Message: '',
            Rating: 0,
            ReceivedExpectedFunds: true
        };

        // if (isEmpty(Message)) {
        //     delete data.Message;
        // }

        // if (!sellerRating) {
        //     delete data.Rating;
        // }

        // setErrors({});
        // setLoading(true);

        props.completeTransaction(data);
    };

    const dismissSuccessModal = () => {
        dispatch({
            type: SET_CUSTOMER_MSG,
            payload: null
        });
    };    

    const handlePayment = ({ buyerHasMadePayment, sellerHasMadePayment }) => {
        props.sendTransactionNotification(chat.id, { 
            customerUsername: userName, 
            otherUsername: userName === buyerUsername ? sellerUsername : buyerUsername,
            buyerHasMadePayment,
            sellerHasMadePayment 
        });
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
                <form onSubmit={onSubmit}>
                    <Grid container direction="row" spacing={2}>
                        {/* Buyer Start End */}
                        {buyer === customerId && 
                            <>
                                <Grid item xs={12}>
                                    <Button 
                                        className={classes.button}
                                        type="submit"
                                        variant="outlined"
                                        color="primary"
                                        fullWidth
                                        disabled={loading || buyerHasMadePayment || isDeleted || chatDisconnected ? true : false}
                                        onClick={() => handlePayment({ buyerHasMadePayment: true, sellerHasMadePayment })}
                                    >
                                        I've Made Payment
                                    </Button>
                                </Grid>
                                {sellerHasMadePayment &&
                                    <Grid item xs={12}>
                                        <Button 
                                            className={classes.button}
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            onClick={completeTransaction}
                                            disabled={loading || buyerHasRecievedPayment || isDeleted || chatDisconnected ? true : false}
                                        >
                                            Payment Received
                                        </Button>
                                    </Grid>
                                }
                                <Grid item xs={12}>
                                    <Button 
                                        className={classes.button}
                                        type="submit"
                                        variant="outlined"
                                        color="primary"
                                        fullWidth
                                        onClick={cancelNegotiation}
                                        disabled={loading || buyerHasMadePayment || isDeleted || chatDisconnected ? true : false}
                                    >
                                        Cancel Transaction
                                    </Button>
                                </Grid>
                            </>
                        }
                        {/* Buyer Buttons End */}
                    
                        {/* Seller Buttons Start */}
                        {seller === customerId && 
                            <>
                                {sellerHasRecievedPayment && 
                                    <Grid item xs={12}>
                                        <Button 
                                            className={classes.button}
                                            type="submit"
                                            variant="outlined"
                                            color="primary"
                                            fullWidth
                                            disabled={loading || sellerHasMadePayment || isDeleted || chatDisconnected ? true : false}
                                            onClick={() => handlePayment({ buyerHasMadePayment, sellerHasMadePayment: true })}
                                        >
                                            I've Made Payment
                                        </Button>
                                    </Grid>
                                }
                                {buyerHasMadePayment &&
                                    <Grid item xs={12}>
                                        <Button 
                                            className={classes.button}
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            onClick={completeTransaction}
                                            disabled={loading || sellerHasRecievedPayment || isDeleted || chatDisconnected ? true : false}
                                        >
                                            Payment Received
                                        </Button>
                                    </Grid>
                                }
                                <Grid item xs={12}>
                                    <Button 
                                        className={classes.button}
                                        type="submit"
                                        variant="outlined"
                                        color="primary"
                                        fullWidth
                                        onClick={cancelNegotiation}
                                        disabled={loading || buyerHasMadePayment || isDeleted || chatDisconnected ? true : false}
                                    >
                                        Cancel Transaction
                                    </Button>
                                </Grid>
                            </>
                        }
                        {/* Seller Buttons End */}
                    </Grid>
                </form>
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