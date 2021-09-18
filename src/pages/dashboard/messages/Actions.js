import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { 
    Button,
    // CircularProgress, 
    Grid,
    // TextField, 
    Typography 
} from '@material-ui/core';
// import Rating from '@material-ui/lab/Rating';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import { SET_CUSTOMER_MSG } from '../../../actions/types';
import isEmpty from '../../../utils/isEmpty';
import { sendTransactionNotification } from '../../../actions/chat';
import { cancelNegotiation, completeTransaction } from '../../../actions/listings';
import { COLORS } from '../../../utils/constants';

import SuccessModal from '../../../components/common/SuccessModal';
import Spinner from '../../../components/common/Spinner';
import Toast from '../../../components/common/Toast';

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
    },

    tipsContainer: {
        backgroundColor: COLORS.lightTeal
    },

    tipsAndRecommendationsTitle: {
        color: theme.palette.primary.main,
        fontSize: theme.spacing(1.5)
    },

    tipsAndRecommendationsList: {
        fontSize: theme.spacing(1.5),

        '& li': {
            color: theme.palette.primary.main,
            fontWeight: 300,
            marginBottom: theme.spacing(1)
        }
    },
}));

const Actions = (props) => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const { customerId, msg, userName } = useSelector(state => state.customer);
    const errorsState = useSelector(state => state.errors);
    
    const { sessionId } = useSelector(state => state.chat);
    // const { buyer, seller, buyerHasMadePayment, buyerHasRecievedPayment, sellerHasMadePayment, sellerHasReceivedPayment } = useSelector(state => state.chat.chat);
    const buyer = useSelector(state => state.chat?.chat?.buyer);
    const buyerUsername = useSelector(state => state.chat?.chat?.buyerUsername);
    const buyerHasMadePayment = useSelector(state => state.chat?.chat?.buyerHasMadePayment);
    const buyerHasRecievedPayment = useSelector(state => state.chat?.chat?.buyerHasRecievedPayment);
    const seller = useSelector(state => state.chat?.chat?.seller);
    const sellerUsername = useSelector(state => state.chat?.chat?.sellerUsername);
    const sellerHasMadePayment = useSelector(state => state.chat?.chat?.sellerHasMadePayment);
    const sellerHasRecievedPayment = useSelector(state => state.chat?.chat?.sellerHasRecievedPayment);
    const isDeleted = useSelector(state => state.chat?.chat?.isDeleted);

    // const [Message, setMessage] = useState('');
    // const [sellerRating, setSellerRating] = useState(null);
    const [loading, setLoading] = useState(false);


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

    // const handleSetRating = (e, value) => {
    //     setSellerRating(value);
    // }

    const cancelNegotiation = () => {
        props.cancelNegotiation(sessionId, history);
    };

    const completeTransaction = () => {
        setErrors({});
        let data = {
            ChatSessionId: sessionId,
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
        props.sendTransactionNotification(sessionId, { 
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
                <Typography variant="subtitle1" component="p">Actions</Typography>
                <Grid container direction="column" spacing={2}>
                    <Grid item xs={12}>
                        <form onSubmit={onSubmit}>
                            <Grid container direction="column" spacing={3}>
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
                                                disabled={loading || buyerHasMadePayment || isDeleted ? true : false}
                                                onClick={() => handlePayment({ buyerHasMadePayment: true, sellerHasMadePayment })}
                                            >
                                                I've Made Payment:Buyer
                                            </Button>
                                        </Grid>
                                        {sellerHasMadePayment &&
                                            <Grid item xs={12}>
                                                <Button 
                                                    type="submit"
                                                    variant="contained"
                                                    color="primary"
                                                    fullWidth
                                                    onClick={completeTransaction}
                                                    disabled={loading || buyerHasRecievedPayment || isDeleted ? true : false}
                                                >
                                                    Payment Received:Buyer
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
                                                disabled={loading || buyerHasMadePayment || isDeleted ? true : false}
                                            >
                                                Cancel Transaction:Buyer
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
                                                    disabled={loading || sellerHasMadePayment || isDeleted ? true : false}
                                                    onClick={() => handlePayment({ buyerHasMadePayment, sellerHasMadePayment: true })}
                                                >
                                                    I've Made Payment:Seller
                                                </Button>
                                            </Grid>
                                        }
                                        {buyerHasMadePayment &&
                                            <Grid item xs={12}>
                                                <Button 
                                                    type="submit"
                                                    variant="contained"
                                                    color="primary"
                                                    fullWidth
                                                    onClick={completeTransaction}
                                                    disabled={loading || sellerHasRecievedPayment || isDeleted ? true : false}
                                                >
                                                    Payment Received:Seller
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
                                                disabled={loading || buyerHasMadePayment || isDeleted ? true : false}
                                            >
                                                Cancel Transaction:Seller
                                            </Button>
                                        </Grid>
                                    </>
                                }
                                {/* Seller Buttons End */}
                            </Grid>
                        </form>
                    </Grid>
                    <Grid item xs={12} className={classes.tipsContainer}>
                        <Typography variant="subtitle2" component="span" className={classes.tipsAndRecommendationsTitle}>Tips and Recommendations</Typography>
                        <ul className={classes.tipsAndRecommendationsList}>
                            <li>The seller should confirm the <strong>NGN(&#8358;) </strong> payment in their account before sending the <strong>EUR(&#163;)</strong> equivalent.</li>
                            <li>We recommend that the SELLER uses instant <strong>EUR(&#163;)</strong> payment when possible.</li>
                            <li>Both the SELLER and the BUYER must verify and confirm account details and payment reference provided.</li>
                            {/* <li>After a successful transaction, please rate the other party involved. Positive ratings will increase your trust level on FXBLOOMS</li> */}
                        </ul>
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