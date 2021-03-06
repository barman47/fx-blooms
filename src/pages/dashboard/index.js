import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { batch, connect, useDispatch, useSelector } from 'react-redux';
import { 
    AppBar,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar,
    Drawer, 
    Divider,
    IconButton, 
    List, 
    ListItem, 
    ListItemIcon, 
    ListItemText,
    Toolbar,
    Tooltip, 
    Typography,
    useMediaQuery,
    useTheme
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import toast, { Toaster } from 'react-hot-toast';
import _ from 'lodash';
import clsx from 'clsx';

import AccountSetupModal from './AccountSetupModal';
import SessionModal from './SessionModal';
import AlertModal from '../../components/common/AlertModal';
import Toast from '../../components/common/Toast';
import AlertNotification from './notifications/AlertNotification';

import {
    Badge,
    Box,
    Button,
    BottomNavigation,
    BottomNavigationAction
} from '@material-ui/core';

import { 
    AccountOutline, 
    ArrowLeftRight, 
    BagChecked, 
    CardAccountDetailsOutline,
    ChevronLeft, 
    ChevronRight, 
    ChevronDown, 
    HomeOutline, 
    LockOutline, 
    Logout, 
    MessageOutline, 
    Menu,
    Security,
    TwoFactorAuthentication,
    ViewListOutline,
    Wallet
} from 'mdi-material-ui';
import { 
    BANK_ACCOUNTS, 
    DASHBOARD_HOME, 
    NOTIFICATIONS, 
    HOW_IT_WORKS_DASHBOARD,
    SECURITY,
    ID_VERIFICATION, 
    PIN, 
    TWO_FACTOR, 
    TRANSACTIONS, 
    PROFILE,
    WALLETS,
    VERIFF
} from '../../routes';
import { 
    ADD_ALERT_NOTIFICATION,
    ADD_NOTIFICATION,
    CUSTOMER_CANCELED, 
    PAYMENT_NOTIFICATION_BUYER_PAID, 
    PAYMENT_NOTIFICATION_BUYER_CONFIRMED, 
    PAYMENT_NOTIFICATION_SELLER_CONFIRMED, 
    PAYMENT_NOTIFICATION_SELLER_PAID, 
    PAYMENT_NOTIFICATION_OFFER_MADE,
    // REMOVE_NOTIFICATION,
    SET_CUSTOMER_MSG,
    // SET_LISTING_MSG
} from '../../actions/types';


import { logout } from '../../actions/customer';
import { getNotificationCount, markNotificationAsRead } from '../../actions/notifications';
import { checkPin } from '../../actions/pin';
import { CHAT_CONNECTION_STATUS, COLORS, DRAWER_WIDTH as drawerWidth, HAS_SEEN_ESCROW_MESSAGE, LOGOUT, NOTIFICATION_TYPES, ID_STATUS, SESSION_TIME, TRANSITION, SESSION_LIFE } from '../../utils/constants';
import SignalRService from '../../utils/SignalRController';

import HideOnScroll from '../../components/layout/HideOnScroll';
import SuccessModal from '../../components/common/SuccessModal';
import TransactionCompleteModal from './TransactionCompleteModal';
// import CreateWalletModal from './wallet/CreateWalletModal';

import audioFile from '../../assets/sounds/notification.mp3';
import logo from '../../assets/img/logo.svg';

const { CONNECTED, DISCONNECTED, RECONNECTED, RECONNECTING } = CHAT_CONNECTION_STATUS;

const useStyles = makeStyles((theme) => ({
    appBar: {
        backgroundColor: COLORS.white,
        display: 'none',

        [theme.breakpoints.down('md')]: {
            display: 'block'
        }
    },

    alertContainerClose: {
        marginLeft: theme.spacing(9) + 1,
        width: `calc(100% - ${theme.spacing(9) + 1}px)`,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),

        [theme.breakpoints.down('md')]: {
            marginLeft: 0,
            width: '100%'
        }
    },

    alertContainerOpen: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),

        [theme.breakpoints.down('md')]: {
            marginLeft: 0,
            width: '100%'
        }
    },
    
    appBarContent: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    title: {
        color: COLORS.offBlack,
        fontWeight: 600
    },

    root: {
        [theme.breakpoints.down('md')]: {
            marginTop: theme.spacing(10),
            paddingLeft: theme.spacing(5),
            paddingRight: theme.spacing(5),
        },

        [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
        }
    },

    content: {
        flexGrow: 1,
        marginLeft: theme.spacing(9) + 1,
        marginTop: theme.spacing(4),
        zIndex: '997',
        width: `calc(100% - ${theme.spacing(9) + 1}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),

        [theme.breakpoints.down('md')]: {
            marginBottom: theme.spacing(3),
            marginLeft: '0 !important',
            height: '100vh !important',
            width: '100% !important'
        }
    },

    contentShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`
    },

    drawer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexShrink: 0,
        whiteSpace: 'nowrap',
        width: drawerWidth
    },
    
    paper: {
        overflowX: 'hidden',
        boxSizing: 'border-box'
    },

    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },

    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },

    logo: {
        width: '100%'
    },

    collapseIcon: {
        color: theme.palette.primary.main
    },
    
    expandIcon: {
        color: theme.palette.primary.main
    },

    toolbar: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: [[theme.spacing(2), theme.spacing(2), 0, theme.spacing(2)]],
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },

    collapsedToolbar: {
        justifyContent: 'center',
    },

    linksContainer: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        // justifyContent: 'space-between'
        '& .MuiPaper-elevation1': {
            padding: 0,
            boxShadow: 'none',
        },

        '& .MuiAccordion-root.Mui-expanded': {
            margin: 0
        }
    },

    profileContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        justifySelf: 'flex-end',
        height: '100%'
    },

    links: {
        marginTop: theme.spacing(4.5)
    },

    linkItem: {
        color: theme.palette.primary.main,
        transition: TRANSITION,

        '&:hover': {
            backgroundColor: theme.palette.primary.main,
            color: COLORS.offWhite
        }
    },

    // accordionLink: {
    //     color: theme.palette.primary.main,
    //     transition: TRANSITION,

    //     '&:hover': {
    //         backgroundColor: theme.palette.primary.main,
    //         color: COLORS.offWhite
    //     }
    // },

    activeLink: {
        backgroundColor: theme.palette.primary.main,
        color: COLORS.offWhite
    },

    icon: {
        color: 'inherit',
        minWidth: 0,
        marginRight: theme.spacing(1.5),

        '&:hover': {
            color: 'inherit'
        }
    },

    link: {
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: theme.shape.borderRadius,
        color: theme.palette.primary.main
    },

    accordionSummary: {
        minHeight: '47px',
        margin: 0,
        padding: 0,

        '& .MuiAccordionSummary-content' : {
            margin: 0
        }
    },

    collapsedIcon: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },

    accordionDetails: {
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: 0,
        paddingRight: 0,
        paddingTop: 0
    },

    collapsedAccordionDetails: {
        paddingLeft: 0
    },

    bottomBar: {
        display: 'none',
        position: 'fixed',
        bottom: 0,
        width: '100vw',
        [theme.breakpoints.down('md')]: {
            display: 'block'
        }
    },

    label: {
        fontSize: '9px !important',
        fontWeight: 300,
        textTransform: 'uppercase'
    },

    avatarContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: theme.spacing(1.5),
        paddingRight: theme.spacing(1.5),

        '& h6': {
            fontSize: theme.spacing(1.5),
            marginLeft: theme.spacing(2.5)
        }
    },

    avatar: {
        backgroundColor: theme.palette.primary.main,
        color: COLORS.offWhite,
        fontWeight: 600
    }
}));

const ToastAction = () => {
    return (
        <Button variant="outlined" color="inherit" onClick={() => SignalRService.connect()}>Reconnect</Button>
    );
};

const Dashboard = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();

    const matches = useMediaQuery(theme.breakpoints.down('md'));
    
    const { customerId, hasSetup2FA, isPhoneNumberVerified, stats, twoFactorEnabled, userName } = useSelector(state => state.customer);
    const { alertNotifications, connectionStatus, unreadNotifications } = useSelector(state => state.notifications);
    const { pendingTransactions } = useSelector(state => state.transactions);
    const { authorized } = useSelector(state => state.twoFactor);

    const [value, setValue] = useState(0);
    
    const [path, setPath] = useState('');
    const [toastDuration, setToastDuration] = useState(0);
    const [toastMessage, setToastMessage] = useState('');
    const [toastTitle, setToastTitle] = useState('');
    const [toastType, setToastType] = useState('error');
    const [toastAction, setToastAction] = useState(null);
    const [open, setOpen] = useState(true);
    
    const mobileLinks = [
        { url : DASHBOARD_HOME, text:'Dashboard', icon: <HomeOutline /> },
        { url: NOTIFICATIONS, text:'Notifications', icon: <Badge overlap="circular" color="error" variant="dot" badgeContent={unreadNotifications}><MessageOutline /></Badge> },
        { url: WALLETS, text:'Wallets', icon: <Wallet /> }
    ];

    const protectedRoutes = [
        { url : DASHBOARD_HOME, text:'Dashboard', icon: <HomeOutline /> },
        { url: WALLETS, text:'Wallets', icon: <Wallet /> },
        { url: TRANSACTIONS, text:'Transactions', icon: <ArrowLeftRight /> },
        // { url: TRANSACTIONS, text:'Transactions', icon: <Badge overlap="rectangular" badgeContent={pendingTransactions} color="primary"><ArrowLeftRight /></Badge> },
        { url: BANK_ACCOUNTS, text:'Bank Accounts', icon: <BagChecked /> },
        { url: SECURITY, text:'Security', icon: <LockOutline /> },
        { url: NOTIFICATIONS, text:'Notifications', icon: <Badge overlap="circular" color="error" variant="dot" badgeContent={unreadNotifications}><MessageOutline /></Badge> },
        { url: HOW_IT_WORKS_DASHBOARD, text:'How it works', icon: <ViewListOutline /> }
    ];

    const securityLinks = [
        { url : ID_VERIFICATION, text: 'ID Verification', icon: <CardAccountDetailsOutline /> },
        { url : PIN, text: 'PIN', icon: <Security /> },
        { url : TWO_FACTOR, text: '2FA', icon: <TwoFactorAuthentication /> }
    ];

    const { checkPin, getNotificationCount, logout, markNotificationAsRead, title } = props;
    
    const accountSetupModal = useRef();
    const alertModal = useRef();
    const customToast = useRef();
    const successModal = useRef();
    const transactionCompleteModal = useRef();

    const { NOT_SUBMITTED } = ID_STATUS;

    useEffect(() => {
        showEscrowMessage();
        getNotificationCount(customerId);
        checkPin(customerId);
        if (matches) {
            setOpen(false);
        }
        // eslint-disable-next-line
    }, [matches]);

    // Set pathname when ever the location changes, for active link feature
    useEffect(() => {
        setPath(location.pathname);
    }, [location.pathname]);

    useEffect(() => {
        setSessionTime();
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

        if (!isPhoneNumberVerified) {
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

    const setSessionTime = () => {
        sessionStorage.setItem(SESSION_TIME, new Date().getTime() + SESSION_LIFE);
    };
        
    const verifyId = useCallback(() => {
        navigate(VERIFF);
    }, [navigate]);

    const setAlertNotifications = useCallback(() => {
        const { APPROVED } = ID_STATUS;
        if (stats.idStatus !== APPROVED) {
            dispatch({
                type: ADD_ALERT_NOTIFICATION,
                payload: {
                    message: 'Verify your Identity',
                    buttonText: 'Verify ID',
                    buttonAction: verifyId
                }
            });
        }
            

        if (!hasSetup2FA) {
            dispatch({
                type: ADD_ALERT_NOTIFICATION,
                payload: {
                    message: 'Add extra layer of Security',
                    buttonText: 'Setup 2FA',
                    buttonAction: () => navigate(TWO_FACTOR)
                }
            });
        }
    
        if (!isPhoneNumberVerified) {
            dispatch({
                type: ADD_ALERT_NOTIFICATION,
                payload: {
                    message: 'Required to receive SMS notifications. Click Verify Phone to proceed',
                    buttonText: 'Verify Phone',
                    buttonAction: () => navigate(PROFILE)
                }
            });
        }
    }, [dispatch, hasSetup2FA, isPhoneNumberVerified, stats, navigate, verifyId]);

    useEffect(() => {
        if (!_.isEmpty(stats)) {
            if (!sessionStorage.getItem('checkedIdStatus')) {
                sessionStorage.setItem('checkedIdStatus', 'true');
                const { idStatus } = stats;
                if (idStatus === NOT_SUBMITTED) {
                    accountSetupModal.current.openModal();
                }
            }
            setAlertNotifications();
        }
    }, [NOT_SUBMITTED, stats, setAlertNotifications]);

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

    const showEscrowMessage = () => {
        const hasSeenEscrowMessage = localStorage.getItem(HAS_SEEN_ESCROW_MESSAGE);
        if (!hasSeenEscrowMessage) {
            alertModal.current.setModalText('FXBLOOMS platform now supports escrow. Hence, users are required to fund their wallets in order to perform some activities.');
            alertModal.current.openModal();
            localStorage.setItem(HAS_SEEN_ESCROW_MESSAGE, 'true');
        }
    };

    const toggleDrawer = () => {
        setOpen(!open);
    };

    // Logout user if he tries to beat 2FA
    const checkTwoFactorStatus = () => {
        if (twoFactorEnabled && !authorized) {
            logout(navigate, 'Sorry, not that fast!');
        }
    };

    const checkSession = () => {
        if (sessionStorage.getItem(LOGOUT)) {
            sessionStorage.removeItem(LOGOUT);
            logout(navigate, 'Your session expired');
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
        const { 
            CANCEL_NEGOTIATION, 
            BUYER_MADE_PAYMENT, 
            BUYER_CONFIRMED_PAYMENT, 
            OFFER_MADE,
            SELLER_CONFIRMED_PAYMENT, 
            SELLER_MADE_PAYMENT 
        } = NOTIFICATION_TYPES;
        SignalRService.registerReceiveNotification((data, type) => {
            try {
                getNotificationCount(customerId);
                let response = JSON.parse(data);
                let payload = JSON.parse(response.Payload);
                payload = { ...payload, Data: JSON.parse(payload.Data) };
                console.log('Payload ', payload);
                console.log('New Notification ', response, type);
                const senderId = response.SenderId;
                const buyer = payload.Data.Buyer;
                const seller = payload.Data.Seller;
                const notification = {
                    dateLogged: payload.DateLogged,
                    eventType: payload.EventType,
                    customerId: payload.CustomerId,
                    isDeleted: payload.IsDeleted,
                    isRead: payload.IsRead,
                    notificationId: payload.Id,
                    data: { 
                        BidId: payload.Data.BidId,
                        Id: payload.Data.Id,
                        IsClosed: payload.Data.IsClosed,
                        Buyer: buyer,
                        Seller: seller,
                        ListingId: payload.Data.ListingId,
                        // ListingId: payload.ListingId ?  payload.ListingId : payload.Data.ListingId,
                        // BidId: payload.BidId
                    }
                };
                
                switch (type) {
                    case BUYER_MADE_PAYMENT:
                        // Send buyer payment notification to seller only
                        if (customerId === seller.CustomerId) {
                            playAudioNotifcation(senderId);
                            dispatch({
                                type: PAYMENT_NOTIFICATION_BUYER_PAID,
                                payload: notification
                            });
                        }

                        // Show message to buyer only
                        // if (customerId === buyer.CustomerId && seller.HasMadePayment === false) {
                        //     dispatch({
                        //         type: SET_LISTING_MSG,
                        //         payload: `${seller.UserName} will confirm your payment and send the ${seller.Currency} equivalent to the account you provided.`
                        //     });
                        // }

                        // if (customerId === buyer.CustomerId && seller.HasMadePayment) {
                        //     dispatch({
                        //         type: SET_LISTING_MSG,
                        //         payload: `Payment successful, a notification was sent. Once ${seller.UserName} confirms, this transaction will be considered complete.`
                        //     });
                        // }
                        break;

                    case BUYER_CONFIRMED_PAYMENT:
                        if (customerId === buyer.CustomerId || customerId === seller.CustomerId) {
                            // end transaction
                            if (buyer.HasMadePayment && seller.HasMadePayment) {
                                playAudioNotifcation(senderId);
                                dispatch({
                                    type: PAYMENT_NOTIFICATION_BUYER_CONFIRMED,
                                    payload: { notification, endTransaction: true }
                                });
                                transactionCompleteModal.current.openModal();
                                markNotificationAsRead(notification.notificationId);
                            } else {
                                dispatch({
                                    type: PAYMENT_NOTIFICATION_BUYER_CONFIRMED,
                                    payload: { notification }
                                });
                            }
                        }
                        
                        break;

                    case SELLER_MADE_PAYMENT:
                        if (customerId === buyer.CustomerId || customerId === seller.CustomerId) {
                            playAudioNotifcation(senderId);
                            batch(() => {
                                dispatch({
                                    type: PAYMENT_NOTIFICATION_SELLER_PAID,
                                    payload: notification
                                });
                                // Show message to seller only
                                // if (customerId === seller.CustomerId && buyer.HasMadePayment) {
                                //     dispatch({
                                //         type: SET_CUSTOMER_MSG,
                                //         payload: `Payment successful, a notification was sent. Once ${buyer.UserName} confirms, this transaction will be considered complete.`
                                //     });
                                // }

                                // if (customerId === seller.CustomerId && buyer.HasMadePayment === false) {
                                //     dispatch({
                                //         type: SET_CUSTOMER_MSG,
                                //         payload: `${buyer.UserName} will confirm your payment and send the ${buyer.Currency} equivalent to the account you provided.`
                                //     });
                                // }
                            });
                        }

                        // Remove SellerConfirmedPayment notification after seller payment succeeds if the confirmation notification was not used to continue the transaction
                        // if (customerId === seller.CustomerId) {
                        //     console.log('closing');
                        //     dispatch({
                        //         type: REMOVE_NOTIFICATION,
                        //         payload: { notificationId: notification.notificationId }
                        //     });
                        //     markNotificationAsRead(notification.notificationId);
                        // }

                        break;

                    case SELLER_CONFIRMED_PAYMENT:
                        if (customerId === buyer.CustomerId || customerId === seller.CustomerId) {
                            playAudioNotifcation(senderId);
                            // end transaction
                            if (buyer.HasMadePayment && seller.HasMadePayment) {
                                dispatch({
                                    type: PAYMENT_NOTIFICATION_SELLER_CONFIRMED,
                                    payload: { notification, endTransaction: true }
                                });
                                transactionCompleteModal.current.openModal();
                                markNotificationAsRead(notification.notificationId);
                            } else {
                                dispatch({
                                    type: PAYMENT_NOTIFICATION_SELLER_CONFIRMED,
                                    payload: { notification }
                                });
                            }
                        }
                        
                        break;

                    case OFFER_MADE:
                        // Show Offer notification to seller only
                        if (customerId === seller.CustomerId) {
                            playAudioNotifcation(senderId);
                            dispatch({
                                type: PAYMENT_NOTIFICATION_OFFER_MADE,
                                payload: notification
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
        if (matches) {
            if (open) {
                setTimeout(() => {
                    setOpen(false);
                }, 500);
            }
            navigate(link); 
        }
        navigate(link); 
    };

    const dismissAction = () => {
        dispatch({
            type: SET_CUSTOMER_MSG,
            payload: null
        });
    };

    return (
        <>
            <Helmet><title>{`${title} | FXBLOOMS.com`}</title></Helmet>
            <AccountSetupModal ref={accountSetupModal} />
            <AlertModal ref={alertModal} />
            <SuccessModal ref={successModal} dismissAction={dismissAction} />
            <TransactionCompleteModal ref={transactionCompleteModal} />
            {/* {showCreateWalletModal && <CreateWalletModal open={showCreateWalletModal} toggleCreateWalletDrawer={toggleCreateWalletDrawer} />} */}
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
            {/* <HideOnScroll direction="down" {...props}> */}
            {(alertNotifications.length > 0 && location.pathname === DASHBOARD_HOME) && 
                <Box className={clsx(({ [classes.alertContainerOpen]: open, [classes.alertContainerClose]: !open}))}>
                    <AlertNotification 
                        message={alertNotifications[0].message}
                        buttonText={alertNotifications[0].buttonText}
                        buttonAction={alertNotifications[0].buttonAction}
                    />
                </Box>
            }
            <AppBar position="fixed" elevation={1} className={classes.appBar}>
                <Toolbar className={classes.appBarContent}>
                    <IconButton onClick={toggleDrawer}>
                        <Menu />
                    </IconButton>
                    <Typography variant="body2" component="span" className={classes.title}>{title}</Typography>
                    <Avatar className={classes.avatar} onClick={() => navigate(PROFILE)}>{userName?.charAt(0)?.toUpperCase()}</Avatar>
                </Toolbar>
            </AppBar>
            {/* </HideOnScroll> */}
            <Box component="section" className={classes.root}>
                <Drawer 
                    variant={matches ? 'temporary' : 'permanent'}
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open
                    })}
                    classes={{
                        paper: clsx(classes.paper, {
                            [classes.drawerOpen]: open,
                            [classes.drawerClose]: !open,
                        }),
                    }}
                    open={open}
                    onClose={toggleDrawer}
                >
                    <div className={clsx(classes.toolbar, {[classes.collapsedToolbar]: !open})}>
                        {open && 
                            <Link to="/">
                                <img className={classes.logo} src={logo} alt="FXBLOOMS Logo" />
                            </Link>
                        }
                        <IconButton onClick={toggleDrawer}>
                            {!open ?
                                <Tooltip title="Expand Navigation" placement="top" arrow>
                                    <ChevronRight className={classes.expandIcon} />
                                </Tooltip>
                                :
                                <Tooltip title="Collapse Navigation" placement="top" arrow>
                                    <ChevronLeft className={classes.collapseIcon} />
                                </Tooltip>
                            }
                        </IconButton>
                    </div> 
                    <Box component="div" className={classes.linksContainer}>
                        <List className={classes.links}>
                            {protectedRoutes.map((link, index) => {
                                if (link.url === SECURITY) {
                                    return (
                                        <Fragment key={index}>
                                            <Accordion>
                                                <AccordionSummary
                                                    expandIcon={open ? <ChevronDown /> : null}
                                                    aria-controls="security-accordion"
                                                    id="security"
                                                    className={classes.accordionSummary}
                                                >
                                                    <ListItem 
                                                        className={clsx(classes.linkItem, { [classes.activeLink]: path.includes(`${link.url}`), [classes.collapsedAccordionSummary]: !open })} 
                                                        button 
                                                        disableRipple
                                                        classes={{ root: classes.collapsedAccordionSummary }}
                                                    >
                                                        {open ? 
                                                            <ListItemIcon className={classes.icon}>
                                                                {link.icon}
                                                            </ListItemIcon>
                                                            :
                                                            <Tooltip title={link.text} placement="right" arrow>
                                                                <ListItemIcon className={clsx(classes.icon, {[classes.collapsedIcon]: !open})}>
                                                                    {link.icon}
                                                                </ListItemIcon>
                                                            </Tooltip>
                                                        }
                                                        {open && <ListItemText primary={link.text} />}
                                                    </ListItem>
                                                </AccordionSummary>
                                                <AccordionDetails className={clsx(classes.accordionDetails, { [classes.collapsedAccordionDetails]: !open})}>
                                                    {securityLinks.map((link, index) => (
                                                        <ListItem 
                                                            key={index}
                                                            className={clsx(classes.linkItem, { [classes.activeLink]: path.includes(`${link.url}`) })} 
                                                            button 
                                                            disableRipple
                                                            onClick={() => handleLinkClick(link.url)}
                                                        >
                                                            {open ? 
                                                                <ListItemIcon className={classes.icon}>
                                                                    {link.icon}
                                                                </ListItemIcon>
                                                                :
                                                                <Tooltip title={link.text} placement="right" arrow>
                                                                    <ListItemIcon className={classes.icon}>
                                                                        {link.icon}
                                                                    </ListItemIcon>
                                                                </Tooltip>
                                                            }
                                                            
                                                            {open && <ListItemText primary={link.text} />}
                                                        </ListItem>
                                                    ))}
                                                </AccordionDetails>
                                            </Accordion>
                                            <Divider />
                                        </Fragment>
                                    );
                                }
                                if (link.url === TRANSACTIONS) {
                                    return (
                                        <Fragment key={index}>
                                            <ListItem 
                                                // className={clsx(classes.linkItem, { [classes.activeLink]: path.includes(`${link.url}`) })} 
                                                className={clsx(classes.linkItem, { [classes.activeLink]: path.includes(`${link.url}`) })} 
                                                key={index} 
                                                button 
                                                disableRipple
                                                onClick={() => handleLinkClick(link.url)}
                                            >
                                                <Badge overlap="rectangular" badgeContent={pendingTransactions} color="secondary">
                                                    {open ? 
                                                        <ListItemIcon className={classes.icon}>
                                                            {link.icon}
                                                        </ListItemIcon>
                                                        :
                                                        <Tooltip title={link.text} placement="right" arrow>
                                                            <ListItemIcon className={classes.icon}>
                                                                {link.icon}
                                                            </ListItemIcon>
                                                        </Tooltip>
                                                    }
                                                    {open && <ListItemText primary={link.text} />}
                                                </Badge>
                                            </ListItem>
                                            <Divider />
                                        </Fragment>
                                    );    
                                }
                                return (
                                    <Fragment key={index}>
                                        <ListItem 
                                            // className={clsx(classes.linkItem, { [classes.activeLink]: path.includes(`${link.url}`) })} 
                                            className={clsx(classes.linkItem, { [classes.activeLink]: path.includes(`${link.url}`) })} 
                                            key={index} 
                                            button 
                                            disableRipple
                                            onClick={() => handleLinkClick(link.url)}
                                        >
                                            {open ? 
                                                <ListItemIcon className={classes.icon}>
                                                    {link.icon}
                                                </ListItemIcon>
                                                :
                                                <Tooltip title={link.text} placement="right" arrow>
                                                    <ListItemIcon className={classes.icon}>
                                                        {link.icon}
                                                    </ListItemIcon>
                                                </Tooltip>
                                            }
                                            {open && <ListItemText primary={link.text} />}
                                        </ListItem>
                                        <Divider />
                                    </Fragment>
                                );
                            })}
                        </List>
                        <Box component="div" className={classes.profileContainer}>
                            <List className={classes.links}>
                                <Divider />
                                <ListItem 
                                    className={clsx(classes.linkItem, { [classes.activeLink]: path.includes(PROFILE) })} 
                                    button 
                                    disableRipple
                                    onClick={() => handleLinkClick(PROFILE)}
                                >
                                    {open ? 
                                        <ListItemIcon className={classes.icon}>
                                            <AccountOutline />
                                        </ListItemIcon>
                                        :
                                        <Tooltip title="Profile" placement="right" arrow>
                                            <ListItemIcon className={classes.icon}>
                                                <AccountOutline />
                                            </ListItemIcon>
                                        </Tooltip>
                                    }
                                    {open && <ListItemText primary="Profile" />}
                                </ListItem>
                                <Divider />
                                <ListItem 
                                    className={classes.linkItem} 
                                    button 
                                    disableRipple
                                    onClick={() => logout(navigate, 'Logged out successfully')}
                                >
                                    {open ? 
                                        <ListItemIcon className={classes.icon}>
                                            <Logout />
                                        </ListItemIcon>
                                        :
                                        <Tooltip title="Log Out" placement="right" arrow>
                                            <ListItemIcon className={classes.icon}>
                                                <Logout />
                                            </ListItemIcon>
                                        </Tooltip>
                                    }
                                    {open && <ListItemText primary="Log Out" />}
                                </ListItem>
                                <Divider />
                            </List>
                            <Box className={classes.avatarContainer} component="div">
                                <Tooltip title={userName} placement="right" arrow>
                                    <Avatar className={classes.avatar}>{userName.charAt(0).toUpperCase()}</Avatar>
                                </Tooltip>
                                {open && <Typography variant="h6">{userName}</Typography>}
                            </Box>
                        </Box>
                    </Box>
                </Drawer>
                <div className={clsx(classes.content, { [classes.contentShift]: open })}>
                    <Outlet />
                </div>
            </Box>
            <HideOnScroll direction="up" {...props}>
                <Box
                    boxShadow={5}
                    className={classes.bottomBar}
                >
                    <BottomNavigation
                        value={value}
                        showLabels
                        onChange={(event, newValue) => {
                            setValue(newValue)
                        }}
                    >
                        {mobileLinks.map((item, index) => (
                            <BottomNavigationAction 
                                onClick={() => handleLinkClick(item.url)} 
                                key={index} 
                                label={item.text} 
                                icon={item.icon} 
                                classes={{ label: classes.label, selected: classes.label }}
                            />
                        ))}
                        <BottomNavigationAction 
                            onClick={toggleDrawer} 
                            label="More" 
                            icon={<Menu />} 
                            classes={{ label: classes.label, selected: classes.label }}
                        />
                    </BottomNavigation>
                </Box>
            </HideOnScroll>
        </>
    );
};

Dashboard.propTypes = {
    checkPin: PropTypes.func.isRequired,
    getNotificationCount: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    markNotificationAsRead: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
};

export default connect(undefined, { checkPin, getNotificationCount, logout, markNotificationAsRead })(Dashboard);