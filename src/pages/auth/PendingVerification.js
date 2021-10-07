import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { 
    Container, 
    Link,
    Typography 
    } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import { COLORS } from '../../utils/constants';
import { SIGN_UP } from '../../routes';

import logo from '../../assets/img/logo.svg';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: theme.spacing(5),

        [theme.breakpoints.down('sm')]: {
            paddingTop: theme.spacing(2)
        }
    },
    
    content: {
        backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius,
        display: 'grid',
        gridTemplateColumns: '1fr',
        rowGap: theme.spacing(3),
        justifyContent: 'center',
        fontWeight: 300,
        marginTop: theme.spacing(5),
        padding: theme.spacing(7),
        width: '35vw',

        [theme.breakpoints.down('md')]: {
            width: '60vw'
        },
        [theme.breakpoints.down('sm')]: {
            marginTop: theme.spacing(2),
            padding: theme.spacing(4),
            width: '70vw'
        },

        '& h5': {
            color: theme.palette.primary.main,
            [theme.breakpoints.down('md')]: {
                fontSize: theme.spacing(2)
            }
        },

        '& p': {
            fontWeight: 300
        }, '& ul li': {
            marginBottom: theme.spacing(2)
        }
    },

    logo: {
        alignSelf: 'flex-start',
    },

    image: {
        margin: '0 auto',
        width: 'initial',

        [theme.breakpoints.down('sm')]: {
            width: '90vw'
        }
    }
}));

const PendingVerification = () => {
    const classes = useStyles();
    const theme = useTheme();
    const location = useLocation();

    return (
        <>
            <Helmet><title>Pending Verification | FXBLOOMS.com</title></Helmet>
            <Container className={classes.root}>
                <a href="https://fxblooms.com" className={classes.logo}>
                    <img src={logo} className={classes.logo} alt="FX Blooms Logo" />
                </a>
                <div className={classes.content}>
                    <Typography variant="h5">Email Verification Pending</Typography>
                    <Typography variant="subtitle1" component="p">We've sent a message to <span style={{ fontWeight: 500, color: theme.palette.primary.main }}>{location?.state?.email}</span> with a link to activate your account</Typography>
                    <Typography variant="subtitle1" component="p">If you don't see an email from us within a few minutes, a few things could have happened:</Typography>
                    <ul>
                        <li>The email is in your spam folder.</li>
                        <li>The email address you entered is incorrect.</li>
                        <li>We can't deliver the email to this address (usually because of corporate firewalls or filtering).</li>
                    </ul>
                    <Link to={SIGN_UP} component={RouterLink} color="primary" underline="none">Try another email address</Link>
                </div>
            </Container>
        </>
    );
}

export default PendingVerification;