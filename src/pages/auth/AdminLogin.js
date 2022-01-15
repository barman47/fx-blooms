import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link as RouterLink, useHistory} from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Button, Grid, Link, TextField, Typography } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Spinner from '../../components/common/Spinner';
import Toast from '../../components/common/Toast';

import { login } from '../../actions/admin';
import { GET_ERRORS } from '../../actions/types';

import isEmpty from '../../utils/isEmpty';
import { COLORS } from '../../utils/constants';
import { ADMIN_HOME } from '../../routes';

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

const AdminLogin = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const dispatch = useDispatch();
    const history = useHistory();

    const { isAuthenticated } = useSelector(state => state.customer);
    const errorsState = useSelector(state => state.errors);

    const [Username, setUsername] = useState('');
    const [Password, setPassword] = useState('');

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const toast = useRef();

    useEffect(() => {
        if (isAuthenticated) {
            return history.push(`${ADMIN_HOME}`);

        }
        // eslint-disable-next-line
    }, []);

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
            <Helmet><title>AdminLogin | FXBLOOMS.com</title></Helmet>
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
                        FXBLOOMS Admin
                    </Typography>
                    <Typography variant="subtitle2" style={{ fontWeight: 300, marginTop: theme.spacing(2) }} align="center">
                        Complete the form below to sign in
                    </Typography>
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
                                    helperText={errors.Username || errors.message}
                                    fullWidth
                                    required
                                    error={errors.Username || errors.message ? true : false}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container direction="row" justifyContent="space-between">
                                    <Grid item>
                                        <Typography variant="subtitle2" component="span">Password</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Link to="!#" component={RouterLink} className={classes.link} style={{ fontWeight: 300 }}>
                                            Forgot Password?
                                        </Link>
                                    </Grid>
                                </Grid>
                                <TextField 
                                    className={classes.input}
                                    value={Password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                    variant="outlined" 
                                    placeholder="Enter Password"
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
                        </Grid>
                    </form>
                </div>
            </section>
        </>
    );
};

AdminLogin.propTypes = {
    login: PropTypes.func.isRequired
};

export default connect(undefined, { login })(AdminLogin);