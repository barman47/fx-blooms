import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Key, PhoneCheck, Passport } from 'mdi-material-ui';
import { decode } from 'html-entities';

import { COLORS, ID_STATUS, NOTIFICATION_TYPES } from '../../../utils/constants';
import formatNumber from '../../../utils/formatNumber';

import { getIdVerificationLink, getResidencePermitLink } from '../../../actions/customer';
import { completeTransaction } from '../../../actions/listings';
import { getNotifications, generateOtp } from '../../../actions/notifications';
import { SET_ACCOUNT, SET_BID, SET_CUSTOMER_MSG, SET_NOTIFICATION_MSG } from '../../../actions/types';

import extractCountryCode from '../../../utils/extractCountryCode';
import { ACCOUNT } from '../../../routes';

import Notification from './Notification';
import SellerSendEurDrawer from './SellerSendEurDrawer';
import SellerSendNgnDrawer from './SellerSendNgnDrawer';
import VerifyPhoneNumberModal from '../profile/VerifyPhoneNumberModal';
import SuccessModal from '../../../components/common/SuccessModal';

const useStyles = makeStyles(theme => ({
    root: {
        marginBottom: theme.spacing(8),
        marginTop: theme.spacing(8),
        paddingLeft: theme.spacing(5),
        paddingRight: theme.spacing(5),

        [theme.breakpoints.down('md')]: {
            marginBottom: theme.spacing(3),
            // paddingLeft: theme.spacing(5),
            // paddingRight: theme.spacing(5),
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
            maxWidth: '100%',

            [theme.breakpoints.down('md')]: {
                display: 'flex',
                flexDirection: 'column-reverse'
            },

            '& aside': {
                backgroundColor: COLORS.lightTeal,
                borderRadius: theme.shape.borderRadius,
                marginTop: theme.spacing(2),
                padding: theme.spacing(2),
                alignSelf: 'flex-start',

                [theme.breakpoints.down('md')]: {
                    width: '100%'
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
    const history = useHistory();
    const dispatch = useDispatch();
    const { customerId, hasSetup2FA, isPhoneNumberVerified, idVerificationLink, phoneNo, residencePermitUrl, stats, msg } = useSelector(state => state.customer);
    const { notifications } = useSelector(state => state.notifications);

    const [amount, setAmount] = useState(0);
    const [sellerUsername, setSellerUsername] = useState('');
    const [sellerSendEurDrawerOpen, setSellerPaymentDrawerOpen] = useState(false);
    const [openSellerSendNgnDrawer, setOpenBuyerPaymentDrawer] = useState(false);
    const [open, setOpen] = useState(false);
    const [transactionId, setTransactionId] = useState(null);
    const [countryCode, setCountryCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const successModal = useRef();

    const { APPROVED } = ID_STATUS;
    const { BUYER_MADE_PAYMENT, OFFER_MADE } = NOTIFICATION_TYPES;
    
    useEffect(() => {
        getNotifications(false);
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

    const handlePaymentReceived = (id, buyerUsername) => {
        const data = {
            transactionSessionId: id,
            message: '',
            rating: 0,
            receivedExpectedFunds: true
        };
        completeTransaction(data, buyerUsername);
    };

    const setBuyerAccount = (notification) => {
        const { buyer, seller } = notification;
        setTransactionId(notification.id);
        setSellerUsername(seller.userName);
        
        const buyerAccount = {
            accounName: buyer.accountName,
            accountNumber: buyer.accountNumber,
            bankName: buyer.bankName,
            reference: buyer.transferReference
        };

        if (buyer.hasMadePayment) {
            // Seller should make payment since buyer has paid
            setAmount(Number(seller.amountTransfered));
            dispatch({
                type: SET_ACCOUNT,
                payload: buyerAccount
            });
        }
        dispatch({
            type: SET_NOTIFICATION_MSG,
            payload: `Thanks for confirming ${buyer.userName}'s payment. Please proceed and send the EUR equivalent to the account below. `
        });
        
        toggleSellerSendEurDrawer();
    };

    const toggleSellerSendEurDrawer = () => {
        setSellerPaymentDrawerOpen(!sellerSendEurDrawerOpen);

        // clear message if drawer is open and being closed
        if (sellerSendEurDrawerOpen) {
            dispatch({
                type: SET_NOTIFICATION_MSG,
                payload: null
            });
        }
    }

    const setMessage = (notification) => {
        const { Buyer, Seller } = notification;
        const isBuyer = customerId === Buyer.CustomerId ? true : false;
        const isSeller = customerId === Seller.CustomerId ? true : false;
        
        console.log('buyer ', isBuyer);
        console.log('seller ', isSeller);


        let message;

        if (isSeller && Buyer.HasMadePayment) {
            console.log('Setting message');
            message = `${Buyer.UserName} has made a payment of ${decode('&#8358;', { level: 'html5' })}${formatNumber(Buyer.AmountTransfered)} to your ${Seller.BankName} account | ${Seller.AccountNumber}`;

        }

        if (isBuyer && Seller.HasMadePayment) {
            console.log('Setting message');
            message = `${Seller.UserName} has made a payment of ${decode('&#8364;', { level: 'html5' })}${formatNumber(Seller.AmountTransfered)} to your ${Buyer.BankName} account | ${Buyer.AccountNumber}`;

        }
        return message;
    };

    const hasNotification = (notification) => {
        const { Buyer, Seller } = notification;
        const isBuyer = customerId === Buyer?.customerId ? true : false;
        const isSeller = customerId === Seller?.customerId ? true : false;
        let result = false;

        if (isBuyer && Seller.hasMadePayment) {
            result = true;
        }
        if (isSeller && Buyer.hasMadePayment) {
            result = true;
        }
        return result;
    };

    const buttonDisabled = (seller) => {
        const isSeller = customerId === seller.CustomerId ? true : false;

        if (isSeller && seller.HasReceivedPayment && seller.HasMadePayment) {
            return true;
        }
    };

    const offerAcceptedButtonDisabled = (seller) => {
        const isSeller = customerId === seller.CustomerId ? true : false;

        if (isSeller && seller.HasMadePayment) {
            return true;
        }
    };

    const setOfferAcceptedMessage = (bid) => {
        const { BidAmount, Seller } = bid;
        const message = `someone has accepted your offer. Please proceed and transfer NGN${formatNumber(BidAmount.Amount, 2)} the account provided.`;
        // const message = `${Seller.UserName} has accepted your offer. Please proceed and transfer NGN${formatNumber(BidAmount.Amount, 2)} the account provided.`;
        return message
    };

    const handleButtonAction = (notification, id) => {
        const { Buyer, Seller } = notification;

        if (customerId === Seller.CustomerId) {
            if (Seller.hasReceivedPayment) {
                setBuyerAccount(notification);
            } else {
                // Seller should make payment
                setBuyerAccount(notification);
                handlePaymentReceived(id, Buyer.UserName);
            }

        } else {
            // End Transaction
            handlePaymentReceived(id, Buyer.UserName);
        }
    };

    const verifyEuId = () => {
        window.open(residencePermitUrl);
    };

    const verifyOtherId = () => {
        window.open(idVerificationLink);
    };

    const setup2FA = () => history.push(ACCOUNT, { mfa: true });

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
        return history.push(ACCOUNT, { verifyPhone: true })
    };
    // const setPin = () => history.push(`${DASHBOARD}${ACCOUNT}`, { setPin: true });

    const toggleSellerSendNgnDrawer = () => {
        setOpenBuyerPaymentDrawer(!openSellerSendNgnDrawer);
    };

    const handleBuyerPayment = (bid) => {
        dispatch({
            type: SET_BID,
            payload: bid
        });
        toggleSellerSendNgnDrawer();
    };

    const dismissAction = () => {
        setOpen(false);
        setSellerPaymentDrawerOpen(false);
        dispatch({
            type: SET_CUSTOMER_MSG,
            payload: null
        });
    };

    return (
        <>
            {openSellerSendNgnDrawer && 
                <SellerSendNgnDrawer 
                    drawerOpen={openSellerSendNgnDrawer} 
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
                        {/* {notifications.map((notification, index) => {
                            if (hasNotification(notification)) {
                                return (
                                    <Notification 
                                        key={index}
                                        title="Credit (Exchange)"
                                        message={setMessage(notification)}
                                        buttonText={buttonDisabled(notification.seller) ? 'Payment Confirmed' : 'Confirm payment'}
                                        buttonAction={() => handleButtonAction(notification)}
                                        // buttonAction={() => setBuyerAccount(notification)}
                                        buttonDisabled={buttonDisabled(notification.seller)}
                                    />
                                )
                            }
                            return null;
                        })} */}
                        {notifications.map((notification, index) => {
                            if (notification.eventType === BUYER_MADE_PAYMENT) {
                                return (
                                    <Notification 
                                        key={index}
                                        title="Credit (Exchange)"
                                        message={setMessage(notification.data.Data)}
                                        buttonText={buttonDisabled(notification.data.Data.Seller) ? 'Payment Confirmed' : 'Confirm payment'}
                                        buttonAction={() => handleButtonAction(notification.data.Data, notification.data.Data.Id)}
                                        // buttonAction={() => setBuyerAccount(notification)}
                                        buttonDisabled={buttonDisabled(notification.data.Data.Seller)}
                                    />
                                )
                            }
                            if (notification.eventType === OFFER_MADE) {
                                return (
                                    <Notification 
                                        key={index}
                                        title="Offer Accepted"
                                        message={setOfferAcceptedMessage(notification.data)}
                                        buttonText="Pay NGN"
                                        buttonAction={handleBuyerPayment}
                                        // buttonText={offerAcceptedButtonDisabled(notification.data.Seller) ? 'NGN Paid' : 'Pay NGN'}
                                        // buttonAction={() => handleButtonAction(notification.data.Data, notification.data.Data.Id)}
                                        // buttonDisabled={buttonDisabled(notification.data.Data.Seller)}
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
                                buttonAction={setup2FA}
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
