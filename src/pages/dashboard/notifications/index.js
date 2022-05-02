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
import { getTransaction } from '../../../actions/transactions';
import { getNotifications, generateOtp } from '../../../actions/notifications';
import { GET_ERRORS, SET_ACCOUNT, SET_BID, SET_CUSTOMER_MSG, SET_LISTING_MSG, SET_NOTIFICATION_MSG } from '../../../actions/types';

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

const Index = ({ completeTransaction, getIdVerificationLink, getResidencePermitLink, getTransaction, getNotifications, generateOtp, handleSetTitle }) => {
    const classes = useStyles();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { customerId, hasSetup2FA, isPhoneNumberVerified, idVerificationLink, phoneNo, residencePermitUrl, stats, msg } = useSelector(state => state.customer);
    const { notifications } = useSelector(state => state.notifications);

    const [amount, setAmount] = useState(0);
    const [sellerUsername, setSellerUsername] = useState('');
    const [buyerSendEurDrawerOpen, setBuyerSendEurDrawerOpen] = useState(false);
    const [sellerSendEurDrawerOpen, setSellerSendEurDrawerOpen] = useState(false);
    const [sellerSendNgnDrawerOpen, setSellerSendNgnDrawerOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [transactionId, setTransactionId] = useState(null);
    const [notificationId, setNotificationId] = useState(null);
    const [countryCode, setCountryCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const successModal = useRef();

    const { APPROVED } = ID_STATUS;
    const { BUYER_MADE_PAYMENT, BUYER_CONFIRMED_PAYMENT, SELLER_MADE_PAYMENT, SELLER_CONFIRMED_PAYMENT, OFFER_MADE } = NOTIFICATION_TYPES;
    
    useEffect(() => {
        getNotifications();
        handleSetTitle('Notifications');

        if (!residencePermitUrl && stats.residencePermitStatus !== APPROVED) {
            getResidencePermitLink()
        }
        if (!residencePermitUrl && stats.idStatus !== APPROVED) {
            getIdVerificationLink();
        }

        return () => {
            console.log('Clearing errors');
            dispatch({
                type: GET_ERRORS,
                payload: {}
            });
        };
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
    
    // accounName typo is deliberate and should not be fixed
    const setAccount = (accounName, accountNumber, bankName, reference) => {
        dispatch({
            type: SET_ACCOUNT,
            payload: {
                accounName,
                accountNumber,
                bankName,
                reference
            }
        });
    };

    const handlePaymentReceived = (tranactionId, notificationId) => {
        const data = {
            transactionSessionId: tranactionId,
            message: '',
            rating: 0,
            receivedExpectedFunds: true,
            notificationId
        };
        completeTransaction(data, notificationId);
    };

    const setBuyerAccount = (notification, notificationId) => {
        const { Buyer, Seller } = notification;
        setTransactionId(notification.Id);
        setSellerUsername(Seller.UserName);
        
        const buyerAccount = {
            accounName: Buyer.AccountName,
            accountNumber: Buyer.AccountNumber,
            bankName: Buyer.BankName,
            reference: Buyer.TransferReference
        };

        setAmount(Number(Seller.AmountTransfered));
        dispatch({
            type: SET_ACCOUNT,
            payload: buyerAccount
        });
        setNotificationId(notificationId);
        getTransaction(notification.Id);
        toggleSellerSendEurDrawer();
    };

    const setSellerAccount = (notification, notificationId) => {
        const { Buyer, Seller } = notification;
        setTransactionId(notification.Id);
        setAmount(Number(Buyer.AmountTransfered));
        setAccount(Seller.AccountName, Seller.AccountNumber, Seller.BankName, Seller.TransferReference);
        setNotificationId(notificationId);
        getTransaction(notification.Id);
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
        // clear message if drawer is open and being closed
        if (sellerSendEurDrawerOpen) {
            dispatch({
                type: SET_NOTIFICATION_MSG,
                payload: null
            });
        }
        setSellerSendEurDrawerOpen(!sellerSendEurDrawerOpen);        
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
        if (customerId === Seller.CustomerId) {
            if (Seller.HasReceivedPayment && Seller.HasMadePayment === false) {
                // Set Buyer Account so Seller can make payment without needing to confirm receipt
                return setBuyerAccount(notification, notificationId);
            }
            if (Seller.HasReceivedPayment === false && Seller.HasMadePayment === false) {
                // Seller should receive buyers payment and make payment to seller
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
                setSellerAccount(notification, notificationId);
                return handlePaymentReceived(notification.Id, notificationId); // Confirming payment
            } 
            // End Transaction
            return handlePaymentReceived(notification.Id, notificationId);
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
        const { notificationId, data } = bid;
        setNotificationId(notificationId);
        dispatch({
            type: SET_BID,
            payload: bid
        });

        if (data.Buyer.HasReceivedPayment && !data.Buyer.HasMadePayment) {
            setAmount(Number(data.Buyer.AmountTransfered));
            setTransactionId(data.Id); // Double check
            setAccount(data.Seller.AccountName, data.Seller.AccountNumber, data.Seller.BankName, data.Seller.TransferReference);
            toggleBuyerSendEurDrawer();
            getTransaction(data.Id);
        } else {
            toggleSellerSendNgnDrawer();
            getTransaction(data.Id);
        }
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
                    notificationId={notificationId}
                />
            }
            {sellerSendEurDrawerOpen && 
                <SellerSendEurDrawer 
                    toggleDrawer={toggleSellerSendEurDrawer} 
                    drawerOpen={sellerSendEurDrawerOpen} 
                    amount={amount} 
                    transactionId={transactionId}
                    notificationId={notificationId}
                    sellerUsername={sellerUsername}
                />
            }
            {buyerSendEurDrawerOpen && 
                <BuyerSendEurDrawer 
                    toggleDrawer={toggleBuyerSendEurDrawer} 
                    drawerOpen={buyerSendEurDrawerOpen} 
                    amount={amount} 
                    transactionId={transactionId}
                    notificationId={notificationId}
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

                            if (notification.eventType === BUYER_CONFIRMED_PAYMENT && customerId === notification.data.Buyer.CustomerId) {
                                return (
                                    <Notification 
                                        key={index}
                                        title="Credit (Exchange)"
                                        message={setMessage(notification.data)}
                                        buttonText={`Pay ${notification.data.Buyer.Currency}`}
                                        buttonAction={() => handleBuyerPayment(notification)}
                                        date={notification.dateLogged}
                                    />
                                )
                            }

                            if (notification.eventType === SELLER_CONFIRMED_PAYMENT && customerId === notification.data.Seller.CustomerId) {
                                return (
                                    <Notification 
                                        key={index}
                                        title="Credit (Exchange)"
                                        message={setMessage(notification.data)}
                                        buttonText={`Pay ${notification.data.Seller.Currency}`}
                                        buttonAction={() => handleButtonAction(notification.data, notification.notificationId)}
                                        date={notification.dateLogged}
                                    />
                                )
                            }

                            // if (notification.eventType === BUYER_CONFIRMED_PAYMENT && customerId === notification.data.Seller.CustomerId && notification.data.Buyer.HasMadePayment === false) {
                            //     return (
                            //         <Notification 
                            //             key={index}
                            //             title="Payment Confirmed"
                            //             message={setBuyerConfirmedMessage(notification.data)}
                            //             date={notification.dateLogged}
                            //         />
                            //     )
                            // }
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
    getTransaction: PropTypes.func.isRequired,
    getNotifications: PropTypes.func.isRequired,
    getIdVerificationLink: PropTypes.func.isRequired,
    getResidencePermitLink: PropTypes.func.isRequired,
    generateOtp: PropTypes.func.isRequired
};

export default connect(undefined, { completeTransaction, getIdVerificationLink, getResidencePermitLink, getTransaction, getNotifications, generateOtp })(Index);
