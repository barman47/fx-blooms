import { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
    AppBar, 
    Button, 
    IconButton, 
    Toolbar
} from '@material-ui/core';
import clsx from 'clsx';

import { Link as AnimatedLink } from 'react-scroll';
import { Menu as MenuIcon } from 'mdi-material-ui';
import { makeStyles } from '@material-ui/core/styles';

import MobileNav from './MobileNav';

import logo from '../../assets/img/logo.svg';
import logoWhite from '../../assets/img/logo-white.svg';
import { COLORS, SHADOW } from '../../utils/constants';
import { ABOUT_US, CONTACT_US, HOW_IT_WORKS, SIGN_UP, LOGIN, FAQS, DASHBOARD_HOME } from '../../routes';
import { useTheme } from '@material-ui/styles';

import HideOnScroll from './HideOnScroll';

const useStyles = makeStyles(theme => ({
    root: {
        background: 'transparent',
        width: '100%'
    },
    
    nav: {
        display: 'grid',
        gridTemplateColumns: '1fr 4fr 1.2fr',
        alignItems: 'center',
        gap: theme.spacing(3),
        padding: [[0, theme.spacing(10)]],
        width: '100%',

        [theme.breakpoints.down('lg')]: { 
            padding: 0
        },
        [theme.breakpoints.down('md')]: { 
            display: 'none'
        }
    },

    scrollingNav: {
        backgroundColor: COLORS.white,
        boxShadow: SHADOW
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

    scrollingLink: {
        color: theme.palette.primary.main,
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
        // [theme.breakpoints.down('lg')]: {
        //     fontSize: theme.spacing(1)
        // },
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

    scrollingLogin: {
        border: `2px solid ${theme.palette.primary.main}`,
        color: theme.palette.primary.main,
        
        '&:hover': {
            backgroundColor: theme.palette.primary.main,
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
    const classes = useStyles();
    const theme = useTheme();
    const location  = useLocation();

    const { isAuthenticated } = useSelector(state => state.customer);
    
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    // const [open] = useState(false);
    // const anchorRef = useRef(null);
    // const prevOpen = useRef(open);

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const publicRoutes = [
        { url: '/', text: 'Home' },
        { url: HOW_IT_WORKS, text: 'How it Works' },
        { url: ABOUT_US, text:'About Us' },
        { url: FAQS, text: 'FAQs' },
        { url: CONTACT_US, text:'Contact' }
    ];

    // return focus to the button when we transitioned from !open -> open
    // useEffect(() => {
    //     if (prevOpen.current === true && open === false) {
    //         anchorRef.current.focus();
    //     }
    //     prevOpen.current = open;
    // }, [open]);

    const handleScroll = () => {
        const position = window.pageYOffset;
        setScrollPosition(position);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <HideOnScroll {...props}>
            <AppBar className={clsx(classes.root, { [classes.scrollingNav] : scrollPosition > 100 })} elevation={0}>
                <Toolbar>
                    <section className={classes.nav}>
                        {scrollPosition > 100 ?
                            <RouterLink to="/">
                                <img src={logo} alt="FX Blooms Logo" />
                            </RouterLink>
                            :
                            <RouterLink to="/">
                                <img src={logoWhite} alt="FX Blooms Logo" />
                            </RouterLink>
                        }
                        <div className={classes.links}>
                            {isAuthenticated && 
                                <RouterLink 
                                    to={DASHBOARD_HOME}  
                                    className={clsx({ [classes.link]: scrollPosition < 100, [classes.scrollingLink]: scrollPosition > 100 })}
                                >
                                    Dashboard
                                </RouterLink>
                            }
                            {publicRoutes.map((link, index) => {
                                if (location.pathname === '/') {
                                    return (
                                        <AnimatedLink 
                                            key={index}
                                            to={link.url} 
                                            activeClass={classes.activeLink} 
                                            spy={true}
                                            smooth={true}
                                            offset={-70}
                                            duration={500}
                                            className={clsx({ [classes.link]: scrollPosition < 100, [classes.scrollingLink]: scrollPosition > 100 })}
                                        >
                                            {link.text}
                                        </AnimatedLink>
                                    )
                                }
                                return (
                                    <RouterLink 
                                        key={index}
                                        to={link.url} 
                                        className={clsx({ [classes.link]: scrollPosition < 100, [classes.scrollingLink]: scrollPosition > 100 })}
                                    >
                                        {link.text}
                                    </RouterLink>
                                );
                            })}
                        </div>
                        {!isAuthenticated &&
                            <div className={classes.buttonContainer}>
                                <Button 
                                    variant="outlined" 
                                    color="primary" 
                                    to={LOGIN} 
                                    component={RouterLink}
                                    size="medium"
                                    className={clsx(classes.login, classes.button, {[ classes.scrollingLogin ]: scrollPosition > 100 })}
                                >
                                    LOG IN
                                </Button>
                                <Button 
                                    variant="outlined" 
                                    color="primary" 
                                    to={SIGN_UP} 
                                    component={RouterLink}
                                    size="medium"
                                    className={classes.button}
                                    style={{ backgroundColor: theme.palette.primary.main, color: COLORS.offWhite }}
                                >
                                    GET STARTED
                                </Button>
                            </div>
                        }
                    </section>
                    <div className={classes.mobileNav}>
                        <RouterLink to="/">
                            <img src={logo} alt="FX Blooms Logo" className={classes.logo} />
                        </RouterLink>
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