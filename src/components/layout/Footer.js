import { Link as RouterLink } from 'react-router-dom';
import { Link, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { TERMS, PRIVACY_POLICY, FAQS } from '../../routes';
import { COLORS } from '../../utils/constants';

import logo from '../../assets/img/logo-white.svg';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: COLORS.black,
        color: COLORS.offWhite,
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: theme.spacing(4),
        padding: [[theme.spacing(5), theme.spacing(10)]],

        '& img': {
            marginBottom: theme.spacing(3)
        },

        '& span': {
            fontWeight: 300
        }
    },

    link: {
        color: COLORS.offWhite,
        fontWeight: 300,
        marginRight: theme.spacing(4)
    }
}));

const Footer = () => {
    const classes = useStyles();

    return (
        <footer className={classes.root}>
            <img src={logo} alt="FX Blooms Logo" />
            <div>
                <Link to={TERMS} component={RouterLink} className={classes.link}>Terms and Conditions</Link>
                <Link to={PRIVACY_POLICY} component={RouterLink} className={classes.link}>Privacy Policy</Link>
                <Link to={FAQS} component={RouterLink} className={classes.link}>Frequently Asked Questions</Link>
            </div>
            <Typography variant="subtitle2" component="span">
                &copy; {new Date().getFullYear()} FXBlooms. All rights reserved
            </Typography>
        </footer>
    );
};

export default Footer;