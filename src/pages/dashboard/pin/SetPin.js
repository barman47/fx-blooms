import { useCallback, useEffect, useRef, useState } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Box, Button, Grid, TextField, Typography, makeStyles, useMediaQuery, useTheme } from '@mui/material';

import { generatePinOtp } from '../../../actions/notifications';
import { createPin, resetPin } from '../../../actions/pin';

import isEmpty from '../../../utils/isEmpty';
import validateSetPin from '../../../utils/validation/pin/setPin';
import { COLORS } from '../../../utils/constants';
import moveToNextField from '../../../utils/moveToNextField';
import handleSetValue from '../../../utils/handleSetValue';
import { DASHBOARD_HOME } from '../../../routes';

import Spinner from '../../../components/common/Spinner';
import SuccessModal from '../../../components/common/SuccessModal';
import Toast from '../../../components/common/Toast';
import { GET_ERRORS, SET_CUSTOMER_MSG } from '../../../actions/types';

const useStyles = makeStyles(theme => ({
    // root: {
    //     height: '100vh',
    //     paddingLeft: theme.spacing(35),
    //     paddingRight: theme.spacing(35)
    // },

    title: {
        [theme.breakpoints.down('sm')]: {
            textAlign: 'center'
        }
    },

    label: {
        color: COLORS.offBlack,
        fontWeight: 300,

        [theme.breakpoints.down('sm')]: {
            textAlign: 'center'
        }
    },

    inputs: {
        marginTop: theme.spacing(2)
    },

    input: {
        '& .MuiOutlinedInput-input': {
            textAlign: 'center'
        }
    },

    button: {
        width: '50%'
    }
}));

const SetPin = ({ createPin, resetPin, generatePinOtp }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    const errorsState = useSelector(state => state.errors);
    const { customerId, hasSetPin, msg } = useSelector(state => state.customer);

    const [showSetPin, setShowSetPin] = useState(false);

    const [first, setFirst] = useState('');
    const [second, setSecond] = useState('');
    const [third, setThird] = useState('');
    const [fourth, setFourth] = useState('');

    const [fifth, setFifth] = useState('');
    const [sixth, setSixth] = useState('');
    const [seventh, setSeventh] = useState('');
    const [eighth, setEighth] = useState('');
    
    const [loading, setLoading] = useState(false);

    const firstField = useRef();
    const secondField = useRef();
    const thirdField = useRef();
    const fourthField = useRef();

    const fifthField = useRef();
    const sixthField = useRef();
    const seventhField = useRef();
    const eighthField = useRef();

    const [resendable, setResendable] = useState(false);
    const [timeToResend, setTimeToResend] = useState(60);

    const [errors, setErrors] = useState({});

    const resendTimer = useRef();
    const successModal = useRef();
    const toast = useRef();

    useEffect(() => {
        return () => {
            clearInterval(resendTimer.current);
            resendTimer.current = undefined;
        };
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

    // Show error toast and error messages when there is a message
    useEffect(() => {
        if (!isEmpty(errors)) {
            toast.current.handleClick();
        }
    }, [errors]);

    useEffect(() => {
        if (msg) {
            successModal.current.openModal();
            successModal.current.setModalText(msg);
            setLoading(false);
        }
    }, [msg]);

    const handleFormSubmit = useCallback((e) => {
        if (e) {
            e.preventDefault();
        }
        setErrors({});
        const data = {
            first,
            second,
            third,
            fourth,
            fifth,
            sixth,
            seventh,
            eighth
        };

        const { errors, isValid } = validateSetPin(data, hasSetPin);

        if (!isValid) {
            return setErrors({ msg: 'Invalid data', ...errors});
        }
        setLoading(true);
        if (hasSetPin) {
            return resetPin({
                pin: data.first + data.second + data.third + data.fourth,
                otp: data.fifth + data.sixth + data.seventh + data.eighth,
                customerId
            });
        }
        return createPin({
            pin: data.first + data.second + data.third + data.fourth,
            customerId
        });
    }, [createPin, resetPin, hasSetPin, customerId, first, second, third, fourth, fifth, sixth, seventh, eighth]);

    // Automatically submit form when all fields are filled forn PIN Creation
    useEffect(() => {
        if (first && second && third && fourth && !hasSetPin) {
            handleFormSubmit();
        }
    }, [first, second, third, fourth, hasSetPin, handleFormSubmit]);

    // Automatically submit form when all fields are filled for PIN reset
    useEffect(() => {
        if (first && second && third && fourth && fifth && sixth && seventh && eighth && hasSetPin) {
            handleFormSubmit();
        }
    }, [first, second, third, fourth, fifth, sixth, seventh, eighth, hasSetPin, handleFormSubmit]);

    useEffect(() => {
        if (timeToResend === 0) {
            setResendable(true);
            clearInterval(resendTimer.current);
            resendTimer.current = undefined;
        }
    }, [timeToResend]);

    const startResendTimer = () => {
        if (!resendTimer.current) {
            resendTimer.current = setInterval(() => {
                setTimeToResend(timeToResend => timeToResend - 1);
            },1000);
        }
    };

    const setupPin = () => {
        setShowSetPin(true);
        if (hasSetPin) {
            generatePinOtp();
        }
    };

    const handleResendOtp = () => {
        setResendable(false);
        setTimeToResend(60);
        generatePinOtp();
    };

    const resetForm = () => {
        setFirst('');
        setSecond('');
        setThird('');
        setFourth('');

        setFifth('');
        setSixth('');
        setSeventh('');
        setEighth('');

        setResendable(false);
        setTimeToResend(0);
    };

    const dismissAction = () => {
        resetForm();
        dispatch({
            type: SET_CUSTOMER_MSG,
            payload: null
        });

        if (!resendable) {
            startResendTimer();
        }

        if (sessionStorage.getItem('pin')) {
            sessionStorage.removeItem('pin');
            navigate(DASHBOARD_HOME);
        }
    };
    
    return (
        <>
            {!isEmpty(errors) && 
                <Toast 
                    ref={toast}
                    title="ERROR"
                    duration={5000}
                    msg={errors.msg || ''}
                    type="error"
                />
            }
            <SuccessModal ref={successModal} dismissAction={dismissAction} />
            {loading && <Spinner />}
            <Box component="section" className={classes.root}>
                {!showSetPin && 
                    <>
                        <Typography variant="h6" color="primary" className={classes.title}>
                            {hasSetPin ? 'Reset your PIN' : 'PIN not Set-up'}
                        </Typography>
                        <Button 
                            color="primary"
                            variant="contained"
                            disableRipple
                            disableFocusRipple
                            disableTouchRipple
                            onClick={setupPin}
                        >
                            {hasSetPin ? 'Reset PIN' : 'Setup PIN'}
                        </Button>
                    </>
                }
                {showSetPin && 
                    <>
                        <Typography variant="h6" color="primary" className={classes.title}>Set-up a 4-Digit Security PIN</Typography>
                        <Typography variant="body2" component="p" className={classes.label}>Enter a new 4 digit PIN to reset your PIN</Typography>
                        <form onSubmit={handleFormSubmit} noValidate>
                            <Grid className={classes.inputs} container direction="row" justifyContent="center" alignItems="center" spacing={matches ? 2 : 3}>
                                <Grid item xs={12}>
                                    <Typography variant="body2" component="p">Enter PIN</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        className={classes.input}
                                        value={first}
                                        onChange={(e) => {
                                            handleSetValue(e.target.value, setFirst);
                                        }}
                                        onKeyUp={(e) => moveToNextField(e.target, secondField.current, null)}
                                        type="text"
                                        variant="outlined" 
                                        inputProps={{
                                            maxLength: 1
                                        }}
                                        required
                                        error={!isEmpty(errors) ? true : false}
                                        ref={firstField}
                                        disabled={loading}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        className={classes.input}
                                        value={second}
                                        onChange={(e) => setSecond(e.target.value)}
                                        onKeyUp={(e) => moveToNextField(e.target, thirdField.current, firstField.current)}
                                        type="text"
                                        variant="outlined" 
                                        inputProps={{
                                            maxLength: 1
                                        }}
                                        max={1}
                                        required
                                        error={!isEmpty(errors) ? true : false}
                                        ref={secondField}
                                        disabled={loading}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        className={classes.input}
                                        value={third}
                                        onChange={(e) => setThird(e.target.value)}
                                        onKeyUp={(e) => moveToNextField(e.target, fourthField.current, secondField.current)}
                                        type="text"
                                        variant="outlined" 
                                        inputProps={{
                                            maxLength: 1
                                        }}
                                        max={1}
                                        required
                                        error={!isEmpty(errors) ? true : false}
                                        ref={thirdField}
                                        disabled={loading}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        className={classes.input}
                                        value={fourth}
                                        onChange={(e) => setFourth(e.target.value)}
                                        onKeyUp={(e) => moveToNextField(e.target, fifthField.current, thirdField.current)}
                                        type="text"
                                        variant="outlined" 
                                        inputProps={{
                                            maxLength: 1
                                        }}
                                        max={1}
                                        required
                                        error={!isEmpty(errors) ? true : false}
                                        ref={fourthField}
                                        disabled={loading}
                                    />
                                </Grid>
                                {hasSetPin &&
                                    <>
                                        <Grid item xs={12}>
                                            <Typography variant="body2" component="p">Enter OTP</Typography>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <TextField
                                                className={classes.input}
                                                value={fifth}
                                                onChange={(e) => {
                                                    handleSetValue(e.target.value, setFifth);
                                                }}
                                                onKeyUp={(e) => moveToNextField(e.target, sixthField.current, fourthField.current)}
                                                type="text"
                                                variant="outlined" 
                                                inputProps={{
                                                    maxLength: 1
                                                }}
                                                required
                                                error={!isEmpty(errors) ? true : false}
                                                ref={sixthField}
                                                disabled={loading}
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <TextField
                                                className={classes.input}
                                                value={sixth}
                                                onChange={(e) => {
                                                    handleSetValue(e.target.value, setSixth);
                                                }}
                                                onKeyUp={(e) => moveToNextField(e.target, seventhField.current, sixthField.current)}
                                                type="text"
                                                variant="outlined" 
                                                inputProps={{
                                                    maxLength: 1
                                                }}
                                                max={1}
                                                required
                                                error={!isEmpty(errors) ? true : false}
                                                ref={sixthField}
                                                disabled={loading}
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <TextField
                                                className={classes.input}
                                                value={seventh}
                                                onChange={(e) => {
                                                    handleSetValue(e.target.value, setSeventh);
                                                }}
                                                onKeyUp={(e) => moveToNextField(e.target, eighth.current, sixthField.current)}
                                                type="text"
                                                variant="outlined" 
                                                inputProps={{
                                                    maxLength: 1
                                                }}
                                                max={1}
                                                required
                                                error={!isEmpty(errors) ? true : false}
                                                ref={seventhField}
                                                disabled={loading}
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <TextField
                                                className={classes.input}
                                                value={eighth}
                                                onChange={(e) => {
                                                    handleSetValue(e.target.value, setEighth);
                                                }}
                                                onKeyUp={(e) => moveToNextField(e.target, null, seventhField.current)}
                                                type="text"
                                                variant="outlined" 
                                                inputProps={{
                                                    maxLength: 1
                                                }}
                                                max={1}
                                                required
                                                error={!isEmpty(errors) ? true : false}
                                                ref={eighthField}
                                                disabled={loading}
                                            />
                                        </Grid>
                                        <Typography variant="body2" component="p" className={classes.label}>
                                            Didn't receive the code? 
                                            <Button variant="text" color="primary" disabled={resendable ? false : true} onClick={handleResendOtp}>Resend</Button>
                                            {!resendable && `in ${timeToResend}s`}
                                        </Typography>
                                    </>
                                }
                                <Grid item xs={12}>
                                    <Button 
                                        type="submit"
                                        variant="contained" 
                                        color="primary"
                                        disabled={loading}
                                        fullWidth
                                    >
                                        Save
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </>
                }
            </Box>
        </>
    );
};

SetPin.propTypes = {
    createPin: PropTypes.func.isRequired,
    resetPin: PropTypes.func.isRequired,
    generatePinOtp: PropTypes.func.isRequired
};

export default connect(undefined, { createPin, resetPin, generatePinOtp })(SetPin);