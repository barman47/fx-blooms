import { useEffect, useState } from 'react';
import { useHistory, useLocation, Link as RouterLink } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import logo from '../../assets/img/logo.svg';
import avatar from '../../assets/img/avatar.jpg';

import {
    Box,
    IconButton,
    Drawer,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    BottomNavigation,
    BottomNavigationAction,
    Tooltip
} from '@material-ui/core';

import { Account, ChevronRight, ChevronLeft, HomeMinus, FormatListText, AndroidMessages, Logout } from 'mdi-material-ui';
import { MAKE_LISTING, DASHBOARD_HOME, MESSAGES, PROFILE } from '../../routes';

import { COLORS } from '../../utils/constants';

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

    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
    },

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
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },

    content: {
        flexGrow: 1
    },

    link: {
        backgroundColor: `${COLORS.lightTeal} !important`,
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: theme.shape.borderRadius,
        color: theme.palette.primary.main
    },

    linkItem: {
        backgroundColor: COLORS.offWhite,
        marginBottom: theme.spacing(2)
    },

    icon: {
        color: theme.palette.primary.main
    },

    logoutContainer: {
        position: 'absolute',
        bottom: 0,
        width: drawerWidth
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

const Dashboard = ({ children }) => {
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();

    const [value, setValue] = useState(0);
    const [open, setOpen] = useState(true);
    const [path, setPath] = useState('');


    const links = [
        { url : DASHBOARD_HOME, text:'Home', icon: <HomeMinus /> },
        { url : MAKE_LISTING, text:'Make a Listing', icon: <FormatListText /> },
        { url : MESSAGES, text:'Messages', icon: <AndroidMessages /> }
    ];

    const mobileLinks = [
        { url : DASHBOARD_HOME, text:'Home', icon: <HomeMinus /> },
        { url : MAKE_LISTING, text:'Add Listing', icon: <FormatListText /> },
        { url : MESSAGES, text:'Messages', icon: <AndroidMessages /> },
        { url : PROFILE, text:'Profile', icon: <Account /> }
    ];

    useEffect(() => {
        setPath(location.pathname);
    }, [location]);

    // eslint-disable-next-line
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const toggleDrawer = () => {
        setOpen(!open);
    };
    
    // eslint-disable-next-line
    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleLinkClick = (link) => {
        // console.log(`/dashboard${link}`);
        history.push(`/dashboard${link}`);
    };

    return (
        <>
            <section className={classes.root}>
                {/* <AppBar 
                    position="fixed"
                    color="transparent"
                    elevation={1}
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: open
                    })}
                >
                    <Toolbar>
                        <IconButton 
                            edge="start" 
                            className={clsx(classes.menuButton, {
                                [classes.hide]: open,
                            })}
                            color="inherit" 
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                        >
                            <Menu />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            News
                        </Typography>
                        <Button color="inherit">Login</Button>
                    </Toolbar>
                </AppBar> */}
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
                            <RouterLink to="/">
                                <img className={classes.logo} src={logo} alt="FXBlooms Logo" />
                            </RouterLink>
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
                    <Divider />
                    <List className={classes.links}>
                        {links.map((link, index) => (
                            <ListItem 
                                className={clsx({ [classes.link]: path.includes(`${link.url}`) }, classes.linkItem)} 
                                key={index} 
                                button 
                                disableRipple
                                onClick={() => handleLinkClick(link.url)}
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
                        <div className={classes.avatarContainer}>
                            <div>
                                <img className={classes.avatar} src={avatar} alt="Avatar" />
                            </div>
                            <div>
                                <Typography variant="h6">Hello User</Typography>
                                <Typography variant="subtitle2" component="span" className={classes.email}>hello@fxblooms.com</Typography>
                            </div>
                        </div>
                        <Divider />
                        <ListItem button className={classes.logout}>
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
                <Box
                    boxShadow={5}
                    // bgcolor="background.paper"
                    // m={1}
                    // p={1}
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
}

export default Dashboard;