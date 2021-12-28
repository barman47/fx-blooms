import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useHistory } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import toast, { Toaster } from 'react-hot-toast';
import _ from 'lodash';

import AccountSetupModal from './AccountSetupModal';
import SessionModal from './SessionModal';
import Toast from '../../components/common/Toast';

import {
    Badge,
    Box,
    Button,
    BottomNavigation,
    BottomNavigationAction
} from '@material-ui/core';

import {  HomeMinus, FormatListText, Message } from 'mdi-material-ui';
import { MAKE_LISTING, DASHBOARD_HOME, NOTIFICATIONS } from '../../routes';
import { 
    ADD_NOTIFICATION,
    CUSTOMER_CANCELED, 
    PAYMENT_NOTIFICATION_BUYER_PAID, 
    PAYMENT_NOTIFICATION_BUYER_CONFIRMED, 
    PAYMENT_NOTIFICATION_SELLER_CONFIRMED, 
    PAYMENT_NOTIFICATION_SELLER_PAID 
} from '../../actions/types';
import audioFile from '../../assets/sounds/notification.mp3';

import { logout } from '../../actions/customer';
import { CHAT_CONNECTION_STATUS, COLORS, LOGOUT, NOTIFICATION_TYPES, ID_STATUS } from '../../utils/constants';
import SignalRService from '../../utils/SignalRController';

import PrivateHeader, { HideOnScroll } from '../../components/layout/PrivateHeader';
import SuccessModal from '../../components/common/SuccessModal';

const { CONNECTED, DISCONNECTED, RECONNECTED, RECONNECTING } = CHAT_CONNECTION_STATUS;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'row',
        flexGrow: 1,

        [theme.breakpoints.down('md')]: {
            marginBottom: theme.spacing(8)
        },

        [theme.breakpoints.down('sm')]: {
            marginBottom: theme.spacing(5)
        }
    },

    title: {
        flexGrow: 1,
    },

    hide: {
        display: 'none',
    },

    logo: {
        width: '100%'
    },

    content: {
        flexGrow: 1
    },

    link: {
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: theme.shape.borderRadius,
        color: theme.palette.primary.main
    },

    links: {
        marginTop: theme.spacing(4.5)
    },

    linkItem: {
        backgroundColor: `${COLORS.lightTeal} !important`,
        marginBottom: theme.spacing(2)
    },

    icon: {
        color: theme.palette.primary.main
    },

    avatar: {
        borderRadius: '30px',
        maxWidth: theme.spacing(8),
        width: '50%'
    },

    bottomBar: {
        display: 'none',
        position: 'fixed',
        bottom: 0,
        width: '100vw',
        [theme.breakpoints.down('md')]: {
            display: 'block'
        }
    }
}));

const ToastAction = () => {
    return (
        <Button variant="outlined" color="inherit" onClick={() => SignalRService.connect()}>Reconnect</Button>
    );
};

const Dashboard = ({ children, title, logout }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    
    const { customerId, hasSetup2FA, hasVerifiedPhoeNumber, stats, twoFactorEnabled } = useSelector(state => state.customer);
    const { connectionStatus, unreadNotifications } = useSelector(state => state.notifications);
    const { authorized } = useSelector(state => state.twoFactor);

    const [value, setValue] = useState(0);
    
    const [toastDuration, setToastDuration] = useState(0);
    const [toastMessage, setToastMessage] = useState('');
    const [toastTitle, setToastTitle] = useState('');
    const [toastType, setToastType] = useState('error');
    const [toastAction, setToastAction] = useState(null);
    
    const mobileLinks = [
        { url : DASHBOARD_HOME, text:'Dashboard', icon: <HomeMinus /> },
        { url : MAKE_LISTING, text:'Add Listing', icon: <FormatListText /> },
        // { url: WALLET, text:'Wallet', icon: <Wallet /> },
        { url: NOTIFICATIONS, text:'Notifications', icon: <Badge overlap="circle" color="error" variant="dot" badgeContent={unreadNotifications}><Message /></Badge> }
    ];
    
    const customToast = useRef();
    const successModal = useRef();
    const accountSetupModal = useRef();

    const { NOT_SUBMITTED } = ID_STATUS;

    useEffect(() => {
        checkTwoFactorStatus();
        checkSession();
        onReconnected();
        onReconnect();
        onClose();

        handleSentMessage();

        if (!hasSetup2FA) {
            dispatch({
                type: ADD_NOTIFICATION,
            });
        }

        if (!hasVerifiedPhoeNumber) {
            dispatch({
                type: ADD_NOTIFICATION,
            });
        }

        if (!_.isEmpty(stats)) {
            const { residencePermitStatus, idStatus } = stats;
            if (residencePermitStatus === NOT_SUBMITTED) {
                dispatch({
                    type: ADD_NOTIFICATION,
                });
            }

            if (idStatus === NOT_SUBMITTED) {
                dispatch({
                    type: ADD_NOTIFICATION,
                });
            }
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (!_.isEmpty(stats)) {
            if (!sessionStorage.getItem('checkedIdStatus')) {
                sessionStorage.setItem('checkedIdStatus', 'true');
                const { idStatus, residencePermitStatus } = stats;
                if (residencePermitStatus === NOT_SUBMITTED && idStatus === NOT_SUBMITTED) {
                    accountSetupModal.current.openModal();
                }
            }
        }
    }, [NOT_SUBMITTED, stats]);

    // useEffect(() => {
    //     setPath(location.pathname);
    // }, [location]);

    useEffect(() => {
        switch (connectionStatus) {
            case CONNECTED:
                if (customToast.current) {
                    toast.success('Connected!');
                    setToastAction(null);
                }
                break;

            case RECONNECTING:
                setToastTitle('NETWORK ERROR');
                setToastMessage('Reconnecting . . .');
                setToastDuration(null);
                setToastType('error');
                setToastAction(null);
                customToast.current.handleClick();
                break;
                
            case RECONNECTED:
                customToast.current.close();
                toast.success('Reconnected!');
                break;

            case DISCONNECTED:
                setToastTitle('ERROR');
                setToastMessage('Network Disconnected');
                setToastType('error');
                setToastDuration(null);
                setToastAction(<ToastAction />);
                customToast.current.handleClick();
                break;

            default:
                break;
        }
    }, [connectionStatus]);

    // Logout user if he tries to beat 2FA
    const checkTwoFactorStatus = () => {
        if (twoFactorEnabled && !authorized) {
            logout(history);
        }
    };

    const checkSession = () => {
        if (sessionStorage.getItem(LOGOUT)) {
            sessionStorage.removeItem(LOGOUT);
            logout(history);
        }
    };

    const playAudioNotifcation = (senderId) => {
        if (senderId !== customerId) {
            const audio = new Audio(audioFile);
            audio.play();
            // navigator.vibrate(500);
        }
    };


    const onReconnected = () => {
        SignalRService.onReconnected();
    };

    const onReconnect = () => {
        SignalRService.onReconnect();
    };
    
    const onClose = () => {
        SignalRService.onClose();
    };

    const handleSentMessage = () => {
        const { CANCEL_NEGOTIATION, BUYER_MADE_PAYMENT, BUYER_CONFIRMED_PAYMENT, SELLER_CONFIRMED_PAYMENT, SELLER_MADE_PAYMENT } = NOTIFICATION_TYPES;
        SignalRService.registerReceiveNotification((data, type) => {
            try {
                let response = JSON.parse(data);
                const payload = JSON.parse(response.Payload);
                // console.log('Payload ', payload);
                // console.log('New Notification ', response, type);
                const senderId = response.SenderId;
                let buyer = {};
                let seller = {};
                let id;
                
                switch (type) {
                    case BUYER_MADE_PAYMENT:
                        buyer = payload.Buyer;
                        seller = payload.Seller;
                        id = payload.Id;
                        if (customerId === buyer.CustomerId || customerId === seller.CustomerId) {
                            playAudioNotifcation(senderId);
                            dispatch({
                                type: PAYMENT_NOTIFICATION_BUYER_PAID,
                                payload: { 
                                    notification: {
                                        id,
                                        isClosed: payload.IsClosed,
                                        buyer: {
                                            accountName: buyer.AccountName,
                                            accountNumber: buyer.AccountNumber,
                                            amountTransfered: buyer.AmountTransfered,
                                            bankName: buyer.BankName,
                                            customerId: buyer.CustomerId,
                                            hasMadePayment: buyer.HasMadePayment,
                                            hasReceivedPayment: buyer.HasReceivedPayment,
                                            userName: buyer.UserName
                                        },
                                        seller: {
                                            accountName: seller.AccountName,
                                            accountNumber: seller.AccountNumber,
                                            amountTransfered: seller.AmountTransfered,
                                            bankName: seller.BankName,
                                            customerId: seller.CustomerId,
                                            hasMadePayment: seller.HasMadePayment,
                                            hasReceivedPayment: seller.HasReceivedPayment,
                                            userName: seller.UserName
                                        },
                                        listingId: payload.ListingId,
                                        bidId: payload.BidId
                                    },
                                    customerId
                                }
                            });
                        }
                        break;

                    case BUYER_CONFIRMED_PAYMENT:
                        buyer = payload.Transfer.Buyer;
                        seller = payload.Transfer.Seller;
                        id = payload.Transfer.Id;
                        if (customerId === buyer.CustomerId || customerId === seller.CustomerId) {
                            playAudioNotifcation(senderId);
                            dispatch({
                                type: PAYMENT_NOTIFICATION_BUYER_CONFIRMED,
                                payload: { id }
                            });
                            successModal.current.openModal();
                            successModal.current.setModalText('This transaction has been completed successfully by both the buyer and seller and will be permanently closed.');
                        }
                        break;

                    case SELLER_MADE_PAYMENT:
                        buyer = payload.Buyer;
                        seller = payload.Seller;
                        id = payload.Id;
                        if (customerId === buyer.CustomerId || customerId === seller.CustomerId) {
                            playAudioNotifcation(senderId);
                            dispatch({
                                type: PAYMENT_NOTIFICATION_SELLER_PAID,
                                payload: { id }
                            });
                        }
                        break;

                    case SELLER_CONFIRMED_PAYMENT:
                        buyer = payload.Transfer.Buyer;
                        seller = payload.Transfer.Seller;
                        id = payload.Transfer.Id;
                        if (customerId === buyer.CustomerId || customerId === seller.CustomerId) {
                            dispatch({
                                type: PAYMENT_NOTIFICATION_SELLER_CONFIRMED,
                                payload: { id }
                            });
                        }
                        break;

                    case CANCEL_NEGOTIATION:
                        // playAudioNotifcation(customerId, response.Sender);

                        if (customerId === payload.Buyer || customerId === payload.Seller) {
                            if (senderId !== customerId) {
                                dispatch({ 
                                    type: CUSTOMER_CANCELED,
                                    payload: `Hi, this transaction has been canceled by the other user`
                                });
                            }
                        }

                        break;

                    default:
                        break;
                }
            } catch (err) {
                console.error(err);
            }
        });
    };

    const handleLinkClick = (link) => {
        history.push(`/dashboard${link}`);
    };

    return (
        <>
            <Helmet><title>{`${title} | FXBLOOMS.com`}</title></Helmet>
            <AccountSetupModal ref={accountSetupModal} />
            <SuccessModal ref={successModal} />
            <SessionModal />
            {connectionStatus !== CONNECTED && 
                <Toast 
                    ref={customToast}
                    title={toastTitle}
                    duration={toastDuration}
                    msg={toastMessage}
                    type={toastType}
                    action={toastAction}
                />
            }
            <Toaster />
            <PrivateHeader />
            <section className={classes.root}>
                <div className={classes.content}>
                    {children}
                </div>
                <HideOnScroll direction="up">
                    <Box
                        boxShadow={5}
                        className={classes.bottomBar}
                    >
                        <BottomNavigation
                            value={value}
                            onChange={(event, newValue) => {
                                setValue(newValue)
                            }}
                            showLabels
                        >
                            {mobileLinks.map((item, index) => (
                                <BottomNavigationAction 
                                    onClick={() => handleLinkClick(item.url)} 
                                    key={index} 
                                    label={item.text} 
                                    icon={item.icon} 
                                />
                            ))}
                        </BottomNavigation>
                    </Box>
                </HideOnScroll>
            </section>
        </>
    );
};

Dashboard.propTypes = {
    logout: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired
};

export default connect(undefined, { logout })(Dashboard);