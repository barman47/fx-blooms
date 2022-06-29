import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { batch, connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Key, PhoneCheck, Passport } from 'mdi-material-ui';

import { COLORS, ID_STATUS, NOTIFICATION_TYPES } from '../../../utils/constants';
import formatNumber from '../../../utils/formatNumber';

import { completeTransaction } from '../../../actions/listings';
import { getTransaction } from '../../../actions/transactions';
import { getNotifications, generateOtp } from '../../../actions/notifications';
import { GET_ERRORS, SET_BID, SET_BIDS, SET_CUSTOMER_MSG, SET_LISTING_MSG } from '../../../actions/types';

import extractCountryCode from '../../../utils/extractCountryCode';
import getCurrencySymbol from '../../../utils/getCurrencySymbol';
import { PROFILE, PIN, TWO_FACTOR, VERIFF } from '../../../routes';

import Notification from './Notification';
import SellerSendNgnDrawer from './SellerSendNgnDrawer';
import VerifyPhoneNumberModal from '../profile/VerifyPhoneNumberModal';
import Spinner from '../../../components/common/Spinner';
import SuccessModal from '../../../components/common/SuccessModal';
import TimeElapsedModal from '../../../components/common/TimeElapsedModal';
import Toast from '../../../components/common/Toast';
import isEmpty from '../../../utils/isEmpty';

const useStyles = makeStyles(theme => ({
    root: {
        marginBottom: theme.spacing(8),
        paddingLeft: theme.spacing(5),
        paddingRight: theme.spacing(5),

        [theme.breakpoints.down('md')]: {
            marginBottom: theme.spacing(3)
        },

        [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
        },

        '& h6': {
            color: COLORS.offBlack,
            fontWeight: '600',
            marginTop: theme.spacing(4),
            marginBottom: theme.spacing(2),
        },

        '& div:nth-child(3)': {
            display: 'grid',
            gridTemplateColumns: '3fr 1fr',
            gap: theme.spacing(3),

            [theme.breakpoints.down('md')]: {
                display: 'flex',
                flexDirection: 'column-reverse'
            },

            '& aside': {
                backgroundColor: COLORS.lightTeal,
                borderRadius: theme.shape.borderRadius,
                boxSizing: 'border-box',
                marginTop: theme.spacing(2),
                padding: theme.spacing(2),
                alignSelf: 'flex-start',
                
                [theme.breakpoints.down('md')]: {
                    width: '100%',
                },

                '& h6': {
                    color: theme.palette.primary.main,
                    margin: 0,
                    marginBottom: theme.spacing(2),
                },

                '& p': {
                    color: COLORS.offBlack,
                    fontWeight: '400',
                    margin: 0,
                    marginBottom: theme.spacing(2),
                }
            }
        }
    },

    notifications: {
        alignItems: 'flex-start',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: theme.spacing(4),
        marginTop: theme.spacing(2),
        maxWidth: '100%',
    }
}));

const Index = ({ completeTransaction, getTransaction, getNotifications, generateOtp, handleSetTitle }) => {
    const classes = useStyles();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { customerId, hasSetPin, hasSetup2FA, isPhoneNumberVerified, phoneNo, stats, msg } = useSelector(state => state.customer);
    const errorsState = useSelector(state => state.errors);
    const { notifications } = useSelector(state => state.notifications);

    const [sellerSendNgnDrawerOpen, setSellerSendNgnDrawerOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [notificationId, setNotificationId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [countryCode, setCountryCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [errors, setErrors] = useState({});

    const successModal = useRef();
    const timeElapsedModal = useRef();
    const toast = useRef();

    const { APPROVED } = ID_STATUS;
    const { BUYER_MADE_PAYMENT, SELLER_MADE_PAYMENT, OFFER_MADE } = NOTIFICATION_TYPES;
    
    useEffect(() => {
        getNotifications();
        handleSetTitle('Notifications');

        return () => {
            dispatch({
                type: GET_ERRORS,
                payload: {}
            });
        };
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (!isEmpty(errors)) {
            toast.current.handleClick();
        }
    }, [errors]);

    useEffect(() => {
        if (errorsState?.msg) {
            setErrors({ ...errorsState });
            setLoading(false);
            dispatch({
                type: GET_ERRORS,
                payload: {}
            });
        }
    }, [dispatch, errorsState, errors]);

    useEffect(() => {
        if (msg) {
            setLoading(false);
            successModal.current.openModal();
            successModal.current.setModalText(msg);
        }
    }, [msg]);

    const handleOpenTimeElapsedModal = () => {
        timeElapsedModal.current.openModal();
    };

    const handlePaymentReceived = (tranactionId, notificationId) => {
        setLoading(true);
        const data = {
            transactionSessionId: tranactionId,
            message: '',
            rating: 0,
            receivedExpectedFunds: true,
            notificationId
        };
        completeTransaction(data, notificationId);
    };

    const setMessage = (notification) => {
        const { Buyer, Seller } = notification;
        const isBuyer = Buyer.CustomerId === customerId ? true : false;
        const isSeller = Seller.CustomerId === customerId ? true : false;

        let message;

        if (isSeller && Buyer.HasMadePayment) {
            message = `${Buyer.UserName} has made a payment of ${getCurrencySymbol(Buyer.Currency)}${formatNumber(Buyer.AmountTransfered)} to your ${Seller.BankName} account | ${Seller.AccountNumber}`;
        }

        if (isBuyer && Seller.HasMadePayment) {
            message = `${Seller.UserName} has made a payment of ${getCurrencySymbol(Seller.Currency)}${formatNumber(Seller.AmountTransfered)} to your ${Buyer.BankName} account | ${Buyer.AccountNumber}`;

        }
        return message;
    };

    const buttonDisabled = (seller) => {
        const isSeller = customerId === seller.CustomerId ? true : false;

        if (isSeller && seller.HasReceivedPayment && seller.HasMadePayment) {
            return true;
        }
    };

    const setOfferAcceptedMessage = (bid) => {
        const { Buyer, Seller } = bid;
        return `${Buyer.UserName} has accepted your offer. Please proceed and transfer ${Seller.Currency}${formatNumber(Seller.AmountTransfered, 2)} to the account provided.`;
    };

    const handleButtonAction = (notification, notificationId) => {
        const { Buyer, Seller } = notification;
        setLoading(true);
        if (customerId === Seller.CustomerId) {
            return handlePaymentReceived(notification.Id, notificationId);
        }

        if (customerId === Buyer.CustomerId) {
            return handlePaymentReceived(notification.Id, notificationId);
        }
    };

    const verifyPhone = () => {
        if (phoneNo) {
            const { code, number } = extractCountryCode(phoneNo);
            generateOtp({
                countryCode: code,
                telephoneNumber: number.charAt(0) === '0' ? number.substring(1, number.length) : number
            });
            setCountryCode(code);
            setPhoneNumber(number);
            return setOpen(true);
        }
        return navigate(PROFILE)
    };
    // const setPin = () => navigate(`${DASHBOARD}${SECURITY}`, { setPin: true });

    const toggleSellerSendNgnDrawer = () => {
        setSellerSendNgnDrawerOpen(!sellerSendNgnDrawerOpen);
    };

    const handleBuyerPayment = (bid) => {
        const { notificationId, data } = bid;
        setNotificationId(notificationId);
        batch(() => {
            dispatch({
                type: SET_BID,
                payload: bid
            });

            // Clear bids before opening the drawer so as not to make the call to cancel bids when the drawer opens
            dispatch({
                type: SET_BIDS,
                payload: []
            });
        });

        // if (data.Buyer.HasReceivedPayment && !data.Buyer.HasMadePayment) {
        //     setAmount(Number(data.Buyer.AmountTransfered));
        //     setTransactionId(data.Id); // Double check
        //     setAccount(data.Seller.AccountName, data.Seller.AccountNumber, data.Seller.BankName, data.Seller.TransferReference);
        //     toggleBuyerSendEurDrawer();
        //     getTransaction(data.Id);
        // } else {
        //     toggleSellerSendNgnDrawer();
        //     getTransaction(data.Id);
        // }
        toggleSellerSendNgnDrawer();
        getTransaction(data.Id);
    };

    const dismissAction = () => {
        setOpen(false);
        setSellerSendNgnDrawerOpen(false);
        dispatch({
            type: SET_LISTING_MSG,
            payload: null
        });
        dispatch({
            type: SET_CUSTOMER_MSG,
            payload: null
        });
    };

    return (
        <>
            {!isEmpty(errors) && 
                <Toast 
                    ref={toast}
                    title="ERROR"
                    duration={5000}
                    msg={errors.msg || ''}
                    type="error"
                />
            }
            {loading && <Spinner />}
            <TimeElapsedModal ref={timeElapsedModal} />
            {sellerSendNgnDrawerOpen && 
                <SellerSendNgnDrawer 
                    drawerOpen={sellerSendNgnDrawerOpen} 
                    toggleDrawer={toggleSellerSendNgnDrawer} 
                    notificationId={notificationId}
                    handleOpenTimeElapsedModal={handleOpenTimeElapsedModal}
                />
            }
            {open && 
                <VerifyPhoneNumberModal 
                    isOpen={open} 
                    dismissAction={dismissAction} 
                    phoneNumber={phoneNumber}
                    countryCode={countryCode}
                />
            }
            <SuccessModal ref={successModal} dismissAction={dismissAction} />
            <section className={classes.root}>
                <Typography variant="h6">Notifications</Typography>
                <Typography variant="body2" component="p">View notifications below</Typography>
                <div>
                    <section className={classes.notifications}>
                        {notifications.map((notification, index) => {
                            if (notification.eventType === BUYER_MADE_PAYMENT && customerId === notification.data.Seller.CustomerId) {
                                return (
                                    <Notification 
                                        key={index}
                                        title="Credit (Exchange)"
                                        message={setMessage(notification.data)}
                                        buttonText={buttonDisabled(notification.data.Seller) ? 'Payment Confirmed' : 'Confirm payment'}
                                        buttonAction={() => handleButtonAction(notification.data, notification.notificationId)}
                                        buttonDisabled={buttonDisabled(notification.data.Seller)}
                                        date={notification.dateLogged}
                                    />
                                )
                            }

                            if (notification.eventType === SELLER_MADE_PAYMENT && customerId === notification.data.Buyer.CustomerId) {
                                return (
                                    <Notification 
                                        key={index}
                                        title="Credit (Exchange)"
                                        message={setMessage(notification.data)}
                                        buttonText={buttonDisabled(notification.data.Seller) ? 'Payment Confirmed' : 'Confirm payment'}
                                        buttonAction={() => handleButtonAction(notification.data, notification.notificationId)}
                                        // buttonAction={() => setBuyerAccount(notification)}
                                        buttonDisabled={buttonDisabled(notification.data.Seller)}
                                        date={notification.dateLogged}
                                    />
                                )
                            }

                            if (notification.eventType === OFFER_MADE && customerId === notification.data.Seller.CustomerId) {
                                return (
                                    <Notification 
                                        key={index}
                                        title="Offer Accepted"
                                        message={setOfferAcceptedMessage(notification.data)}
                                        buttonText={`Pay ${notification.data.Seller.Currency}`}
                                        buttonAction={() => handleBuyerPayment(notification)}
                                        buttonDisabled={notification.data.Seller.HasMadePayment}
                                        date={notification.dateLogged}
                                    />
                                )
                            }

                            // if (notification.eventType === BUYER_CONFIRMED_PAYMENT && customerId === notification.data.Buyer.CustomerId) {
                            //     return (
                            //         <Notification 
                            //             key={index}
                            //             title="Credit (Exchange)"
                            //             message={setMessage(notification.data)}
                            //             buttonText={`Pay ${notification.data.Buyer.Currency}`}
                            //             buttonAction={() => handleBuyerPayment(notification)}
                            //             date={notification.dateLogged}
                            //         />
                            //     )
                            // }

                            // if (notification.eventType === SELLER_CONFIRMED_PAYMENT && customerId === notification.data.Seller.CustomerId) {
                            //     return (
                            //         <Notification 
                            //             key={index}
                            //             title="Credit (Exchange)"
                            //             message={setMessage(notification.data)}
                            //             buttonText={`Pay ${notification.data.Seller.Currency}`}
                            //             buttonAction={() => handleButtonAction(notification.data, notification.notificationId)}
                            //             date={notification.dateLogged}
                            //         />
                            //     )
                            // }
                            return null;
                        })}
                        {stats.idStatus !== APPROVED &&
                            <Notification 
                                title="Verify  your Identity"
                                message="Required to BUY only. Click Verify ID to proceed."
                                buttonText="Verify ID"
                                buttonAction={() => navigate(VERIFF)}
                                icon={<Passport />}
						        iconBackgroundColor="#000100"
                            />
                        }
                        {!hasSetup2FA &&
                            <Notification 
                                title="Set up 2FA"
                                message="Add extra layer of Security"
                                buttonText="Setup 2FA"
                                buttonAction={() => navigate(TWO_FACTOR)}
						        icon={<Key />}
						        iconBackgroundColor="#000100"
                            />
                        }
                        {!isPhoneNumberVerified && 
                            <Notification 
                                title="Verify phone number"
                                message="Required to receive SMS notifications. Click Verify Phone to proceed."
                                buttonText="Verify Phone"
                                buttonAction={verifyPhone}
                                icon={<PhoneCheck />}
						        iconBackgroundColor="#2893EB"
                            />
                        }
                        {!hasSetPin && 
                            <Notification 
                                title="Set PIN"
                                message="Required for wallet withdrawals. Click Set PIN to proceed."
                                buttonText="Set PIN"
                                buttonAction={() => navigate(PIN)}
                            />
                        }
                    </section>
                    <aside>
                        <Typography variant="h6">Attention</Typography>
                        <Typography variant="body2" component="p">Make sure you confirm all payments in your banking app.</Typography>
                        <Typography variant="body2" component="p">Do not rely on transaction receipts or any other form of confirmation.</Typography>
                    </aside>
                </div>
            </section>
        </>
    );
};

Index.propTypes = {
    completeTransaction: PropTypes.func.isRequired,
    getTransaction: PropTypes.func.isRequired,
    getNotifications: PropTypes.func.isRequired,
    generateOtp: PropTypes.func.isRequired
};

export default connect(undefined, { completeTransaction, getTransaction, getNotifications, generateOtp })(Index);
