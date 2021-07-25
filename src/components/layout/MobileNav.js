import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import { AccountOutline, Home, Phone, Login } from 'mdi-material-ui';

import logo from '../../assets/img/logo.svg';
import { COLORS } from '../../utils/constants';

import ListItemLink from './ListItemLink';

import { CONTACT_US, SIGN_UP, LOGIN } from '../../routes';

const useStyles = makeStyles(theme => ({
    drawer: {
        // backgroundColor: theme.palette.primary.main,
        display: 'flex',
        flexDirection: 'column',
        paddingTop: theme.spacing(5),
        width: '60%',
    },

    link: {
        alignSelf: 'center'
    },

    drawerLogo: {
        marginBottom: theme.spacing(5),
        width: '100%'
    },

    menuButton: {
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

    return (
        <section>
            <Drawer PaperProps={{ className: classes.drawer }} anchor="left" open={drawerOpen} onClose={toggleDrawer}>
                <Link to="/" className={classes.link}>
                    <img src={logo} alt="FX Blooms Logo" className={classes.drawerLogo} />
                </Link>
                <List>
                    <ListItemLink button divider to="/" onClick={toggleDrawer}>
                        <ListItemIcon>
                            <Home />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItemLink>
                    <ListItemLink button divider to={CONTACT_US} onClick={toggleDrawer}>
                        <ListItemIcon>
                            <Phone />
                        </ListItemIcon>
                        <ListItemText primary="Contact Us" />
                    </ListItemLink>
                    <ListItemLink button divider to={SIGN_UP} onClick={toggleDrawer}>
                        <ListItemIcon>
                            <AccountOutline />
                        </ListItemIcon>
                        <ListItemText primary="Sign Up" />
                    </ListItemLink>
                    <ListItemLink button divider to={LOGIN} onClick={toggleDrawer}>
                        <ListItemIcon>
                            <Login />
                        </ListItemIcon>
                        <ListItemText primary="Log In" />
                    </ListItemLink>
                </List>
                <Typography variant="subtitle2" className={classes.copyright} >&copy; Copyright FX Blooms {new Date().getFullYear()}</Typography>
            </Drawer>
        </section>
    );
}

export default MobileNav;