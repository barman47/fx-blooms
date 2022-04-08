import { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Button, Grid, IconButton, InputAdornment, TextField, Tooltip, Typography } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { EyeOutline, EyeOffOutline } from 'mdi-material-ui';
import PropTypes from 'prop-types';

import Spinner from '../../components/common/Spinner';
import SuccessModal from '../../components/common/SuccessModal';
import Toast from '../../components/common/Toast';

import { resetPassword } from '../../actions/customer';
import { GET_ERRORS, SET_CUSTOMER_MSG } from '../../actions/types';

import isEmpty from '../../utils/isEmpty';
import  {
    COLORS,
    ONE_UPPERCASE_LETTER,
    ONE_LOWERCASE_LETTER,
    ONE_DIGIT,
    ONE_SPECIAL_CHARACTER,
    EIGHT_CHARACTERS
} from '../../utils/constants';
import validateResetPassword from '../../utils/validation/customer/resetPassword';
import { DASHBOARD_HOME, LOGIN } from '../../routes';

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

    passwordStrength: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        marginBottom: theme.spacing(1),

        '& small': {
            color: '#ff0000',
            fontSize: theme.spacing(1.3),
            fontWeight: 300
        }
    },

    link: {
        color: theme.palette.primary.main,
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'none'
        }
    }
}));

const ResetPassword = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, msg } = useSelector(state => state.customer);
    const { authorized } = useSelector(state => state.twoFactor);
    const errorsState = useSelector(state => state.errors);

    const [Password, setPassword] = useState('');
    const [ConfirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [showStrengthBadge, setShowStrengthBadge] = useState(false);
    const [isStrongPassword, setIsStrongPassword] = useState(false);

    const [isUppercase, setIsUppercase] = useState(false);
    const [isLowercase, setIsLowercase] = useState(false);
    const [isOneDigit, setIsOneDigit] = useState(false);
    const [isOneSpecialCharacter, setIsOneSpecialCharacter] = useState(false);
    const [isEightCharacters, setIsEightCharacters] = useState(false);

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const successModal = useRef();
    let timeout = useRef();
    const toast = useRef();

    useEffect(() => {
        if (isAuthenticated && authorized) {
            return navigate(DASHBOARD_HOME);
        }
        setToken(navigate.location.search.split('=')[1]);
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
        }
    }, [dispatch, msg]);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const redirectToLogin = () => {
        dispatch({
            type: SET_CUSTOMER_MSG,
            payload: null
        });
        navigate(LOGIN)
    };

    const strengthChecker = useCallback((password) => {
        if (ONE_UPPERCASE_LETTER.test(password)) {
            setIsUppercase(true);
        } else {
            setIsUppercase(false);
        }
        if (ONE_LOWERCASE_LETTER.test(password)) {
            setIsLowercase(true);
        } else {
            setIsLowercase(false);
        }
        if (ONE_DIGIT.test(password)) {
            setIsOneDigit(true);
        } else {
            setIsOneDigit(false);
        }
        if (ONE_SPECIAL_CHARACTER.test(password)) {
            setIsOneSpecialCharacter(true);
        } else {
            setIsOneSpecialCharacter(false);
        }
        if (EIGHT_CHARACTERS.test(password)) {
            setIsEightCharacters(true);
        } else {
            setIsEightCharacters(false);
        }
        
        if (isUppercase && isLowercase && isOneDigit && isOneSpecialCharacter && isEightCharacters) {
            setIsStrongPassword(true);
        } else {
            setIsStrongPassword(false);
        }
    }, [isUppercase, isLowercase, isOneDigit, isOneSpecialCharacter, isEightCharacters]);

    useEffect(() => {
        if (Password) {
            clearTimeout(timeout.current);
            setShowStrengthBadge(true);

            timeout.current = setTimeout(() => strengthChecker(Password), 500);

        } else {
            clearTimeout(timeout.current);
            setShowStrengthBadge(false);
            setIsUppercase(false);
            setIsLowercase(false);
            setIsOneDigit(false);
            setIsOneSpecialCharacter(false);
            setIsEightCharacters(false);
            setIsStrongPassword(false);
        }
    }, [Password, strengthChecker, timeout]);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        if (!isStrongPassword) {
            return setErrors({ msg: 'Weak password' });
        }

        const data = { Password, ConfirmPassword };
        const { errors, isValid } = validateResetPassword(data);

        if (!isValid) {
            return setErrors({ ...errors });
        }

        setErrors({});
        setLoading(true);
        props.resetPassword({
            token,
            password: Password,
            confirmedPassword: ConfirmPassword
        });
    };    

    return (
        <>
            <Helmet><title>Reset Password | FXBLOOMS.com</title></Helmet>
            {!isEmpty(errors) && 
                <Toast 
                    ref={toast}
                    title="ERROR"
                    duration={5000}
                    msg={errors.msg || ''}
                    type="error"
                />
            }
            <SuccessModal ref={successModal} dismissAction={redirectToLogin} />
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
                        Set your new Password
                    </Typography>
                    <form onSubmit={handleFormSubmit} className={classes.form} noValidate>
                        <Grid container direction="column">
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" component="span">Password</Typography>
                                <TextField 
                                    className={classes.input}
                                    value={Password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type={showPassword ? 'text' : 'password'}
                                    variant="outlined" 
                                    placeholder="Enter New Password"
                                    helperText={errors.Password}
                                    fullWidth
                                    required
                                    error={errors.Password ? true : false}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={toggleShowPassword}
                                                >
                                                    {showPassword ? 
                                                        <Tooltip title="Hide Password" placement="bottom" arrow>
                                                            <EyeOffOutline />
                                                        </Tooltip>
                                                            : 
                                                        <Tooltip title="Show Password" placement="bottom" arrow>
                                                            <EyeOutline />
                                                        </Tooltip>
                                                     }
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                {showStrengthBadge && 
                                    <div className={classes.passwordStrength}>
                                        {!isUppercase && <Typography variant="subtitle1" component="small">Your password should containt at least one uppercase letter</Typography>}
                                        {!isLowercase && <Typography variant="subtitle1" component="small">Your password should containt at least one lowercase letter</Typography>}
                                        {!isOneDigit && <Typography variant="subtitle1" component="small">Your password should containt at least one digit</Typography>}
                                        {!isOneSpecialCharacter && <Typography variant="subtitle1" component="small">Your password should contain at least one special character</Typography>}
                                        {!isEightCharacters && <Typography variant="subtitle1" component="small">Your password be at least 8 characters long</Typography>}
                                    </div>
                                }
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" component="span">Confirm Password</Typography>
                                <TextField 
                                    className={classes.input}
                                    value={ConfirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    variant="outlined" 
                                    placeholder="Please Confirm Your Password"
                                    helperText={errors.ConfirmPassword}
                                    fullWidth
                                    required
                                    error={errors.ConfirmPassword ? true : false}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={toggleShowConfirmPassword}
                                                >
                                                    {showConfirmPassword ? 
                                                        <Tooltip title="Hide Password" placement="bottom" arrow>
                                                            <EyeOffOutline />
                                                        </Tooltip>
                                                            : 
                                                        <Tooltip title="Show Password" placement="bottom" arrow>
                                                            <EyeOutline />
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
                                    Set New Password
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

ResetPassword.propTypes = {
    resetPassword: PropTypes.func.isRequired
};

export default connect(undefined, { resetPassword })(ResetPassword);