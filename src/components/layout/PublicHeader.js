import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
    AppBar, 
    Button, 
    IconButton, 
    Slide, 
    Toolbar, 
    useScrollTrigger 
} from '@material-ui/core';
import clsx from 'clsx';

import { Link as AnimatedLink } from 'react-scroll';
import { Menu as MenuIcon } from 'mdi-material-ui';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import MobileNav from './MobileNav';

import logo from '../../assets/img/logo.svg';
import { COLORS } from '../../utils/constants';
import { ABOUT_US, CONTACT_US, SIGN_UP, LOGIN, WHY, DASHBOARD, DASHBOARD_HOME } from '../../routes';
import { useTheme } from '@material-ui/styles';

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
        background: 'transparent',
        // boxShadow: `0px 1px 0px #e5e9f2`,
        // position: 'absolute',
        width: '100%'
    },
    
    nav: {
        display: 'grid',
        gridTemplateColumns: '1fr 4fr 1.2fr',
        alignItems: 'center',
        gap: theme.spacing(3),
        padding: [[0, theme.spacing(10)]],

        [theme.breakpoints.down('lg')]: { 
            padding: 0
        },
        [theme.breakpoints.down('md')]: { 
            display: 'none'
        }
    },

    link: {
        color: COLORS.offWhite,
        cursor: 'pointer',
        fontSize: theme.spacing(1.8),
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

    links: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },    

    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center !important'
    },
    
    button: {
        width: 'initial',
        [theme.breakpoints.down('lg')]: {
            fontSize: theme.spacing(1)
        },
        [theme.breakpoints.down('md')]: {
            fontSize: 'initial'
        }
    },

    login: {
        border: `2px solid ${COLORS.offWhite}`,
        color: COLORS.offWhite,
        
        '&:hover': {
            border: `2px solid ${COLORS.offWhite}`,
            color: COLORS.offWhite,
        }
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
    }
}));

export const PublicHeader = (props) => {
    const history = useHistory();
    const classes = useStyles();
    const theme = useTheme();

    const { isAuthenticated } = useSelector(state => state.customer);
    
    const [drawerOpen, setDrawerOpen] = useState(false);
    // eslint-disable-next-line
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const prevOpen = useRef(open);

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const publicRoutes = [
        { url: WHY, text: 'Home' },
        { url: WHY, text: 'How it Works' },
        { url: ABOUT_US, text:'About Us' },
        { url: WHY, text: 'Frequently Asked Questions' },
        { url: CONTACT_US, text:'Contact' }
    ];

    // return focus to the button when we transitioned from !open -> open
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);

    // eslint-disable-next-line
    const handleLogout = (e) => {
        e.preventDefault();
        props.logout(history);
    };

    return (
        <HideOnScroll {...props}>
            <AppBar className={classes.root} elevation={0}>
                <Toolbar>
                    <section className={classes.nav}>
                        <a href="https://fxblooms.com">
                            <img src={logo} alt="FX Blooms Logo" />
                        </a>
                        <div className={classes.links}>
                            {isAuthenticated && 
                                <RouterLink 
                                    to={`${DASHBOARD}${DASHBOARD_HOME}`}  
                                    className={classes.link}
                                >
                                    Dashboard
                                </RouterLink>
                            }
                            {publicRoutes.map((link, index) => (
                                <AnimatedLink 
                                    key={index}
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
                            ))}
                        </div>
                        {!isAuthenticated &&
                            <div className={classes.buttonContainer}>
                                <Button 
                                    variant="outlined" 
                                    color="primary" 
                                    to={LOGIN} 
                                    component={RouterLink}
                                    size="large"
                                    className={clsx(classes.login, classes.button)}
                                >
                                    Log In
                                </Button>
                                <Button 
                                    variant="outlined" 
                                    color="primary" 
                                    to={SIGN_UP} 
                                    component={RouterLink}
                                    size="large"
                                    className={classes.button}
                                    style={{ backgroundColor: theme.palette.primary.main, color: COLORS.offWhite }}
                                >
                                    Get Started
                                </Button>
                            </div>
                        }
                    </section>
                    <div className={classes.mobileNav}>
                        <a href="https://fxblooms.com">
                            <img src={logo} alt="FX Blooms Logo" className={classes.logo} />
                        </a>
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

export default PublicHeader;