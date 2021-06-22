import { useState } from 'react';
import { useHistory, Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import logo from '../../assets/img/logo.svg';

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

import { ChevronRight, ChevronLeft, HomeMinus, FormatListText, AndroidMessages, Logout } from 'mdi-material-ui';
import { CREATE_LISTING, DASHBOARD_HOME, MESSAGES } from '../../routes';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'row',
        flexGrow: 1,
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
        color: 'inherit'
    },

    logoutContainer: {
        position: 'absolute',
        bottom: 0
    },

    bottomBar: {
        display: 'none',
        position: 'absolute',
        bottom: 0,
        width: '100vw',
        [theme.breakpoints.down('sm')]: {
            display: 'block'
        }
    }
}));

const Dashboard = ({children}) => {
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const [open, setOpen] = useState(true);

    const history = useHistory();

    const links = [
        { url : DASHBOARD_HOME, text:'Home', icon: <HomeMinus /> },
        { url : CREATE_LISTING, text:'Make a Listing', icon: <FormatListText /> },
        { url : MESSAGES, text:'Messages', icon: <AndroidMessages /> }
    ];

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
        history.push(`/dashboard${link}`);
    };

    return (
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
                    <List>
                        {links.map((link, index) => (
                            <ListItem key={index} button onClick={() => handleLinkClick(link.url)}>
                                <ListItemIcon>
                                    {link.icon}
                                </ListItemIcon>
                                <ListItemText primary={link.text} />
                            </ListItem>
                        ))}
                    </List>
                <Divider />
                <List className={classes.logoutContainer}>
                    <ListItem button>
                        <ListItemIcon>
                            <Logout />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItem>
                </List>
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
                    {links.map((item, index) => (
                        <BottomNavigationAction key={index} label={item.text} icon={item.icon} />
                    ))}
                </BottomNavigation>
            </Box>
        </section>
    );
}

export default Dashboard;