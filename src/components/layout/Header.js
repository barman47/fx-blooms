import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Button, Toolbar, Grid, IconButton, Link, Slide, useScrollTrigger } from '@material-ui/core';
import { Menu as MenuIcon } from 'mdi-material-ui';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import MobileNav from './MobileNav';

import logo from '../../assets/img/logo.svg';
import { COLORS } from '../../utils/constants';
import { ABOUT_US, CONTACT_US, SIGN_UP, LOGIN, WHY } from '../../routes';

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
        boxShadow: `0px 1px 0px #e5e9f2`
    },

    nav: {
        paddingLeft: theme.spacing(10),
        paddingRight: theme.spacing(10),

        [theme.breakpoints.down('lg')]: { 
            // padding: [[0, theme.spacing(5)]],
        },
        [theme.breakpoints.down('md')]: { 
            display: 'none'
        }
    },

    link: {
        color: COLORS.darkGrey,
        fontWeight: 300,
        transition: '0.3s linear all',

        '&:hover': {
            color: theme.palette.primary.main
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

const Header = (props) => {
    const classes = useStyles();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    return (
        <HideOnScroll {...props}>
            <AppBar className={classes.root} elevation={0}>
                <Toolbar>
                    <Grid container direction="row" alignItems="center" className={classes.nav}>
                        <Grid item xs={9}>
                            <Grid container direction="row" alignItems="center" spacing={5} justify="flex-start">
                                <Grid item>
                                    <Link to="/" component={RouterLink}>
                                        <img src={logo} alt="FX Blooms Logo" />
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link to={WHY} className={classes.link} component={RouterLink} underline="none">Why FXBLOOMS</Link>
                                </Grid>
                                <Grid item>
                                    <Link to={ABOUT_US} className={classes.link} component={RouterLink} underline="none">About Us</Link>
                                </Grid>
                                <Grid item>
                                    <Link to={CONTACT_US} className={classes.link} component={RouterLink} underline="none">Contact</Link>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={3}>
                            <Grid container direction="row" justify="flex-end" alignItems="center" spacing={2}>
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
                            </Grid>
                        </Grid>
                    </Grid>
                    <div className={classes.mobileNav}>
                        <Link to="/" component={RouterLink}>
                            <img src={logo} alt="FX Blooms Logo" className={classes.logo} />
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