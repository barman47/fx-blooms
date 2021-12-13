import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useHistory } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
// import clsx from 'clsx';
import PropTypes from 'prop-types';
import toast, { Toaster } from 'react-hot-toast';

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

import {  HomeMinus, FormatListText, Message, Wallet } from 'mdi-material-ui';
import { MAKE_LISTING, DASHBOARD_HOME, NOTIFICATIONS, WALLET } from '../../routes';
import { CUSTOMER_CANCELED, PAYMENT_NOTIFICATION } from '../../actions/types';
import audioFile from '../../assets/sounds/notification.mp3';

import { logout } from '../../actions/customer';
import { CHAT_CONNECTION_STATUS, COLORS, NOTIFICATION_TYPES } from '../../utils/constants';
import SignalRService from '../../utils/SignalRController';

import Header from '../../components/layout/Header';
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

const Dashboard = ({ children, title }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    
    const { customerId } = useSelector(state => state.customer);
    const { connectionStatus, unreadNotifications } = useSelector(state => state.notifications);

    const [value, setValue] = useState(0);
    
    const [toastDuration, setToastDuration] = useState(0);
    const [toastMessage, setToastMessage] = useState('');
    const [toastTitle, setToastTitle] = useState('');
    const [toastType, setToastType] = useState('error');
    const [toastAction, setToastAction] = useState(null);
    
    const mobileLinks = [
        { url : DASHBOARD_HOME, text:'Dashboard', icon: <HomeMinus /> },
        { url : MAKE_LISTING, text:'Add Listing', icon: <FormatListText /> },
        { url: WALLET, text:'Wallet', icon: <Wallet /> },
        { url: NOTIFICATIONS, text:'Notifications', icon: <Badge overlap="circle" color="error" variant="dot" badgeContent={unreadNotifications}><Message /></Badge> }
        // { url : PROFILE, text:'Profile', icon: <Account /> }
    ];
    
    const customToast = useRef();
    const successModal = useRef();

    useEffect(() => {
        
        onReconnected();
        onReconnect();
        onClose();

        handleSentMessage();
        // eslint-disable-next-line
    }, []);

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
                console.log('Payload ', payload);
                console.log('New Notification ', response, type);
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
                            console.log('Dispatching PAYMENT_NOTIFICATION');
                            dispatch({
                                type: PAYMENT_NOTIFICATION,
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
                            console.log('Dispatching PAYMENT_NOTIFICATION');
                            dispatch({
                                type: PAYMENT_NOTIFICATION,
                                payload: { type: BUYER_CONFIRMED_PAYMENT, id }
                            });
                            successModal.current.openModal();
                            successModal.current.setModalText('This transaction has been completed successfully by both the buyer and seller and will be permanently closed.');
                            // Show transaction completed message here
                        }
                        break;

                    case SELLER_MADE_PAYMENT:
                        buyer = payload.Buyer;
                        seller = payload.Seller;
                        id = payload.Id;
                        if (customerId === buyer.CustomerId || customerId === seller.CustomerId) {
                            playAudioNotifcation(senderId);
                            console.log('Dispatching PAYMENT_NOTIFICATION');
                            dispatch({
                                type: PAYMENT_NOTIFICATION,
                                payload: { type: SELLER_MADE_PAYMENT, id }
                            });
                        }
                        break;

                    case SELLER_CONFIRMED_PAYMENT:
                        buyer = payload.Transfer.Buyer;
                        seller = payload.Transfer.Seller;
                        id = payload.Transfer.Id;
                        if (customerId === buyer.CustomerId || customerId === seller.CustomerId) {
                            console.log('Dispatching PAYMENT_NOTIFICATION');
                            dispatch({
                                type: PAYMENT_NOTIFICATION,
                                payload: { type: SELLER_CONFIRMED_PAYMENT, id }
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
                // console.log('Error Ocurred');
                // console.error(err);
            }
        });
    };

    const handleLinkClick = (link) => {
        history.push(`/dashboard${link}`);
    };

    const dismissSuccessModal = () => {};

    return (
        <>
            <Helmet><title>{`${title} | FXBLOOMS.com`}</title></Helmet>
            <AccountSetupModal />
            <SuccessModal ref={successModal} dismissAction={dismissSuccessModal} />
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
            <Header />
            <section className={classes.root}>
                <div className={classes.content}>
                    {children}
                </div>
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
                            <BottomNavigationAction onClick={() => handleLinkClick(item.url)} key={index} label={item.text} icon={item.icon} />
                        ))}
                    </BottomNavigation>
                </Box>
            </section>
        </>
    );
};

Dashboard.propTypes = {
    logout: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired
};

export default connect(undefined, { logout })(Dashboard);