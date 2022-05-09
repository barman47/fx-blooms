import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    Backdrop,
    Box,
	Button,
    Fade,
	Grid,
    IconButton,
    Modal,
    TextField,
	Typography,
    useMediaQuery
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Close } from 'mdi-material-ui';

import { GET_ERRORS } from '../../../actions/types';
import { COLORS, SHADOW } from '../../../utils/constants';
import moveToNextField from '../../../utils/moveToNextField';
import handleSetValue from '../../../utils/handleSetValue';
import isEmpty from '../../../utils/isEmpty';

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    root: {
        backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius,
        width: '35vw',
        height: '25vw',
        boxShadow: SHADOW,
        padding: theme.spacing(1, 2),

        [theme.breakpoints.down('md')]: {
            height: '50vw',
            width: '50vw',
        },
        
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(5, 2),
            height: '40vh',
            width: '90vw'
        },

        '& header': {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        }
    },

    label: {
        color: COLORS.offBlack,
        fontWeight: 300,
        margin: theme.spacing(2, 0)
    },

    item: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        textAlign: 'center'
    }
}));

const PinOtpModal = forwardRef((props, ref) => {
	const classes = useStyles();
    const dispatch = useDispatch();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    const errorsState = useSelector(state => state.errors);

    const [first, setFirst] = useState('');
    const [second, setSecond] = useState('');
    const [third, setThird] = useState('');
    const [fourth, setFourth] = useState('');
    const [errors, setErrors] = useState({});
    // eslint-disable-next-line
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resendable, setResendable] = useState(false);
    const [timeToResend, setTimeToResend] = useState(60);

    const firstField = useRef();
    const secondField = useRef();
    const thirdField = useRef();
    const fourthField = useRef();
    const toast = useRef();
    const resendTimer = useRef();

    useEffect(() => {
        startResendTimer();

        return () => {
            clearInterval(resendTimer.current);
            resendTimer.current = undefined;
        };
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        setOpen(open);
        if (!open) {
            // When modal closes, reset all fields
            setTimeToResend(60);
            setResendable(false);
            setErrors({});
        }
    }, [open]);

    useEffect(() => {
        if (!isEmpty(errors)) {
            toast.current.handleClick();
        }
    }, [errors]);

    useEffect(() => {
        if (timeToResend === 0) {
            setResendable(true);
            clearInterval(resendTimer.current);
            resendTimer.current = undefined;
        }
    }, [timeToResend]);

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

    const startResendTimer = () => {
        if (!resendTimer.current) {
            resendTimer.current = setInterval(() => {
                setTimeToResend(timeToResend => timeToResend - 1);
            },1000);
        }
    };

    useImperativeHandle(ref, () => ({
        openModal: () => {
            setOpen(true);
        },

        closeModal: () => {
            setOpen(false);
        }
    }));

    const handleFormSubmit = (e) => {
        e.preventDefault();
    };

	return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={true}
            disableEscapeKeyDown
            onClose={() => setOpen(false)}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={true}>
                <Box component="section" className={classes.root}>
                    <Box component="header">
                        <Typography variant="h5" color="primary">Reset Security PIN</Typography>
                        <IconButton onClick={() => setOpen(false)} disabled={!resendable}>
                            <Close />
                        </IconButton>
                    </Box>
                    <Typography variant="body2" component="p" className={classes.label}>Enter the OTP you received</Typography>
                    <form onSubmit={handleFormSubmit} noValidate>
                        <Grid className={classes.inputs} container direction="row" justifyContent="center" alignItems="center" spacing={matches ? 2 : 3}>
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
                                    onChange={(e) => {
                                        handleSetValue(e.target.value, setSecond);
                                    }}
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
                                    onChange={(e) => {
                                        handleSetValue(e.target.value, setThird);
                                    }}
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
                                    onChange={(e) => {
                                        handleSetValue(e.target.value, setFourth);
                                    }}
                                    onKeyUp={(e) => moveToNextField(e.target, null, thirdField.current)}
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
                            <Grid item xs={12}>
                                <Button 
                                    type="submit"
                                    variant="contained" 
                                    color="primary"
                                    disabled={loading}
                                    fullWidth
                                >
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                    <Typography variant="body2" component="p" className={classes.label}>
                        Didn't receive the code? 
                        <Button variant="text" color="primary">Resend</Button>
                        {!resendable && `in ${timeToResend}s`}
                    </Typography>
                </Box>
            </Fade>
        </Modal>
	);
});

export default PinOtpModal;