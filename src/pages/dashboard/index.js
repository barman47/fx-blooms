import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useHistory, useLocation, Link as RouterLink } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { subscribe, isSupported } from 'on-screen-keyboard-detector';

import { logout } from '../../actions/customer';

import logo from '../../assets/img/logo.svg';

import {
    Avatar,
    Badge,
    Box,
    IconButton,
    Drawer,
    Divider,
    Link,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    BottomNavigation,
    BottomNavigationAction,
    Tooltip,
    Typography
} from '@material-ui/core';

import { Account, ChevronRight, ChevronLeft, HomeMinus, FormatListText, AndroidMessages, Logout } from 'mdi-material-ui';
import { MAKE_LISTING, DASHBOARD, DASHBOARD_HOME, MESSAGES, PROFILE } from '../../routes';
import { CUSTOMER_CANCELED, PAYMENT_NOTIFICATION, SENT_MESSAGE } from '../../actions/types';
import audioFile from '../../assets/sounds/notification.mp3';

import { COLORS, NOTIFICATION_TYPES } from '../../utils/constants';

import SignalRService from '../../utils/SignalRController';

const drawerWidth = 240;

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

    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
    },

    // appBarShift: {
    //     marginLeft: drawerWidth,
    //     width: `calc(100% - ${drawerWidth}px)`,
    //     transition: theme.transitions.create(['width', 'margin'], {
    //       easing: theme.transitions.easing.sharp,
    //       duration: theme.transitions.duration.enteringScreen,
    //     }),
    // },

    menuButton: {
        marginRight: 36,
        [theme.breakpoints.down('sm')]: {
            display: 'none'
        }
    },

    title: {
        flexGrow: 1,
    },

    hide: {
        display: 'none',
    },

    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        [theme.breakpoints.down('md')]: {
            display: 'none'
        }
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

    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        // padding: theme.spacing(2, 1),
        padding: [[theme.spacing(2), theme.spacing(2), 0, theme.spacing(2)]],
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
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

    logoutContainer: {
        position: 'absolute',
        bottom: 0,
        width: drawerWidth,

        '& p': {
            color: COLORS.offBlack,
            fontWeight: 600   
        }
    },

    avatar: {
        borderRadius: '30px',
        maxWidth: theme.spacing(8),
        width: '50%'
    },

    avatarContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: '100%',
    },

    email: {
        color: COLORS.grey,
        fontWeight: 300
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

const Dashboard = ({ children, title, logout }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    
    const { customerId, profile, userName } = useSelector(state => state.customer);
    const { unreadMessages } = useSelector(state => state.chat);

    const [value, setValue] = useState(0);
    const [open, setOpen] = useState(true);
    const [path, setPath] = useState('');
    const [showBottomNavigation, setShowBottomNavigation] = useState(true);

    const links = [
        { url : DASHBOARD_HOME, text:'Home', icon: <HomeMinus /> },
        { url : MAKE_LISTING, text:'Make a Listing', icon: <FormatListText /> },
        { url : MESSAGES, text:'Messages', icon: <Badge color="error" badgeContent={unreadMessages}><AndroidMessages /></Badge> }
    ];

    const mobileLinks = [
        { url : DASHBOARD_HOME, text:'Home', icon: <HomeMinus /> },
        { url : MAKE_LISTING, text:'Add Listing', icon: <FormatListText /> },
        { url : MESSAGES, text:'Messages', icon: <Badge color="error" badgeContent={unreadMessages}><AndroidMessages /></Badge> },
        { url : PROFILE, text:'Profile', icon: <Account /> }
    ];

    useEffect(() => {
        hideBottomNavigation();
        handleSentMessage();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        setPath(location.pathname);
    }, [location]);

    const handleSentMessage = () => {
        const { CHAT_MESSAGE, TRANSFER_CONFIRMATION, TRANSFER_NOTIFICATION, CANCEL_NEGOTIATION } = NOTIFICATION_TYPES;
        SignalRService.registerReceiveNotification((data, type) => {
            let response = JSON.parse(data);
            let payload, senderId;
            console.log('New Notification ', response, type);
            if (customerId !== response.Sender) {
                const audio = new Audio(audioFile);
                audio.play();
                navigator.vibrate(1000);
            }
            switch (type) {
                case CHAT_MESSAGE:
                    const messageData = {
                        chatId: response.ChatId,
                        dateSent: response.DateSent,
                        id: response.Id,
                        sender: response.Sender,
                        text: response.Text,
                        uploadedFileName: response.UploadedFileName,
                        isRead: false
                    };
        
                    dispatch({
                        type: SENT_MESSAGE,
                        payload: { message: messageData, customerId }
                    });

                break;

                case TRANSFER_CONFIRMATION:
                    payload = JSON.parse(response.Payload);
                    senderId = response.SenderId;

                    dispatch({
                        type: PAYMENT_NOTIFICATION,
                        payload: {
                            buyerHasMadePayment: payload.Chat.BuyerHasMadePayment,
                            buyerHasRecievedPayment: payload.Chat.BuyerHasRecievedPayment,
                            sellerHasMadePayment: payload.Chat.SellerHasMadePayment, 
                            sellerHasRecievedPayment: payload.Chat.SellerHasRecievedPayment, 
                            isDeleted: payload.Chat.IsDeleted,
                            customerId,
                            senderId,
                            transactionType: type
                        }
                    });

                    break;

                case TRANSFER_NOTIFICATION:
                    payload = JSON.parse(response.Payload);
                    senderId = response.SenderId;

                    if (senderId !== customerId) {
                        dispatch({
                            type: PAYMENT_NOTIFICATION,
                            payload: {
                                buyerHasMadePayment: payload.BuyerHasMadePayment,
                                buyerHasRecievedPayment: payload.BuyerHasRecievedPayment,
                                sellerHasMadePayment: payload.SellerHasMadePayment, 
                                sellerHasRecievedPayment: payload.SellerHasRecievedPayment, 
                                isDeleted: payload.IsDeleted,
                                customerId,
                                senderId,
                                transactionType: type
                            }
                        });    
                    }

                    break;

                case CANCEL_NEGOTIATION:
                    payload = JSON.parse(response.Payload);
                    senderId = response.SenderId;
                    
                    if (senderId !== customerId) {
                        dispatch({ 
                            type: CUSTOMER_CANCELED,
                            payload: `Hi, this transaction has been canceled by the other user`
                        });
                    }
                    break;

                default:
                    break;
            }
        });
    };

    const hideBottomNavigation = () => {
        if (isSupported()) {
            subscribe(visibility => {
                if (visibility === 'hidden') {
                    setShowBottomNavigation(true);
                } else {
                    setShowBottomNavigation(false);
                }
            });

            // unsubscribe();
        }
    };

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const handleLinkClick = (link) => {
        history.push(`/dashboard${link}`);
    };

    const handleLogout = () => logout(history);

    return (
        <>
            <Helmet><title>{`${title} | FXBLOOMS.com`}</title></Helmet>
            <section className={classes.root}>
                <Drawer 
                    variant="permanent"
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open
                    })}
                    classes={{
                        paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                        }),
                    }}
                >
                    <div className={classes.toolbar}>
                        {open && 
                            <Link to={`${DASHBOARD}${DASHBOARD_HOME}`}>
                                <img className={classes.logo} src={logo} alt="FXBLOOMS Logo" />
                            </Link>
                        }
                        <IconButton onClick={toggleDrawer}>
                            {!open ?
                                <Tooltip title="Expand Navigation" placement="top" arrow>
                                    <ChevronRight />
                                </Tooltip>
                                :
                                <Tooltip title="Collapse Navigation" placement="top" arrow>
                                    <ChevronLeft />
                                </Tooltip>
                            }
                        </IconButton>
                    </div> 
                    <List className={classes.links}>
                        {links.map((link, index) => (
                            <ListItem 
                                className={clsx({ [classes.link]: path.includes(`${link.url}`) }, classes.linkItem)} 
                                key={index} 
                                button 
                                disableRipple
                                onClick={() => handleLinkClick(link.url)}
                                // disabled={link.url === MAKE_LISTING || link.url === MESSAGES ? true : false}
                            >
                                <ListItemIcon className={clsx({ [classes.icon]: path.includes(`${link.url}`) })} >
                                    {link.icon}
                                </ListItemIcon>
                                <ListItemText primary={link.text} />
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <section className={classes.logoutContainer}>
                        <Link underline="none" to={`${DASHBOARD}${PROFILE}`} component={RouterLink} className={classes.avatarContainer}>
                            <div>
                                <Avatar>
                                    {profile.img ? 
                                        <img src={profile.img} alt={userName} />
                                        :
                                        <Account />
                                    }
                                </Avatar>
                            </div>
                            <div>
                                <Typography variant="subtitle1" component="p">{userName}</Typography>
                            </div>
                        </Link>
                        <Divider />
                        <ListItem button className={classes.logout} onClick={handleLogout}>
                            <ListItemIcon>
                                <Logout />
                            </ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItem>
                    </section>
                </Drawer>
                <div className={classes.content}>
                    {children}
                </div>
                {showBottomNavigation && 
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
                }
            </section>
        </>
    );
};

Dashboard.propTypes = {
    logout: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired
};

export default connect(undefined, { logout })(Dashboard);