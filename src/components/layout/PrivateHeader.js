import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { 
    AppBar, 
    Avatar, 
    Badge, 
    Button, 
    Grid, 
    IconButton, 
    Link, 
    Slide, 
    Toolbar, 
    useScrollTrigger 
} from '@material-ui/core';

import { Account, FormatListText, HomeMinus, Menu as MenuIcon, Message } from 'mdi-material-ui';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { toggleDrawer } from '../../pages/dashboard/profile';

import { logout } from '../../actions/customer';

import logo from '../../assets/img/logo.svg';
import { COLORS } from '../../utils/constants';
import { DASHBOARD_HOME, MAKE_LISTING, NOTIFICATIONS, ACCOUNT } from '../../routes';

export const HideOnScroll = (props) => {
    const { children, direction } = props;
    const trigger = useScrollTrigger();

    return (
        <Slide appear={false} direction={direction} in={!trigger}>
            {children}
        </Slide>
    );
}

HideOnScroll.defaultProps = {
    direction: 'down'
};

HideOnScroll.propTypes = {
    children: PropTypes.element.isRequired,
    direction: PropTypes.string

};

const useStyles = makeStyles(theme => ({
    root: {
        background: COLORS.white,
        boxShadow: `0px 1px 0px #e5e9f2`,
        width: '100%'
    },
    
    nav: {
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        alignItems: 'center',
        gap: theme.spacing(5),
        padding: [[0, theme.spacing(10)]],
        width: '100%',
        
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
        fontSize: theme.spacing(1.8),
        fontWeight: 600,
        textDecoration: 'none',
        textTransform: 'uppercase',
        transition: '0.3s linear all',

        '&:hover': {
            color: theme.palette.primary.main
        }
    },
    
    activeLink: {
        color: theme.palette.primary.main
    },

    linkIcon: {
        position: 'relative',
        top: 5
    },
    
    links: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
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
        justifyContent: 'flex-end',
        alignItems: 'center',
    },

    avatarButton: {
        color: 'primary',
        marginLeft: theme.spacing(2),
        
        '&:hover': {
            background: 'transparent'
        }
    }
}));

export const PrivateHeader = (props) => {
    const location = useLocation();
    const classes = useStyles();
    
    const { firstName, lastName } = useSelector(state => state.customer);
    const { unreadNotifications } = useSelector(state => state.notifications);
    
    const [open, setOpen] = useState(false);
    const [isProfilePage, setIsprofilePage] = useState(false);

    const mobileDropdown = useRef(null);

    useEffect(() => {
        if (location.pathname.includes(ACCOUNT)) {
            setIsprofilePage(true);
        } else {
            setIsprofilePage(false);
        }
    }, [location.pathname]);

    const protectedRoutes = [
        { url: DASHBOARD_HOME, text: 'Dashboard', icon: <HomeMinus /> },
        { url: MAKE_LISTING, text:'Make a Listing', icon: <FormatListText /> },
        // { url: WALLET, text:'Wallet', icon: <Wallet /> },
        { url: NOTIFICATIONS, text:'Notifications', icon: <Badge overlap="circular" color="error" variant="dot" badgeContent={unreadNotifications}><Message /></Badge> },
        { url: ACCOUNT, text:'Account', icon: <Account /> }
    ];

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };;

    return (
        <HideOnScroll {...props}>
            <AppBar className={classes.root} elevation={0}>
                <Toolbar>
                    <section className={classes.nav}>
                        <RouterLink to="/">
                            <img src={logo} alt="FX Blooms Logo" />
                        </RouterLink>
                        <div className={classes.links}>
                            {protectedRoutes.map((link, index) =>(
                                <Grid item key={index}>
                                    <Link
                                        to={link.url}
                                        component={RouterLink}
                                        className={clsx(classes.link, { [classes.activeLink]: location.pathname.includes(link.url) })}
                                        underline="none"
                                    >
                                        <span className={classes.linkIcon}>{link.icon}</span>&nbsp;&nbsp;&nbsp;{link.text}
                                    </Link>
                                </Grid>
                            ))}
                        </div>
                        {/* <div className={classes.avatarContainer}>
                            <Avatar alt={`${firstName} ${lastName}`} />
                        </div> */}
                    </section>
                    <div className={classes.mobileNav}>
                        <RouterLink to="/">
                            <img src={logo} alt="FX Blooms Logo" className={classes.logo} />
                        </RouterLink>
                        {isProfilePage ? 
                            <IconButton edge="start" className={classes.menuButton} color="primary" aria-label="menu" onClick={toggleDrawer} >
                                <MenuIcon />
                            </IconButton>
                            : 
                            <Button
                                type="text" 
                                ref={mobileDropdown}
                                onClick={handleToggle}
                                aria-controls={open ? 'mobile-profile-menu' : undefined}
                                aria-haspopup="true"
                            >
                                <Avatar alt={`${firstName} ${lastName}`} />
                            </Button>
                        }
                    </div>
                </Toolbar>
            </AppBar>
        </HideOnScroll>
    );
};

PrivateHeader.propTypes = {
    logout: PropTypes.func.isRequired,
};

export default connect(undefined, { logout })(PrivateHeader);