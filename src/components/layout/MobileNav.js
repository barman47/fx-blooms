import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Link as AnimatedLink } from 'react-scroll';
import {
    Drawer,
    List,
    ListItemText,
    ListItemIcon,
    Typography
} from '@material-ui/core';
import { AccountOutline, Home, FormatListText, InformationVariant, Phone, Login, Help, TelevisionGuide } from 'mdi-material-ui';

import logo from '../../assets/img/logo.svg';
import { COLORS } from '../../utils/constants';

import ListItemLink from './ListItemLink';

import { CONTACT_US, FAQS, SIGN_UP, LOGIN, ABOUT_US, HOW_IT_WORKS, DASHBOARD, DASHBOARD_HOME } from '../../routes';

const useStyles = makeStyles(theme => ({
    drawer: {
        // backgroundColor: theme.palette.primary.main,
        display: 'flex',
        flexDirection: 'column',
        paddingTop: theme.spacing(5),
        width: '70%',
    },

    link: {
        alignSelf: 'center',
        color: 'inherit',
        cursor: 'pointer',
        textDecoration: 'none'
    },

    activeLink: {
        color: theme.palette.primary.main,
        fontWeight: 600
    },

    drawerLogo: {
        marginBottom: theme.spacing(5),
        width: '100%'
    },

    menuButton: {
        color: theme.palette.primary.main
    },

    listings: {
        color: theme.palette.primary.main
    },

    copyright: {
        color: COLORS.lightGray,
        display: 'inline-block',
        position: 'absolute',
        bottom: 10,
        textAlign: 'center',
        width: '100%'
    }
}));

const MobileNav = ({ toggleDrawer, drawerOpen }) => {
    const classes = useStyles();
    const location = useLocation();

    const { isAuthenticated } = useSelector(state => state.customer);

    let timeout = useRef();

    useEffect(() => {
        return () => {
            timeout.current && clearTimeout(timeout.current);
        };
    }, []);

    const closeDrawer = () => {
        timeout.current = setTimeout(() => {
            toggleDrawer();
        }, 600);
    };

    const homeRoutes = [
        // { url: '/', text: 'Home' },
        { url: HOW_IT_WORKS, text: 'How it Works', icon: <TelevisionGuide /> },
        { url: ABOUT_US, text:'About Us', icon: <InformationVariant /> },
        { url: FAQS, text: 'FAQs', icon: <Help /> },
        { url: CONTACT_US, text:'Contact', icon: <Phone /> }
    ];

    return (
        <section>
            <Drawer PaperProps={{ className: classes.drawer }} anchor="left" open={drawerOpen} onClose={toggleDrawer}>
                <Link to="/" className={classes.link}>
                    <img src={logo} alt="FX Blooms Logo" className={classes.drawerLogo} />
                </Link>
                <List>
                    <ListItemLink button divider to="/">
                        <ListItemIcon>
                            <Home />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItemLink>
                    {isAuthenticated === true ? 
                        <ListItemLink button divider to={DASHBOARD_HOME}>
                            <ListItemIcon>
                                <FormatListText className={classes.listings} />
                            </ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItemLink>
                        :
                        <>
                            <ListItemLink button divider to={SIGN_UP}>
                                <ListItemIcon>
                                    <AccountOutline />
                                </ListItemIcon>
                                <ListItemText primary="Get Started" />
                            </ListItemLink>
                            <ListItemLink button divider to={LOGIN}>
                                <ListItemIcon>
                                    <Login />
                                </ListItemIcon>
                                <ListItemText primary="Log In" />
                            </ListItemLink>
                        </>
                    }
                    {homeRoutes.map(({ icon, text, url }, index) => {
                        if (location.pathname === '/') {
                            return (
                                <ListItemLink button divider key={index}>
                                    <ListItemIcon>
                                        {icon}
                                    </ListItemIcon>
                                    <AnimatedLink 
                                        to={url} 
                                        activeClass={classes.activeLink} 
                                        spy={true}
                                        smooth={true}
                                        offset={-70}
                                        duration={500}
                                        className={classes.link}
                                        onClick={closeDrawer}
                                    >
                                        {text}
                                    </AnimatedLink>
                                </ListItemLink>    
                            );
                        }
                        return (
                            <ListItemLink button divider key={index}>
                                <ListItemIcon>
                                    {icon}
                                </ListItemIcon>
                                <Link 
                                    to={url} 
                                    activeClass={classes.activeLink} 
                                    className={classes.link}
                                    onClick={closeDrawer}
                                >
                                    {text}
                                </Link>
                            </ListItemLink>    
                        );
                    })}
                </List>
                <Typography variant="subtitle2" className={classes.copyright} >&copy; Copyright FX Blooms {new Date().getFullYear()}</Typography>
            </Drawer>
        </section>
    );
}

export default MobileNav;