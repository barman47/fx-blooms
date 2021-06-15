import { useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link as RouterLink} from 'react-router-dom';
import { Button, Grid, Link, TextField, Typography } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import Toast from '../../components/common/Toast';

import isEmpty from '../../utils/isEmpty';
import { COLORS } from '../../utils/constants';
import { SIGN_UP } from '../../routes';

import validateLogin from '../../utils/validation/auth/login';

import logo from '../../assets/img/logo.svg';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        padding: [[theme.spacing(5), theme.spacing(10)]],

        [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2)
        }
    },

    logo: {
        alignSelf: 'flex-start'
    },

    formContainer: {
        alignSelf: 'center',
        justifySelf: 'center',
        paddingTop: theme.spacing(5),
        width: '40%',

        [theme.breakpoints.down('md')]: {
            width: '70%'
        },

        [theme.breakpoints.down('sm')]: {
            width: '100%'
        }
    },
    
    form: {
        backgroundColor: COLORS.lightTeal,
        marginTop: theme.spacing(5),
        padding: [[theme.spacing(8), theme.spacing(5)]],

        [theme.breakpoints.down('sm')]: {
            padding: [[theme.spacing(4), theme.spacing(2)]]
        }
    },

    input: {
        borderRadius: '5px',
        marginBottom: theme.spacing(5)
    },

    button: {
        marginBottom: theme.spacing(5)
    },

    link: {
        color: theme.palette.primary.main,
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'none'
        }
    }
}));

const Login = () => {
    const classes = useStyles();
    const theme = useTheme();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [errors, setErrors] = useState({});

    const toast = useRef();

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setErrors({});
    
        const data = { username, password };
    
        const { errors, isValid } = validateLogin(data);

        if (!isValid) {
            console.log('form submitted ', errors);
            setErrors({ ...errors, msg: 'Invalid data' });
            return toast.current.handleClick();
        }

        setErrors({});
    };    

    return (
        <>
            <Helmet><title>Login | FXBlooms.com</title></Helmet>
            {!isEmpty(errors) && 
                <Toast 
                    ref={toast}
                    title="ERROR"
                    duration={10000}
                    msg={errors.msg || ''}
                    type="error"
                />
            }
            <section className={classes.root}>
                <Link to="/">
                    <img src={logo} className={classes.logo} alt="FX Blooms Logo" />
                </Link>
                <div className={classes.formContainer}>
                    <Typography variant="h5" align="center">
                        Welcome back!
                    </Typography>
                    <Typography variant="subtitle2" style={{ fontWeight: 300, marginTop: theme.spacing(2) }} align="center">
                        Complete the form below to sign in
                    </Typography>
                    <form onSubmit={handleFormSubmit} className={classes.form}>
                        <Grid container direction="column">
                            <Grid item xs={12}>
                                <TextField 
                                    className={classes.input}
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    type="text"
                                    variant="outlined" 
                                    placeholder="Username"
                                    label="Username" 
                                    helperText={errors.username}
                                    fullWidth
                                    required
                                    error={errors.username ? true : false}
                                />
                            </Grid>
                            <Grid item xs={12} style={{ alignSelf: 'flex-end' }}>
                                <Link to="!#" component={RouterLink} className={classes.link} style={{ fontWeight: 300 }}>
                                    Forgot Password?
                                </Link>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField 
                                    className={classes.input}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="text"
                                    variant="outlined" 
                                    label="Password" 
                                    placeholder="Password"
                                    helperText={errors.password}
                                    fullWidth
                                    required
                                    error={errors.password ? true : false}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button 
                                    className={classes.button}
                                    variant="contained" 
                                    color="primary"
                                    fullWidth
                                >
                                    Sign In
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" component="p" align="center" style={{ fontWeight: 300 }}>
                                    Don't have an account? <RouterLink to={SIGN_UP} className={classes.link}>Sign Up</RouterLink>
                                </Typography>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </section>
        </>
    );
};

export default Login;