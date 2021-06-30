import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link as RouterLink, useHistory} from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Button, Grid, Link, TextField, Typography } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Spinner from '../../components/common/Spinner';
import Toast from '../../components/common/Toast';

import { login } from '../../actions/customer';
import { GET_ERRORS } from '../../actions/types';

import isEmpty from '../../utils/isEmpty';
import { COLORS } from '../../utils/constants';
import { SIGN_UP } from '../../routes';

import validateLogin from '../../utils/validation/customer/login';

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

const Login = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const dispatch = useDispatch();
    const history = useHistory();
    const errorsState = useSelector(state => state.errors);

    const [Username, setUsername] = useState('');
    const [Password, setPassword] = useState('');

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const toast = useRef();

    useEffect(() => {
        if (!isEmpty(errors)) {
            toast.current.handleClick();
        }
    }, [errors]);

    useEffect(() => {
        if (errorsState?.msg) {
            setErrors({ ...errorsState });
            setLoading(false);
            dispatch({
                type: GET_ERRORS,
                payload: {}
            });
        }
    }, [dispatch, errorsState, errors]);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setErrors({});
    
        const data = { Username, Password };
    
        const { errors, isValid } = validateLogin(data);

        if (!isValid) {
            return setErrors({ ...errors, msg: 'Invalid login data' });
        }

        setErrors({});
        setLoading(true);
        props.login(data, history);
    };    

    return (
        <>
            <Helmet><title>Login | FXBlooms.com</title></Helmet>
            {!isEmpty(errors) && 
                <Toast 
                    ref={toast}
                    title="ERROR"
                    duration={5000}
                    msg={errors.msg || ''}
                    type="error"
                />
            }
            {loading && <Spinner />}
            <section className={classes.root}>
                <RouterLink to="/">
                    <img src={logo} className={classes.logo} alt="FX Blooms Logo" />
                </RouterLink>
                <div className={classes.formContainer}>
                    <Typography variant="h5" align="center">
                        Welcome back!
                    </Typography>
                    <Typography variant="subtitle2" style={{ fontWeight: 300, marginTop: theme.spacing(2) }} align="center">
                        Complete the form below to sign in
                    </Typography>
                    <form onSubmit={handleFormSubmit} className={classes.form} noValidate>
                        <Grid container direction="column">
                            <Grid item xs={12}>
                                <TextField 
                                    className={classes.input}
                                    value={Username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    type="text"
                                    variant="outlined" 
                                    placeholder="Username"
                                    label="Username" 
                                    helperText={errors.Username || errors.message}
                                    fullWidth
                                    required
                                    error={errors.Username || errors.message ? true : false}
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
                                    value={Password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                    variant="outlined" 
                                    label="Password" 
                                    placeholder="Password"
                                    helperText={errors.Password || errors.message}
                                    fullWidth
                                    required
                                    error={errors.Password  || errors.message ? true : false}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button 
                                    className={classes.button}
                                    variant="contained" 
                                    color="primary"
                                    type="submit"
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

Login.propTypes = {
    login: PropTypes.func.isRequired
};

export default connect(undefined, { login })(Login);