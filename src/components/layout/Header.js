import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useHistory, useLocation } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { 
    AppBar, 
    Avatar, 
    Badge, 
    ClickAwayListener,
    Button, 
    Grid, 
    Grow,
    IconButton, 
    Link, 
    MenuList, 
    MenuItem, 
    Paper,
    Popper,
    Slide, 
    Toolbar, 
    useScrollTrigger 
} from '@material-ui/core';

import { Link as AnimatedLink } from 'react-scroll';
import { ChevronDown, FormatListText, HomeMinus, Menu as MenuIcon, Message, Wallet } from 'mdi-material-ui';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import MobileNav from './MobileNav';

import { logout } from '../../actions/customer';

import logo from '../../assets/img/logo.svg';
import avatar from '../../assets/img/avatar.jpg';
import { COLORS } from '../../utils/constants';
import { ABOUT_US, CONTACT_US, SIGN_UP, LOGIN, WHY, DASHBOARD, DASHBOARD_HOME, MAKE_LISTING, NOTIFICATIONS, WALLET, PROFILE } from '../../routes';

function HideOnScroll (props) {
    const { children } = props;
    const trigger = useScrollTrigger();

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

HideOnScroll.propTypes = {
    children: PropTypes.element.isRequired
};

const useStyles = makeStyles(theme => ({
    root: {
        background: COLORS.white,
        boxShadow: `0px 1px 0px #e5e9f2`,
    },
    
    nav: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: [[0, theme.spacing(10)]],

        [theme.breakpoints.down('lg')]: { 
            padding: 0
        },
        [theme.breakpoints.down('md')]: { 
            display: 'none'
        }
    },

    link: {
        color: COLORS.darkGrey,
        cursor: 'pointer',
        fontWeight: 500,
        textDecoration: 'none',
        transition: '0.3s linear all',

        '&:hover': {
            color: theme.palette.primary.main
        }
    },

    activeLink: {
        color: theme.palette.primary.main,
        fontWeight: 600
    },

    linkIcon: {
        position: 'relative',
        top: 5
    },

    signUp: {
        color: theme.palette.primary.main
    },

    menuButton: {
        color: theme.palette.primary.main
    },

    mobileNav: {
        display: 'none',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        
        [theme.breakpoints.down('md')]: {
            display: 'flex'
        }
    },

    avatarContainer: {
        display: 'flex',
        flexDirection: 'row',
    },

    avatarButton: {
        color: 'primary',
        marginLeft: theme.spacing(2),
        
        '&:hover': {
            background: 'transparent'
        }
    }
}));

const Header = (props) => {
    const history = useHistory();
    const location = useLocation();
    const classes = useStyles();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const { firstName, lastName, isAuthenticated } = useSelector(state => state.customer);
    const { authorized } = useSelector(state => state.twoFactor);
    const { unreadMessages } = useSelector(state => state.chat);

    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const prevOpen = useRef(open);

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const protectedRoutes = [
        { url: DASHBOARD_HOME, text:'Dashboard', icon: <HomeMinus /> },
        { url: MAKE_LISTING, text:'Make a Listing', icon: <FormatListText /> },
        { url: WALLET, text:'Wallet', icon: <Wallet /> },
        { url: NOTIFICATIONS, text:'Notifications', icon: <Badge overlap="circle" color="error" variant="dot" badgeContent={unreadMessages}><Message /></Badge> }
    ];

    const publicRoutes = [
        { url: WHY, text:'Why FXBLOOMS' },
        { url: ABOUT_US, text:'About Us' },
        { url: CONTACT_US, text:'Contact' }
    ];

    

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleMenuClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);

    const handleLogout = (e) => {
        e.preventDefault();
        props.logout(history);
    };

    return (
        <HideOnScroll {...props}>
            <AppBar className={classes.root} elevation={0}>
                <Toolbar>
                    <Grid container direction="row" alignItems="center" className={classes.nav}>
                        <Grid item xs={1}>
                            <a href="https://fxblooms.com">
                                <img src={logo} alt="FX Blooms Logo" />
                            </a>
                        </Grid>
                        <Grid item xs={location.pathname.includes(DASHBOARD) ? 9 : 8}>
                            <Grid container direction="row" alignItems="center" spacing={5} justify="center">
                                {isAuthenticated && authorized ?
                                    <>
                                        {protectedRoutes.map((link, index) =>(
                                            <Grid item key={index}>
                                                <Link
                                                    to={`${DASHBOARD}${link.url}`}
                                                    component={RouterLink}
                                                    className={classes.link}
                                                    underline="none"
                                                >
                                                    <span className={classes.linkIcon}>{link.icon}</span>&nbsp;&nbsp;&nbsp;{link.text}
                                                </Link>
                                            </Grid>
                                        ))}
                                    </>
                                    :
                                    <>
                                        {publicRoutes.map((link, index) => (
                                            <Grid item key={index}>
                                                <AnimatedLink 
                                                    to={link.url} 
                                                    activeClass={classes.activeLink} 
                                                    spy={true}
                                                    smooth={true}
                                                    offset={-70}
                                                    duration={500}
                                                    className={classes.link}
                                                    >
                                                        {link.text}
                                                </AnimatedLink>
                                            </Grid>
                                        ))}
                                    </>
                                }
                            </Grid>
                        </Grid>
                        <Grid item xs={location.pathname.includes(DASHBOARD) ? 2 : 3}>
                            <Grid container direction="row" justify="flex-end" alignItems="center" spacing={2}>
                                {
                                    isAuthenticated && authorized ?
                                    <>
                                        <div className={classes.avatarContainer}>
                                            <Avatar alt={`${firstName} ${lastName}`} src={avatar} />
                                            <Button
                                                to={`${DASHBOARD}${DASHBOARD_HOME}`}
                                                endIcon={<ChevronDown />}
                                                classes={{ root: classes.avatarButton }}
                                                ref={anchorRef}
                                                onClick={handleToggle}
                                                aria-controls={open ? 'profile-menu' : undefined}
                                                aria-haspopup="true"
                                            >
                                                Account
                                            </Button>
                                        </div>
                                        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                                            {({ TransitionProps, placement }) => (
                                                <Grow
                                                    {...TransitionProps}
                                                    style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                                                >
                                                    <Paper>
                                                        <ClickAwayListener onClickAway={handleMenuClose}>
                                                            <MenuList autoFocusItem={open} id="profile-menu" onKeyDown={handleListKeyDown}>
                                                                <MenuItem
                                                                    onClick={(e) => handleMenuClose(e, `${DASHBOARD}${PROFILE}`)}
                                                                >
                                                                    <RouterLink to={`${DASHBOARD}${PROFILE}`} className={classes.link}>My Profile</RouterLink>
                                                                </MenuItem>
                                                                <MenuItem>
                                                                    <RouterLink to="#!" onClick={handleLogout} className={classes.link}>Log out</RouterLink>
                                                                </MenuItem>
                                                            </MenuList>
                                                        </ClickAwayListener>
                                                    </Paper>
                                                </Grow>
                                            )}
                                        </Popper>
                                    </>
                                    :
                                    <>
                                        <Grid item>
                                            <Button 
                                                variant="outlined" 
                                                color="primary" 
                                                to={LOGIN} 
                                                // className={classes.link} 
                                                component={RouterLink}
                                                size="large"
                                                >
                                                Log In
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button 
                                                variant="contained" 
                                                color="primary" 
                                                to={SIGN_UP} 
                                                component={RouterLink}
                                                size="large"
                                            >
                                                Get Started
                                            </Button>
                                        </Grid>
                                    </>
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                    <div className={classes.mobileNav}>
                        <a href="https://fxblooms.com">
                            <img src={logo} alt="FX Blooms Logo" className={classes.logo} />
                        </a>
                        {/* Show when user not on dashboard  and is logged in*/}
                        <Link 
                            to={PROFILE}
                            component={RouterLink}
                        >
                            <Avatar alt={`${firstName} ${lastName}`} src={avatar} />
                        </Link>
                        {!location.pathname.includes(DASHBOARD) && 
                            <IconButton edge="start" className={classes.menuButton} color="primary" aria-label="menu" onClick={toggleDrawer} >
                                <MenuIcon />
                            </IconButton>
                        }
                    </div>
                    <MobileNav toggleDrawer={toggleDrawer} drawerOpen={drawerOpen} />
                </Toolbar>
            </AppBar>
        </HideOnScroll>
    );
};

Header.propTypes = {
    logout: PropTypes.func.isRequired,
};

export default connect(undefined, { logout })(Header);