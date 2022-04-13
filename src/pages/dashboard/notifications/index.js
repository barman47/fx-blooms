import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Key, PhoneCheck, Passport } from 'mdi-material-ui';

import { COLORS, ID_STATUS, NOTIFICATION_TYPES } from '../../../utils/constants';
import formatNumber from '../../../utils/formatNumber';

import { getIdVerificationLink, getResidencePermitLink } from '../../../actions/customer';
import { completeTransaction } from '../../../actions/listings';
import { getNotifications, generateOtp } from '../../../actions/notifications';
import { SET_ACCOUNT, SET_BID, SET_CUSTOMER_MSG, SET_LISTING_MSG, SET_NOTIFICATION_MSG } from '../../../actions/types';

import extractCountryCode from '../../../utils/extractCountryCode';
import { PROFILE, TWO_FACTOR } from '../../../routes';

import Notification from './Notification';
import BuyerSendEurDrawer from './BuyerSendEurDrawer';
import SellerSendEurDrawer from './SellerSendEurDrawer';
import SellerSendNgnDrawer from './SellerSendNgnDrawer';
import VerifyPhoneNumberModal from '../profile/VerifyPhoneNumberModal';
import SuccessModal from '../../../components/common/SuccessModal';
import getCurrencySymbol from '../../../utils/getCurrencySymbol';

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

const Index = ({ completeTransaction, getIdVerificationLink, getResidencePermitLink, getNotifications, generateOtp, handleSetTitle }) => {
    const classes = useStyles();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { customerId, hasSetup2FA, isPhoneNumberVerified, idVerificationLink, phoneNo, residencePermitUrl, stats, msg } = useSelector(state => state.customer);
    const { notifications } = useSelector(state => state.notifications);

    const [amount, setAmount] = useState(0);
    const [sellerUsername, setSellerUsername] = useState('');
    const [buyerUsername, setBuyerUsername] = useState('');
    const [buyerSendEurDrawerOpen, setBuyerSendEurDrawerOpen] = useState(false);
    const [sellerSendEurDrawerOpen, setSellerSendEurDrawerOpen] = useState(false);
    const [sellerSendNgnDrawerOpen, setSellerSendNgnDrawerOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [transactionId, setTransactionId] = useState(null);
    const [countryCode, setCountryCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const successModal = useRef();

    const { APPROVED } = ID_STATUS;
    const { BUYER_MADE_PAYMENT, BUYER_CONFIRMED_PAYMENT, SELLER_MADE_PAYMENT, OFFER_MADE } = NOTIFICATION_TYPES;
    
    useEffect(() => {
        getNotifications();
        handleSetTitle('Notifications');

        if (!residencePermitUrl && stats.residencePermitStatus !== APPROVED) {
            getResidencePermitLink()
        }
        if (!residencePermitUrl && stats.idStatus !== APPROVED) {
            getIdVerificationLink();
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (msg) {
            successModal.current.openModal();
            successModal.current.setModalText(msg);
        }
    }, [msg]);

    useEffect(() => {
        if (!sellerSendEurDrawerOpen) {
            setAmount(0);
            setTransactionId(null);
            setSellerUsername('');
            dispatch({
                type: SET_ACCOUNT,
                payload: {}
            });
        }
    }, [dispatch, sellerSendEurDrawerOpen]);

    const handlePaymentReceived = (tranactionId, notificationId) => {
        const data = {
            transactionSessionId: tranactionId,
            message: '',
            rating: 0,
            receivedExpectedFunds: true,
            notificationId
        };
        completeTransaction(data);
    };

    const setBuyerAccount = (notification) => {
        const { Buyer, Seller } = notification;
        setTransactionId(notification.Id);
        setSellerUsername(Seller.UserName);
        
        const buyerAccount = {
            accounName: Buyer.AccountName,
            accountNumber: Buyer.AccountNumber,
            bankName: Buyer.BankName,
            reference: Buyer.TransferReference
        };

        // if (Buyer.HasMadePayment) {
            // Seller should make payment since buyer has paid
            setAmount(Number(Seller.AmountTransfered));
            dispatch({
                type: SET_ACCOUNT,
                payload: buyerAccount
            });
        // }
        // dispatch({
        //     type: SET_NOTIFICATION_MSG,
        //     payload: `Thanks for confirming ${Buyer.UserName}'s payment. Please proceed and send the EUR equivalent to the account below. `
        // });
        
        toggleSellerSendEurDrawer();
    };

    const setSellerAccount = (notification) => {
        const { Buyer, Seller } = notification;
        setTransactionId(notification.Id);
        setBuyerUsername(Buyer.UserName);
        
        const sellerAccount = {
            accounName: Seller.AccountName,
            accountNumber: Seller.AccountNumber,
            bankName: Seller.BankName,
            reference: Seller.TransferReference
        };

        // if (Seller.HasMadePayment) {
            // Buyer should make payment since seller has paid
            setAmount(Number(Buyer.AmountTransfered));
            dispatch({
                type: SET_ACCOUNT,
                payload: sellerAccount
            });
        // }
        // dispatch({
        //     type: SET_NOTIFICATION_MSG,
        //     payload: `Thanks for confirming ${Seller.UserName}'s payment. Please proceed and send the EUR equivalent to the account below. `
        // });
        toggleBuyerSendEurDrawer();
    };

    const toggleBuyerSendEurDrawer = () => {
        setBuyerSendEurDrawerOpen(!buyerSendEurDrawerOpen);

        // clear message if drawer is open and being closed
        if (buyerSendEurDrawerOpen) {
            dispatch({
                type: SET_NOTIFICATION_MSG,
                payload: null
            });
        }
    };

    const toggleSellerSendEurDrawer = () => {
        setSellerSendEurDrawerOpen(!sellerSendEurDrawerOpen);

        // clear message if drawer is open and being closed
        if (sellerSendEurDrawerOpen) {
            dispatch({
                type: SET_NOTIFICATION_MSG,
                payload: null
            });
        }
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

    const setBuyerConfirmedMessage = (notification) => {
        const { Buyer, Seller } = notification;
        return `${Buyer.UserName} has confirmed your payment of ${getCurrencySymbol(Seller.Currency)}${formatNumber(Seller.AmountTransfered)}`;
    };

    // const setSellerConfirmedMessage = (notification) => {
    //     const { Buyer, Seller } = notification;
    //     return `${Seller.UserName} has confirmed your payment of ${getCurrencySymbol(Buyer.Currency)}${formatNumber(Buyer.AmountTransfered)}`;
    //     // return `${Seller.UserName} has confirmed your payment of ${decode('&#8358;', { level: 'html5' })}${formatNumber(Buyer.AmountTransfered)}`;
    // };

    // const hasNotification = (notification) => {
    //     const { Buyer, Seller } = notification;
    //     const isBuyer = customerId === Buyer?.customerId ? true : false;
    //     const isSeller = customerId === Seller?.customerId ? true : false;
    //     let result = false;

    //     if (isBuyer && Seller.hasMadePayment) {
    //         result = true;
    //     }
    //     if (isSeller && Buyer.hasMadePayment) {
    //         result = true;
    //     }
    //     return result;
    // };

    const buttonDisabled = (seller) => {
        const isSeller = customerId === seller.CustomerId ? true : false;

        if (isSeller && seller.HasReceivedPayment && seller.HasMadePayment) {
            return true;
        }
    };

    // const offerAcceptedButtonDisabled = (seller) => {
    //     const isSeller = customerId === seller.CustomerId ? true : false;

    //     if (isSeller && seller.HasMadePayment) {
    //         return true;
    //     }
    // };

    const setOfferAcceptedMessage = (bid) => {
        const { Buyer, Seller } = bid;
        return `${Buyer.UserName} has accepted your offer. Please proceed and transfer ${Seller.Currency}${formatNumber(Seller.AmountTransfered, 2)} to the account provided.`;
    };

    const handleButtonAction = (notification, notificationId) => {
        const { Buyer, Seller } = notification;

        if (customerId === Seller.CustomerId) {
            if (Seller.HasReceivedPayment && Seller.HasMadePayment === false) {
                // Set Buyer Account so Seller can make payment without needing to confirm receipt
                return setBuyerAccount(notification, notificationId);
            }
            if (Seller.HasReceivedPayment === false && Seller.HasMadePayment === false) {
                // Seller should receive buyers payment and make payment to seller
                console.log('Seller receiving payment');
                setBuyerAccount(notification, notificationId);
                return handlePaymentReceived(notification.Id, notificationId);
            }
            // End Transaction
            return handlePaymentReceived(notification.Id, notificationId);
        }


        if (customerId === Buyer.CustomerId) {
            if (Buyer.HasReceivedPayment && Buyer.HasMadePayment === false) {
                // Set Seller Account so Buyer can make payment without needing to confirm receipt
                return setSellerAccount(notification, notificationId);
            } 
            if (Buyer.HasReceivedPayment === false && Buyer.HasMadePayment === false) {
                // Buyer should confirm seller's payment and make his own payment
                console.log('Buyer making payment');
                setSellerAccount(notification, notificationId);
                return handlePaymentReceived(notification.Id, notificationId); // Confirming payment
            } 
            // End Transaction
            handlePaymentReceived(notification.Id, notificationId);
        }
    };

    const verifyEuId = () => {
        window.open(residencePermitUrl);
    };

    const verifyOtherId = () => {
        window.open(idVerificationLink);
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
        dispatch({
            type: SET_BID,
            payload: bid
        });
        console.log(bid);
        toggleSellerSendNgnDrawer();
    };

    const dismissAction = () => {
        setOpen(false);
        setSellerSendEurDrawerOpen(false);
        setSellerSendNgnDrawerOpen(false);
        setBuyerSendEurDrawerOpen(false);
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
            {sellerSendNgnDrawerOpen && 
                <SellerSendNgnDrawer 
                    drawerOpen={sellerSendNgnDrawerOpen} 
                    toggleDrawer={toggleSellerSendNgnDrawer} 
                />
            }
            {sellerSendEurDrawerOpen && 
                <SellerSendEurDrawer 
                    toggleDrawer={toggleSellerSendEurDrawer} 
                    drawerOpen={sellerSendEurDrawerOpen} 
                    amount={amount} 
                    transactionId={transactionId}
                    sellerUsername={sellerUsername}
                />
            }
            {buyerSendEurDrawerOpen && 
                <BuyerSendEurDrawer 
                    toggleDrawer={toggleBuyerSendEurDrawer} 
                    drawerOpen={buyerSendEurDrawerOpen} 
                    amount={amount} 
                    transactionId={transactionId}
                    buyerUsername={buyerUsername}
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
                                        // buttonAction={() => setBuyerAccount(notification)}
                                        buttonDisabled={buttonDisabled(notification.data.Seller)}
                                    />
                                )
                            }

                            if (notification.eventType === BUYER_CONFIRMED_PAYMENT && customerId === notification.data.Seller.CustomerId && notification.data.Buyer.HasMadePayment === false) {
                                return (
                                    <Notification 
                                        key={index}
                                        title="Payment Confirmed"
                                        message={setBuyerConfirmedMessage(notification.data)}
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
                                    />
                                )
                            }

                            if (notification.eventType === BUYER_CONFIRMED_PAYMENT && customerId === notification.data.Buyer.CustomerId) {
                                return (
                                    <Notification 
                                        key={index}
                                        title="Credit (Exchange)"
                                        message={setMessage(notification.data)}
                                        buttonText={`Pay ${notification.data.Buyer.Currency}`}
                                        buttonAction={() => handleBuyerPayment(notification)}
                                    />
                                )
                            }

                            // if (notification.eventType === SELLER_CONFIRMED_PAYMENT && customerId === notification.data.Buyer.CustomerId) {
                            //     return (
                            //         <Notification 
                            //             key={index}
                            //             title="Payment Confirmed"
                            //             message={setSellerConfirmedMessage(notification.data)}
                            //         />
                            //     )
                            // }

                            if (notification.eventType === OFFER_MADE && customerId === notification.data.Seller.CustomerId) {
                                return (
                                    <Notification 
                                        key={index}
                                        title="Offer Accepted"
                                        message={setOfferAcceptedMessage(notification.data)}
                                        buttonText={`Pay ${notification.data.Seller.Currency}`}
                                        buttonAction={() => handleBuyerPayment(notification)}
                                        buttonDisabled={notification.data.Seller.HasMadePayment}
                                    />
                                )
                            }
                            return null;
                        })}
                        {stats.residencePermitStatus !== APPROVED &&
                            <Notification 
                                title="Verify your EU Government Issued ID"
                                message="Required to BUY and SELL. Click Verify ID to proceed."
                                buttonText="Verify ID"
                                buttonAction={verifyEuId}
                                icon={<Passport />}
						        iconBackgroundColor="#000100"
                            />
                        }
                        {/* eslint-disable-next-line no-mixed-operators */}
                        {((stats.idStatus !== APPROVED) && (stats.residencePermitStatus !== APPROVED)) && (
                            <Notification 
                                title="Verify Other Government Issued ID"
                                message="Required to BUY only. Click Verify ID to proceed."
                                buttonText="Verify ID"
                                buttonAction={verifyOtherId}
                                icon={<Passport />}
						        iconBackgroundColor="#000100"
                            />
                        )}
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
                        {/* <Notification 
                            title="Set PIN"
                            message="Required for wallet withdrawals.. Click Set PIN to proceed."
                            buttonText="Set PIN"
                            buttonAction={setPin}
                        /> */}
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
    getNotifications: PropTypes.func.isRequired,
    getIdVerificationLink: PropTypes.func.isRequired,
    getResidencePermitLink: PropTypes.func.isRequired,
    generateOtp: PropTypes.func.isRequired
};

export default connect(undefined, { completeTransaction, getIdVerificationLink, getResidencePermitLink, getNotifications, generateOtp })(Index);
