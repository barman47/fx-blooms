import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Button, Grid, TextField, Typography } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Validator from 'validator';

import Spinner from '../../components/common/Spinner';
import SuccessModal from '../../components/common/SuccessModal';
import Toast from '../../components/common/Toast';

import { forgotPassword } from '../../actions/customer';
import { GET_ERRORS, SET_CUSTOMER_MSG } from '../../actions/types';

import { COLORS } from '../../utils/constants';
import isEmpty from '../../utils/isEmpty';
import { DASHBOARD_HOME, HOME, LOGIN } from '../../routes';

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

const ForgotPassword = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const dispatch = useDispatch();
    const history = useNavigate();
    const { isAuthenticated, msg } = useSelector(state => state.customer);
    const { authorized } = useSelector(state => state.twoFactor);
    const errorsState = useSelector(state => state.errors);

    const [Email, setUsername] = useState('');

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const successModal = useRef();
    const toast = useRef();

    useEffect(() => {
        if (isAuthenticated && authorized) {
            return history(DASHBOARD_HOME);
        }
        // eslint-disable-next-line
    }, []);

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

    useEffect(() => {
        if (errors.msg) {
            toast.current.handleClick();
        }
    }, [errors]);

    useEffect(() => {
        if (msg) {
            setLoading(false);
            successModal.current.openModal();
            successModal.current.setModalText(msg);
            dispatch({
                type: SET_CUSTOMER_MSG,
                payload: null
            });
        }
    }, [dispatch, history, msg]);

    const goHome = () => window.location.href = HOME;;

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        if (!Validator.isEmail(Email)) {
            return setErrors({ Email: 'Invalid email address' });
        }

        if (Validator.isEmpty(Email)) {
            return setErrors({ Email: 'Email address is required' });
        }

        setErrors({});
        setLoading(true);
        props.forgotPassword(Email);
    };    

    return (
        <>
            <Helmet><title>Forgot Password | FXBLOOMS.com</title></Helmet>
            {!isEmpty(errors) && 
                <Toast 
                    ref={toast}
                    title="ERROR"
                    duration={5000}
                    msg={errors.message || ''}
                    type="error"
                />
            }
            <SuccessModal ref={successModal} dismissAction={goHome} />
            {loading && <Spinner />}
            <section className={classes.root}>
                <RouterLink to="/">
                    <img src={logo} className={classes.logo} alt="FXBLOOMS Logo" />
                </RouterLink>
                <div className={classes.formContainer}>
                    <Typography variant="h5" align="center">
                        Forgot Password
                    </Typography>
                    <Typography variant="subtitle2" style={{ fontWeight: 300, marginTop: theme.spacing(2) }} align="center">
                        Enter your email address below
                    </Typography>
                    <form onSubmit={handleFormSubmit} className={classes.form} noValidate>
                        <Grid container direction="column">
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" component="span">Email Address</Typography>
                                <TextField 
                                    className={classes.input}
                                    value={Email}
                                    onChange={(e) => setUsername(e.target.value)}
                                    type="text"
                                    variant="outlined" 
                                    placeholder="Enter Email"
                                    helperText={errors.Email || errors.message}
                                    fullWidth
                                    required
                                    error={errors.Email || errors.message ? true : false}
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
                                    Send Reset Link
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" component="p" align="center" style={{ fontWeight: 300 }}>
                                    Remember now? <RouterLink to={LOGIN} className={classes.link}>Sign In</RouterLink>
                                </Typography>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </section>
        </>
    );
};

ForgotPassword.propTypes = {
    forgotPassword: PropTypes.func.isRequired
};

export default connect(undefined, { forgotPassword })(ForgotPassword);