import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { 
    Container,
    Link,
    Typography 
} from '@mui/material';
import { makeStyles } from '@mui/styles';

import { COLORS } from '../../utils/constants';
import { LOGIN } from '../../routes';

import logo from '../../assets/img/logo.svg';

const useStyles = makeStyles(theme => ({
    root: {
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
        margin: [[theme.spacing(5), 'auto', 0, 'auto']],
        padding: [[theme.spacing(7), theme.spacing(3)]],
        textAlign: 'center',
        width: '50%',

        [theme.breakpoints.down('md')]: {
            width: '70%'
        },

        [theme.breakpoints.down('sm')]: {
            marginTop: theme.spacing(2),
            padding: [[theme.spacing(3), theme.spacing(1)]],
            width: '95%'
        },

        '& p': {
            fontWeight: 300
        }
    },

    time: {
        color: theme.palette.primary.main
    },

    link: {
        color: theme.palette.primary.main,
        fontWeight: 500,
    }
}));

const SignupSuccess = () => {
    const classes = useStyles();
    const navigate = useNavigate();

    
    const [timeTillRedirect, setTimeTillRedirect] = useState(10);
    
    const interval = useRef();

    useEffect(() => {
        redirect();
        return () => {
            clearInterval(interval.current);
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (parseInt(timeTillRedirect) <= 0) {
            navigate(LOGIN);
        }
    }, [navigate, timeTillRedirect]);

    const redirect = () => {
        interval.current = setInterval(() => {
            setTimeTillRedirect(timeTillRedirect => timeTillRedirect - 1);
        },1000);
    };

    return (
        <>
            <Helmet><title>Signup Successful | FXBLOOMS.com</title></Helmet>
            <Container className={classes.root}>
                <RouterLink to="/" className={classes.logo}>
                    <img src={logo} className={classes.logo} alt="FXBLOOMS Logo" />
                </RouterLink>
                <div className={classes.content}>
                    <Typography variant="h5">Sign Up Successful</Typography>
                    <Typography variant="subtitle1" component="p">You will now be redirected to the login page in <span className={classes.time}>{timeTillRedirect} seconds</span>. If you are not redirected automatically, use the link below</Typography>
                    <Link to={LOGIN} component={RouterLink} className={classes.link}>Proceed to Login</Link>
                </div>
            </Container>
        </>
    );
};

export default SignupSuccess;