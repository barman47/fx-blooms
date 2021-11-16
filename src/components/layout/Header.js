import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppBar, Avatar, Badge, Button, Toolbar, Grid, IconButton, Link, Slide, useScrollTrigger } from '@material-ui/core';
import { Link as AnimatedLink } from 'react-scroll';
import { ChevronDown, FormatListText, HomeMinus, Menu as MenuIcon, Message, Wallet } from 'mdi-material-ui';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import MobileNav from './MobileNav';

import logo from '../../assets/img/logo.svg';
import avatar from '../../assets/img/avatar.jpg';
import { COLORS } from '../../utils/constants';
// import { MAKE_LISTING, DASHBOARD_HOME, MESSAGES, NOTIFICATIONS } from '../../routes';
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
    const classes = useStyles();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const { firstName, lastName, isAuthenticated } = useSelector(state => state.customer);
    const { authorized } = useSelector(state => state.twoFactor);
    const { unreadMessages } = useSelector(state => state.chat);

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const protectedRoutes = [
        { url: DASHBOARD_HOME, text:'Dashboard', icon: <HomeMinus /> },
        { url: MAKE_LISTING, text:'Make a Listing', icon: <FormatListText /> },
        { url: WALLET, text:'Wallet', icon: <Wallet /> },
        { url: NOTIFICATIONS, text:'Notifications', icon: <Badge color="error" badgeContent={unreadMessages}><Message /></Badge> }
    ];

    const publicRoutes = [
        { url: WHY, text:'Why FXBLOOMS' },
        { url: ABOUT_US, text:'About Us' },
        { url: CONTACT_US, text:'Contact' }
    ];

    return (
        <HideOnScroll {...props}>
            <AppBar className={classes.root} elevation={0}>
                <Toolbar>
                    <Grid container direction="row" alignItems="center" className={classes.nav}>
                        <Grid item xs={9}>
                            <Grid container direction="row" alignItems="center" spacing={5} justify="flex-start">
                                <Grid item>
                                    <a href="https://fxblooms.com">
                                        <img src={logo} alt="FX Blooms Logo" />
                                    </a>
                                </Grid>
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
                        <Grid item xs={3}>
                            <Grid container direction="row" justify="flex-end" alignItems="center" spacing={2}>
                                {
                                    isAuthenticated && authorized ?
                                    <div className={classes.avatarContainer}>
                                        <Avatar alt={`${firstName} ${lastName}`} src={avatar} />
                                        <Button
                                            to={`${DASHBOARD}${DASHBOARD_HOME}`}
                                            endIcon={<ChevronDown />}
                                            classes={{ root: classes.avatarButton }}
                                        >
                                            Account
                                        </Button>
                                    </div>
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
                        <IconButton edge="start" className={classes.menuButton} color="primary" aria-label="menu" onClick={toggleDrawer} >
                            <MenuIcon />
                        </IconButton>
                    </div>
                    <MobileNav toggleDrawer={toggleDrawer} drawerOpen={drawerOpen} />
                </Toolbar>
            </AppBar>
        </HideOnScroll>
    );
};

export default Header;