import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { decode } from 'html-entities';

import { COLORS, ID_STATUS } from '../../../utils/constants';
import formatNumber from '../../../utils/formatNumber';

import { getIdVerificationLink, getResidencePermitLink } from '../../../actions/customer';
import { completeTransaction } from '../../../actions/listings';
import { getNotifications, generateOtp } from '../../../actions/notifications';
import { SET_ACCOUNT, SET_CUSTOMER_MSG, SET_NOTIFICATION_MSG } from '../../../actions/types';

import extractCountryCode from '../../../utils/extractCountryCode';
import { DASHBOARD, PROFILE } from '../../../routes';

import Notification from './Notification';
import SendEurDrawer from './SendEurDrawer';
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
    const [sendEurDrawerOpen, setSendEurDrawerOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [transactionId, setTransactionId] = useState(null);

    const successModal = useRef();

    const { APPROVED } = ID_STATUS;
    
    useEffect(() => {
        if (notifications.length === 0) {
            getNotifications();
        }
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
        if (!sendEurDrawerOpen) {
            setAmount(0);
            setTransactionId(null);
            setSellerUsername('');
            dispatch({
                type: SET_ACCOUNT,
                payload: {}
            });
        }
    }, [dispatch, sendEurDrawerOpen]);

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
        
        const sellerAccount = {
            accounName: buyer.accountName,
            accountNumber: buyer.accountNumber,
            bankName: buyer.bankName
        };

        if (buyer.hasMadePayment) {
            // Seller should make payment since buyer has paid
            setAmount(Number(seller.amountTransfered));
            dispatch({
                type: SET_ACCOUNT,
                payload: sellerAccount
            });
        }
        dispatch({
            type: SET_NOTIFICATION_MSG,
            payload: `Thanks for confirming ${buyer.userName}'s payment. Please proceed and send the EUR equivalent to the account below. `
        });
        
        toggleSendEurDrawer();
    };

    const toggleSendEurDrawer = () => {
        setSendEurDrawerOpen(!sendEurDrawerOpen);

        // clear message if drawer is open and being closed
        if (sendEurDrawerOpen) {
            console.log('closing drawer');
            dispatch({
                type: SET_NOTIFICATION_MSG,
                payload: null
            });
        }
    }

    const setMessage = (notification) => {
        const { buyer, seller } = notification;
        const isBuyer = customerId === buyer.customerId ? true : false;
        const isSeller = customerId === seller.customerId ? true : false;

        let message;

        if (isSeller && buyer.hasMadePayment) {
            message=`${buyer.userName} has made a payment of ${decode('&#8358;', { level: 'html5' })}${formatNumber(buyer.amountTransfered)} to your ${seller.bankName} account | ${seller.accountNumber}`;
        }

        if (isBuyer && seller.hasMadePayment) {
            message=`${seller.userName} has made a payment of ${decode('&#8364;', { level: 'html5' })}${formatNumber(seller.amountTransfered)} to your ${buyer.bankName} account | ${buyer.accountNumber}`;
        }
        return message;
    };

    const hasNotification = (notification) => {
        const { buyer, seller } = notification;
        const isBuyer = customerId === buyer.customerId ? true : false;
        const isSeller = customerId === seller.customerId ? true : false;
        let result = false;

        if (isBuyer && seller.hasMadePayment) {
            result = true;
        }
        if (isSeller && buyer.hasMadePayment) {
            result = true;
        }
        return result;
    };

    const buttonDisabled = (seller) => {
        const isSeller = customerId === seller.customerId ? true : false;

        if (isSeller && seller.hasReceivedPayment && seller.hasMadePayment) {
            return true;
        }
    };

    const handleButtonAction = (notification) => {
        const { id, buyer, seller } = notification;

        if (customerId === seller.customerId) {
            if (seller.hasReceivedPayment) {
                setBuyerAccount(notification);

            } else {
                // Seller should make payment
                setBuyerAccount(notification);
                handlePaymentReceived(id, buyer.userName);
            }

        } else {
            // End Transaction
            handlePaymentReceived(id, buyer.userName);
        }
    };

    const verifyEuId = () => {
        window.open(residencePermitUrl);
    };

    const verifyOtherId = () => {
        window.open(idVerificationLink);
    };

    const setup2FA = () => history.push(`${DASHBOARD}${PROFILE}`, { mfa: true });

    const verifyPhone = () => {
        if (phoneNo) {
            const { code, number } = extractCountryCode(phoneNo);
            generateOtp({
                countryCode: code,
                telephoneNumber: number.charAt(0) === '0' ? number.substring(1, number.length) : number
            });
            return setOpen(true);
        }
        return history.push(`${DASHBOARD}${PROFILE}`, { verifyPhone: true })
    };
    // const setPin = () => history.push(`${DASHBOARD}${PROFILE}`, { setPin: true });

    const dismissAction = () => {
        setOpen(false);
        dispatch({
            type: SET_CUSTOMER_MSG,
            payload: null
        });
    };

    return (
        <>
            {sendEurDrawerOpen && 
                <SendEurDrawer 
                    toggleDrawer={toggleSendEurDrawer} 
                    drawerOpen={sendEurDrawerOpen} 
                    amount={amount} 
                    transactionId={transactionId}
                    sellerUsername={sellerUsername}
                />
            }
            <VerifyPhoneNumberModal 
                isOpen={open} 
                dismissAction={dismissAction} 
                phoneNumber={phoneNo || ''} 
            />
            <SuccessModal ref={successModal} dismissAction={dismissAction} />
            <section className={classes.root}>
                <Typography variant="h6">Notifications</Typography>
                <Typography variant="body2" component="p">View notifications below</Typography>
                <div>
                    <section className={classes.notifications}>
                    {notifications.map(notification => {
                            if (hasNotification(notification)) {
                                return (
                                    <Notification 
                                        key={notification.id}
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
                        })}
                        {stats.residencePermitStatus !== APPROVED &&
                            <Notification 
                                title="Verify your EU Government Issued ID"
                                message="Required to BUY and SELL. Click Verify ID to proceed."
                                buttonText="Verify ID"
                                buttonAction={verifyEuId}
                            />
                        }
                        {/* eslint-disable-next-line no-mixed-operators */}
                        {((stats.idStatus !== APPROVED) && (stats.residencePermitStatus !== APPROVED)) && (
                            <Notification 
                                title="Verify Other Government Issued ID"
                                message="Required to BUY only. Click Verify ID to proceed."
                                buttonText="Verify ID"
                                buttonAction={verifyOtherId}
                            />
                        )}
                        {!hasSetup2FA &&
                            <Notification 
                                title="Set up  2FA"
                                message="Required to keep your account more secure. Click Setup 2FA to proceed."
                                buttonText="Setup 2FA"
                                buttonAction={setup2FA}
                            />
                        }
                        {!isPhoneNumberVerified && 
                            <Notification 
                                title="Verify phone number"
                                message="Required to receive SMS notifications. Click Verify Phone to proceed."
                                buttonText="Verify Phone"
                                buttonAction={verifyPhone}
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
