import { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { 
    Button, 
    Checkbox,
    Grid, 
    IconButton, 
    InputAdornment, 
    TextField, 
    Tooltip, 
    Typography,
    Zoom 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { EyeOutline, EyeOffOutline } from 'mdi-material-ui';
import PropTypes from 'prop-types';

import Spinner from '../../components/common/Spinner';
import SuccessModal from '../../components/common/SuccessModal';
import Toast from '../../components/common/Toast';

import { registerCustomer } from '../../actions/customer';

import isEmpty from '../../utils/isEmpty';
import { HOME, LOGIN, PENDING_VERIFICATION } from '../../routes';
import { GET_ERRORS, SET_CUSTOMER_MSG } from '../../actions/types';
import  {
    COLORS,
    ONE_UPPERCASE_LETTER,
    ONE_LOWERCASE_LETTER,
    ONE_DIGIT,
    ONE_SPECIAL_CHARACTER,
    EIGHT_CHARACTERS
} from '../../utils/constants';
import validateSignUp from '../../utils/validation/customer/createAccount';

import logo from '../../assets/img/logo.svg';
import img from '../../assets/img/sign-up.svg';

const useStyles = makeStyles(theme => ({
    root: {
        paddingBottom: theme.spacing(10),
    },

    aside: {
        backgroundColor: COLORS.lightTeal,
        height: '100vh',
        padding: [[theme.spacing(4), theme.spacing(8)]],
            
        [theme.breakpoints.down('md')]: {
            height: '70vh'
        },

        [theme.breakpoints.down('sm')]: {
            display: 'none'
        }
    },
    
    logo: {
        display: 'block',
        margin: '10px auto',
        width: '50%'
    },

    text: {
        display: 'block',
        fontWeight: 300,
        margin: '10px auto',
        width: '70%',
    },

    image: {
        margin: [[theme.spacing(4), 0]],
        width: '100%'
    },

    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        height: '100vh',
        paddingTop: theme.spacing(5),
        paddingLeft: theme.spacing(5),

        [theme.breakpoints.down('md')]: {
            height: '100%',
            justifyContent: 'flex-start',
            padding: theme.spacing(3)
        }
    },

    header: {
        [theme.breakpoints.down('md')]: {
            alignSelf: 'center',
            marginBottom: theme.spacing(2),
            textAlign: 'center'
        },

        '& h4': {
            marginTop: theme.spacing(5)
        },

        '& span': {
            marginBottom: theme.spacing(5)
        }
    },

    link: {
        color: theme.palette.primary.main,
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'none'
        }
    },

    usernames: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },

    suggestedUsername: {
        borderRadius: '5px',
        cursor: 'pointer',
        backgroundColor: COLORS.offWhite,
        padding: theme.spacing(1),
        marginLeft: theme.spacing(1),
        marginTop: theme.spacing(1),
    },

    passwordStrength: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        marginTop: theme.spacing(1),

        '& small': {
            color: '#ff0000',
            fontSize: theme.spacing(1.3),
            fontWeight: 300
        }
    },

    average: {
        backgroundColor: 'orange',
        borderRadius: '20px',
        height: '100%',
        position: 'absolute',
        top: 0,
        width: '60%'
    },

    strong: {
        backgroundColor: 'green',
        borderRadius: '20px',
        height: '100%',
        position: 'absolute',
        top: 0,
        width: '90%'
    }
}));

const CreateAccount = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const history = useHistory();

    const { isAuthenticated, msg } = useSelector(state => state.customer);
    const { authorized } = useSelector(state => state.twoFactor);
    const errorsState = useSelector(state => state.errors);

    const [Email, setEmail] = useState('');
    const [Username, setUsername] = useState('');
    const [Password, setPassword] = useState('');
    const [ConfirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [checked, setChecked] = useState(false);
    const [loading, setLoading] = useState(false);

    const [showStrengthBadge, setShowStrengthBadge] = useState(false);
    const [isStrongPassword, setIsStrongPassword] = useState(false);

    const [isUppercase, setIsUppercase] = useState(false);
    const [isLowercase, setIsLowercase] = useState(false);
    const [isOneDigit, setIsOneDigit] = useState(false);
    const [isOneSpecialCharacter, setIsOneSpecialCharacter] = useState(false);
    const [isEightCharacters, setIsEightCharacters] = useState(false);

    const toast = useRef();
    const successModal = useRef();
    const usernameRef = useRef();
    const emailRef = useRef();
    let timeout = useRef();

    useEffect(() => {
        if (isAuthenticated && authorized) {
            return window.location.href = HOME;
        }

        return () => {
            dispatch({
                type: GET_ERRORS,
                payload: {}
            });
        };
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (msg) {
            successModal.current.openModal();
            successModal.current.setModalText(msg);
        }
    }, [dispatch, msg]);

    useEffect(() => {
        if (!isEmpty(errors)) {
            toast.current.handleClick();
        }
    }, [errors]);

    // useEffect(() => {
    //     if (errorsState.usernameAvailable === true) {
    //         history.push(CREATE_PROFILE, { Email: Email.toLowerCase(), Username, Password });
    //     }
    // }, [Email, Password, Username, history, errorsState.usernameAvailable]);

    useEffect(() => {
        if (errorsState?.msg) {
            setErrors(errorsState);
            setLoading(false);
        }
    }, [errorsState]);
    
    useEffect(() => {
        if (errors.usernameAvailable === false) {
            usernameRef.current.focus();
        }
    }, [errors.usernameAvailable]);

    useEffect(() => {
        if (errors.emailAvailable === false) {
            emailRef.current.focus();
        }
    }, [errors.emailAvailable]);

    useEffect(() => {
        if (typeof errors.Username === 'object') {
            const { Username, ...rest } = errors;
            setErrors({
                ...rest,
                Username: Username[0],
                Email: Username[1],

            });
        }
    }, [errors]);

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

    const copyUsername = (username) => {
        setUsername(username);
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const dismissSuccessModal = () => {
        dispatch({
            type: SET_CUSTOMER_MSG,
            payload: null
        });
        return history.push(PENDING_VERIFICATION, { email: Email });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        if (!isStrongPassword) {
            return setErrors({ msg: 'Weak password' });
        }

        const data = {
            Email: Email.toLowerCase(),
            Username,
            Password,
            ConfirmPassword            
        };

        const { errors, isValid } = validateSignUp(data);

        if (!isValid) {
            return setErrors({ ...errors, msg: 'Invalid sign up data' });
        }

        setLoading(true);
        setErrors({});
        dispatch({ type: GET_ERRORS, payload: {} });
        props.registerCustomer({
            EmailAddress: data.Email.trim(),
            Username,
            Password
        }, history);
    };

    return (
        <>
            <Helmet>
                <title>Create Account | FXBLOOMS.com</title>
                <meta name="description" content="FXBLOOMS is fully committed to making currency exchange more accessible, secure and seamless. Create an account to enjoy our superb service." />
            </Helmet>
            <SuccessModal ref={successModal} dismissAction={dismissSuccessModal} />
            {loading && <Spinner text="One moment . . ." />}
            {!isEmpty(errors) && 
                <Toast 
                    ref={toast}
                    title="ERROR"
                    duration={5000}
                    msg={errors.msg || ''}
                    type="error"
                />
            }
            <section className={classes.root}>
                <Grid container direction="row">
                    <Grid item xs={12} md={12} lg={5} className={classes.aside}>
                        <div>
                            <a href="https://wp.fxblooms.com">
                                <img src={logo} className={classes.logo} alt="FX Blooms logo" />
                            </a>
                            <img src={img} className={classes.image} alt="FX Blooms logo" />
                            <Typography variant="subtitle2" component="span" className={classes.text}>Thank you for visiting FXBLOOMS!</Typography>
                            <Typography variant="subtitle2" component="span" className={classes.text}>We are fully committed to making currency exchange more accessible, secure and seamless</Typography>
                            <Typography variant="subtitle2" component="span" className={classes.text}>Create an account today to enjoy our superb service.</Typography>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={12} lg={5} className={classes.formContainer}>
                        <div className={classes.header}>
                            <Typography variant="h4">Create Account</Typography>
                            <Typography variant="subtitle2" component="span">Complete the form below to create an account.</Typography>
                            <br /><br /><br />
                            <Typography variant="subtitle2" component="span" color="primary">1 of 2 (Account details).</Typography>
                            <br />
                        </div>
                        <form onSubmit={handleFormSubmit} noValidate>
                            <Grid container direction="row" spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" component="span">Email Address</Typography>
                                    <TextField 
                                        className={classes.input}
                                        value={Email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        type="text"
                                        variant="outlined" 
                                        placeholder="Enter Email Address"
                                        helperText={errors.Email || errors.EmailAddress}
                                        ref={emailRef}
                                        fullWidth
                                        required
                                        error={errors.Email || errors.EmailAddress ? true : false}
                                        disabled={loading ? true : false}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" component="span">Username</Typography>
                                    <TextField 
                                        className={classes.input}
                                        value={Username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        type="text"
                                        variant="outlined" 
                                        placeholder="Enter Username"
                                        helperText={errors.Username || 'Username cannot be changed once set.'}
                                        ref={usernameRef}
                                        fullWidth
                                        required
                                        error={errors.Username ? true : false}
                                        disabled={loading ? true : false}
                                    />
                                    {errors.usernames &&
                                        <>
                                            <span>Please try one of the following</span>
                                            <div className={classes.usernames}>
                                                {errors.usernames.map((username, index) => (
                                                    <Tooltip 
                                                        key={index} 
                                                        title={`Select ${username}`} 
                                                        TransitionComponent={Zoom} 
                                                        TransitionProps={{ timeout: 300 }} 
                                                        arrow
                                                    >
                                                        <Typography  
                                                            variant="subtitle2" 
                                                            component="span" 
                                                            className={classes.suggestedUsername}
                                                            onClick={() => copyUsername(username)}
                                                            >
                                                                {username}
                                                        </Typography>
                                                    </Tooltip>
                                                ))}
                                            </div>
                                        </>
                                    }
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" component="span">Password</Typography>
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
                                        disabled={loading ? true : false}
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
                                        type={showConfirmPassword ? 'text': 'password'}
                                        variant="outlined" 
                                        placeholder="Confirm Your Password"
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
                                        disabled={loading ? true : false}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                <Checkbox
                                    color="primary"
                                    checked={checked}
                                    onChange={() => setChecked(!checked)}
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                />
                                    <Typography variant="subtitle2" component="span">I agree to terms and conditions <a href="https://wp.fxblooms.com/terms-and-conditions" target="_blank" rel="noreferrer" className={classes.link}>terms and conditions</a></Typography>

                                </Grid>
                                <Grid item xs={12}>
                                    <Button 
                                        variant="contained" 
                                        color="primary"
                                        type="submit"
                                        fullWidth
                                        disabled={checked ? false : true}
                                    >
                                        Proceed
                                    </Button>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" component="p" style={{ fontWeight: 300 }}>
                                        Already have an account? <RouterLink to={LOGIN} className={classes.link}>Sign In</RouterLink>
                                    </Typography>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            </section>
        </>
    );
};

CreateAccount.propTypes = {
    registerCustomer: PropTypes.func.isRequired
};

export default connect(undefined, { registerCustomer })(CreateAccount);