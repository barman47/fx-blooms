import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import {
    AppBar,
    Avatar,
    Button,
    Box,
    Drawer,
    IconButton,
    InputAdornment,
    Link,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Tooltip,
    Toolbar,
    Typography,
    TextField
} from '@material-ui/core';

import { 
    Account,
    AccountMultiple, 
    AlertOutline,
    BagChecked,
    BellAlertOutline,
    CogOutline,
    CurrencyCny,
    ViewDashboard,
    ChevronLeft, 
    ChevronRight,
    CashMinus,
    FilterOutline,
    Headset,
    History,
    Magnify,
    Sort
} from 'mdi-material-ui';

import logo from '../../assets/img/logowhite.svg';

import { getStats, logout } from '../../actions/admin';
import { COLORS, LOGOUT } from '../../utils/constants';

import SessionModal from './SessionModal';
import { 
    ADMIN_HOME,
    CUSTOMERS,
    LISTINGS,
    DEPOSITS,
    WITHDRAWALS,
    HISTORY,
    SUPPORT,
    RISK_PROFILE 
} from '../../routes';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: COLORS.white,

        [theme.breakpoints.down('md')]: {
            paddingLeft: theme.spacing(5),
            paddingRight: theme.spacing(5),
        },

        [theme.breakpoints.down('md')]: {
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
        }
    },

    content: {
        // border: '1px solid red',
        flexGrow: 1,
        marginLeft: theme.spacing(9) + 1,
        marginTop: theme.spacing(12),
        zIndex: '997',
        width: `calc(100% - ${theme.spacing(9) + 1}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),

        [theme.breakpoints.down('sm')]: {
            marginLeft: '0 !important',
            height: '100vh !important',
            width: '100% !important'
        }
    },

    contentShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
    },

    appBar: {
        backgroundColor: '#ffffff',
        borderBottom: `1px solid ${COLORS.borderColor}`,
        zIndex: 999,
        marginLeft: theme.spacing(9) + 1,
        width: `calc(100% - ${theme.spacing(7) + 1}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),

        [theme.breakpoints.down('sm')]: {
            marginLeft: '0 !important',
            width: '100% !important'
        }
    },

    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
    },

    appBarContent: {
        // border: '1px solid red',
        display: 'grid',
        gridTemplateColumns: '4fr 0.9fr',
        alignItems: 'center',
    },

    formContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    searchField: {
        paddingBottom: theme.spacing(0.1),
        paddingTop: theme.spacing(0.1)
    },

    headerLinks: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 0.5fr 0.5fr',
        listStyleType: 'none',
        alignItems: 'center',
        gap: theme.spacing(1),

        '& li': {
            textAlign: 'center'
        }
    },

    avatarContainer: {
        alignSelf: 'stretch',
        borderLeft: `1px solid ${COLORS.borderColor}`,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing(0, 1)
    },

    adminName: {
        color: COLORS.grey,
        fontWeight: 500
    },

    drawer: {
        flexShrink: 0,
        whiteSpace: 'nowrap',
        width: drawerWidth,
        
        [theme.breakpoints.down('md')]: {
            display: 'none'
        }
    },
    
    paper: {
        backgroundColor: theme.palette.primary.main,
        borderTopRightRadius: '40px',
        boxSizing: 'border-box',
        paddingRight: theme.spacing(2),
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
        color: COLORS.offWhite
    },
    
    expandIcon: {
        color: COLORS.offWhite
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

    admin: {
        color: COLORS.offWhite,
        position: 'relative',
        top: -30,
        left: 53
    },

    links: {
        marginTop: theme.spacing(4.5)
    },

    linkItem: {
        borderBottomRightRadius: theme.shape.borderRadius,
        borderTopRightRadius: theme.shape.borderRadius,
        color: COLORS.offWhite,
        marginBottom: theme.spacing(1),

        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.58)'
        }
    },

    activeLink: {
        backgroundColor: 'rgba(255, 255, 255, 0.58)'
    },

    icon: {
        color: COLORS.offWhite
    }
}));

const AdminDashboard = ({ children, title, getStats, logout }) => {
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();
    const { admin } = useSelector(state => state);

    const [searchText, setSearchText] = useState('');
    const [open, setOpen] = useState(true);
    // eslint-disable-next-line
    const [path, setPath] = useState('');

    const links = [
        { url : ADMIN_HOME, text:'Dashboard', icon: <ViewDashboard /> },
        { url : CUSTOMERS, text:'Users', icon: <AccountMultiple /> },
        { url : LISTINGS, text:'Listings', icon: <CurrencyCny /> },
        { url : DEPOSITS, text:'Deposits', icon: <BagChecked /> },
        { url : WITHDRAWALS, text:'Withdrawals', icon: <CashMinus /> },
        { url : HISTORY, text:'History', icon: <History /> },
        { url : SUPPORT, text:'Support', icon: <Headset /> },
        { url : RISK_PROFILE, text:'Risk Profile', icon: <AlertOutline /> },
    ];

    useEffect(() => {
        checkSession();
        getStats();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        setPath(location.pathname);
    }, [location.pathname]);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const checkSession = () => {
        if (sessionStorage.getItem(LOGOUT)) {
            sessionStorage.removeItem(LOGOUT);
            logout(history);
        }
    };

    const handleLinkClick = (link) => {
        history.push(link);
    };

    return (
        <>
            <Helmet><title>{`${title} | FXBLOOMS.com`}</title></Helmet>
            <SessionModal />
            <section className={classes.root}>
                <AppBar position="fixed" color="transparent" elevation={0} className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}>
                    <Toolbar className={classes.appBarContent}>
                        <Box component="div" className={classes.formContainer}>
                            <form>
                                <TextField 
                                    className={classes.searchField}
                                    type="text"
                                    variant="outlined"
                                    placeholder="Search . . ."
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Magnify />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </form>
                            <Box component="div">
                                <ul className={classes.headerLinks}>
                                    <li>
                                        <Button
                                            variant="text"
                                            startIcon={<Sort />}
                                        >
                                            Sort
                                        </Button>
                                    </li>
                                    <li>
                                        <Button
                                            variant="text"
                                            startIcon={<FilterOutline />}
                                        >
                                            Filter
                                        </Button>
                                    </li>
                                    <li><IconButton color="primary"><BellAlertOutline /></IconButton></li>
                                    <li><IconButton color="primary"><CogOutline /></IconButton></li>
                                </ul>
                            </Box>
                        </Box>
                        <Box component="div" className={classes.avatarContainer}>
                            <Avatar>
                                <Account />
                            </Avatar>
                            &nbsp;&nbsp;
                            <Typography variant="body2" component="span" className={classes.adminName}>{`${admin.firstName} ${admin.lastName}`}</Typography>
                        </Box>
                    </Toolbar>
                </AppBar>
                <Drawer 
                    variant="permanent"
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
                    <Typography variant="body2" component="span" className={classes.admin}>Admin</Typography>
                    <List className={classes.links}>
                        {links.map((link, index) => (
                            <ListItem 
                                className={clsx(classes.linkItem, { [classes.activeLink]: path.includes(`${link.url}`) })} 
                                key={index} 
                                button 
                                disableRipple
                                onClick={() => handleLinkClick(link.url)}
                                // disabled={link.url === MAKE_LISTING || link.url === MESSAGES ? true : false}
                            >
                                <ListItemIcon className={classes.icon}>
                                    {link.icon}
                                </ListItemIcon>
                                {open && <ListItemText primary={link.text} />}
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
                <div className={clsx(classes.content, {
                    [classes.contentShift]: open})}
                >
                    {children}
                </div>
                {/* {showBottomNavigation && 
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
                } */}
            </section>
        </>
    );
};

AdminDashboard.propTypes = {
    title: PropTypes.string.isRequired,
    getStats: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired
};

export default connect(undefined, { getStats, logout })(AdminDashboard);