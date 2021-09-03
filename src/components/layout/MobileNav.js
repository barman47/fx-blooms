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
import { AccountOutline, Home, FormatListText, InformationVariant, Phone, Login, Help } from 'mdi-material-ui';

import logo from '../../assets/img/logo.svg';
import { COLORS } from '../../utils/constants';

import ListItemLink from './ListItemLink';

import { CONTACT_US, SIGN_UP, LOGIN, ABOUT_US, WHY, DASHBOARD, DASHBOARD_HOME } from '../../routes';

const useStyles = makeStyles(theme => ({
    drawer: {
        // backgroundColor: theme.palette.primary.main,
        display: 'flex',
        flexDirection: 'column',
        paddingTop: theme.spacing(5),
        width: '60%',
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
    const { isAuthenticated } = useSelector(state => state.customer);
    const { authorized } = useSelector(state => state.twoFactor);

    return (
        <section>
            <Drawer PaperProps={{ className: classes.drawer }} anchor="left" open={drawerOpen} onClose={toggleDrawer}>
                <a href="https://wp.fxblooms.com" className={classes.link}>
                    <img src={logo} alt="FX Blooms Logo" className={classes.drawerLogo} />
                </a>
                <List>
                    <ListItemLink button divider to="https://wp.fxblooms.com" onClick={toggleDrawer}>
                        <ListItemIcon>
                            <Home />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItemLink>
                    {isAuthenticated === true && authorized === true ? 
                        <ListItemLink button divider to={`${DASHBOARD}${DASHBOARD_HOME}`} onClick={toggleDrawer}>
                            <ListItemIcon>
                                <FormatListText className={classes.listings} />
                            </ListItemIcon>
                            <ListItemText primary="All Listings" />
                        </ListItemLink>
                        :
                        <>
                            <ListItemLink button divider to={SIGN_UP} onClick={toggleDrawer}>
                                <ListItemIcon>
                                    <AccountOutline />
                                </ListItemIcon>
                                <ListItemText primary="Get Started" />
                            </ListItemLink>
                            <ListItemLink button divider to={LOGIN} onClick={toggleDrawer}>
                                <ListItemIcon>
                                    <Login />
                                </ListItemIcon>
                                <ListItemText primary="Log In" />
                            </ListItemLink>
                        </>
                    }
                    <ListItemLink button divider onClick={toggleDrawer}>
                        <ListItemIcon>
                            <Help />
                        </ListItemIcon>
                        <AnimatedLink 
                            to={WHY} 
                            activeClass={classes.activeLink} 
                            spy={true}
                            smooth={true}
                            offset={-70}
                            duration={500}
                            className={classes.link}
                            >
                                Why FXBLOOMS
                        </AnimatedLink>
                    </ListItemLink>
                    <ListItemLink button divider onClick={toggleDrawer}>
                        <ListItemIcon>
                            <InformationVariant />
                        </ListItemIcon>
                        <AnimatedLink 
                            to={ABOUT_US} 
                            activeClass={classes.activeLink} 
                            spy={true}
                            smooth={true}
                            offset={-70}
                            duration={500}
                            className={classes.link}
                            >
                                About Us
                        </AnimatedLink>
                    </ListItemLink>
                    <ListItemLink button divider onClick={toggleDrawer}>
                        <ListItemIcon>
                            <Phone />
                        </ListItemIcon>
                        <AnimatedLink 
                            to={CONTACT_US} 
                            activeClass={classes.activeLink} 
                            spy={true}
                            smooth={true}
                            offset={-70}
                            duration={500}
                            className={classes.link}
                            >
                                Contact
                        </AnimatedLink>
                    </ListItemLink>
                </List>
                <Typography variant="subtitle2" className={classes.copyright} >&copy; Copyright FX Blooms {new Date().getFullYear()}</Typography>
            </Drawer>
        </section>
    );
}

export default MobileNav;