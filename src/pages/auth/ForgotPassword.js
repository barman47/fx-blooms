import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link as RouterLink } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Button, Grid, TextField, Typography } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Validator from 'validator';

import Spinner from '../../components/common/Spinner';
import Toast from '../../components/common/Toast';

import { login } from '../../actions/customer';
import { GET_ERRORS } from '../../actions/types';

import isEmpty from '../../utils/isEmpty';
import { COLORS } from '../../utils/constants';
import { LOGIN } from '../../routes';

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
    // const history = useHistory();
    const errorsState = useSelector(state => state.errors);

    const [Email, setUsername] = useState('');

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

        if (!Validator.isEmail(Email)) {
            return setErrors({ Email: 'Invalid email address' });
        }

        if (Validator.isEmpty(Email)) {
            return setErrors({ Email: 'Email address is required' });
        }

        setErrors({});
        setLoading(true);
    };    

    return (
        <>
            <Helmet><title>Forgot Password | FXBlooms.com</title></Helmet>
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
                                    helperText={errors.Email}
                                    fullWidth
                                    required
                                    error={errors.Email ? true : false}
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
    login: PropTypes.func.isRequired
};

export default connect(undefined, { login })(ForgotPassword);