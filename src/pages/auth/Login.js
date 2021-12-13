import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link as RouterLink, useHistory} from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { 
    Button, 
    Collapse,
    Grid, 
    IconButton,
    InputAdornment,
    Link, 
    TextField, 
    Tooltip,
    Typography 
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Close, EyeOutline, EyeOffOutline } from 'mdi-material-ui';
import PropTypes from 'prop-types';

import Spinner from '../../components/common/Spinner';
import TwoFactorModal from './TwoFactorModal';

import { login, logout } from '../../actions/customer';
import { GET_ERRORS } from '../../actions/types';

import { COLORS } from '../../utils/constants';
import { DASHBOARD, DASHBOARD_HOME, FORGOT_PASSWORD, SIGN_UP, VERIFY_2FA } from '../../routes';

import validateLogin from '../../utils/validation/customer/login';

import logo from '../../assets/img/logo.svg';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        padding: [[theme.spacing(5), theme.spacing(10)]],

        [theme.breakpoints.down('sm')]: {
            alignItems: 'center',
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
        borderRadius: theme.shape.borderRadius,
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

const Login = ({ login, logout }) => {
    const classes = useStyles();
    const theme = useTheme();
    const dispatch = useDispatch();
    const history = useHistory();
    const errorsState = useSelector(state => state.errors);
    const { customer } = useSelector(state => state);
    const { authorized } = useSelector(state => state.twoFactor);

    const [Username, setUsername] = useState('');
    const [Password, setPassword] = useState('');

    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (customer.isAuthenticated && authorized) {
            return history.push(`${DASHBOARD}${DASHBOARD_HOME}`);
        }
        // eslint-disable-next-line
    }, []);
    
    useEffect(() => {
        if (customer.token) {
            logout(history);
        }
    }, [history, logout, customer.token]);

    useEffect(() => {
        if (errorsState?.msg) {
            setErrors({ ...errorsState });
            setLoading(false);
            setOpen(true);
            dispatch({
                type: GET_ERRORS,
                payload: {}
            });
        }
    }, [dispatch, errorsState, errors]);

    useEffect(() => {
        if (customer.twoFactorEnabled === true && loading) {
            setLoading(false);
            history.push(VERIFY_2FA, { twoFactorEnabled: true });
        }

        if (customer.twoFactorEnabled === false && loading) {
            setLoading(false);
            setShowModal(true);
        }
    }, [customer, history, loading]);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setErrors({});
    
        const data = { Username, Password };
    
        const { errors, isValid } = validateLogin(data);

        if (!isValid) {
            return setErrors({ ...errors });
        }

        setErrors({});
        setOpen(false);
        setLoading(true);
        login(data, history);
    };   

    return (
        <>
            <Helmet>
                <title>Login | FXBLOOMS.com</title>
                <meta name="description" content="Thanks for joining FXBLOOMS. Trust and security are our cornerstones. Log in to enjoy unbeatable rates and service." />
            </Helmet>
            <TwoFactorModal open={showModal} />
            {loading && <Spinner />}
            <section className={classes.root}>
                <a href="https://fxblooms.com">
                    <img src={logo} className={classes.logo} alt="FX Blooms Logo" />
                </a>
                <div className={classes.formContainer}>
                    <Typography variant="h5" align="center">
                        Welcome back!
                    </Typography>
                    <Typography variant="subtitle2" style={{ fontWeight: 300, marginTop: theme.spacing(2) }} align="center">
                        Complete the form below to sign in
                    </Typography>
                    {(errors.msg || errors.message) && 
                        <Collapse in={open}>
                            <Alert 
                                severity="error"
                                action={
                                    <IconButton 
                                        color="inherit" 
                                        size="small"
                                        onClick={() => {
                                            setOpen(false);
                                            dispatch({ type: GET_ERRORS, payload: {} })}
                                        }
                                    >
                                        <Close />
                                    </IconButton>
                                }
                            >
                                {errors.msg || errors.message}
                            </Alert>
                        </Collapse>
                    }
                    <form onSubmit={handleFormSubmit} className={classes.form} noValidate>
                        <Grid container direction="column">
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" component="span">Username</Typography>
                                <TextField 
                                    className={classes.input}
                                    value={Username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    type="text"
                                    variant="outlined" 
                                    placeholder="Enter Username"
                                    helperText={errors.Username}
                                    fullWidth
                                    required
                                    error={errors.Username ? true : false}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container direction="row" justify="space-between">
                                    <Grid item>
                                        <Typography variant="subtitle2" component="span">Password</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Link to={FORGOT_PASSWORD} component={RouterLink} className={classes.link} style={{ fontWeight: 300 }}>
                                            Forgot Password?
                                        </Link>
                                    </Grid>
                                </Grid>
                                <TextField 
                                    className={classes.input}
                                    value={Password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type={showPassword ? 'text': 'password'}
                                    variant="outlined" 
                                    placeholder="Enter Password"
                                    helperText={errors.Password}
                                    fullWidth
                                    required
                                    error={errors.Password  ? true : false}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={toggleShowPassword}
                                                >
                                                    {showPassword ? 
                                                        <Tooltip title="Hide Password" placement="bottom" arrow>
                                                            <EyeOutline />
                                                        </Tooltip>
                                                            : 
                                                            <Tooltip title="Show Password" placement="bottom" arrow>
                                                            <EyeOffOutline />
                                                        </Tooltip>
                                                     }
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
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
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired
};

export default connect(undefined, { login, logout })(Login);