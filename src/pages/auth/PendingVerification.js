import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { 
    Container, 
    Typography 
    } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { COLORS } from '../../utils/constants';

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
        display: 'grid',
        gridTemplateColumns: '1fr',
        rowGap: theme.spacing(3),
        justifyContent: 'center',
        fontWeight: 300,
        marginTop: theme.spacing(5),
        padding: theme.spacing(3),
        textAlign: 'center',
        width: '40vw',

        [theme.breakpoints.down('sm')]: {
            marginTop: theme.spacing(2),
            width: '80vw'
        },

        '& h5': {
            [theme.breakpoints.down('md')]: {
                fontSize: theme.spacing(2)
            }
        },

        '& p': {
            fontWeight: 300
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

    return (
        <>
            <Helmet><title>Pending Verification | FXBLOOMS.com</title></Helmet>
            <Container className={classes.root}>
                <RouterLink to="/" className={classes.logo}>
                    <img src={logo} className={classes.logo} alt="FX Blooms Logo" />
                </RouterLink>
                <div className={classes.content}>
                    <Typography variant="h5">Email Verification Pending</Typography>
                    <Typography variant="subtitle1" component="p">A verification link has been sent to your email address. Click on the link to continue your onboarding process.</Typography>
                </div>
            </Container>
        </>
    );
}

export default PendingVerification;