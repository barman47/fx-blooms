import { useState, useEffect, useRef } from 'react';
import { connect, useDispatch,useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { 
    Backdrop,
	Button,
    CircularProgress,
    Fade,
	Grid,
    IconButton,
    Modal,
    TextField,
	Typography,
    useMediaQuery 
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { ChevronLeft } from 'mdi-material-ui';

import { generateOtp, validatePhoneNumber } from '../../../actions/notifications';
import { GET_ERRORS } from '../../../actions/types';

import { COLORS, SHADOW } from '../../../utils/constants';
import isEmpty from '../../../utils/isEmpty';
import validateSmsOtp from '../../../utils/validation/customer/smsOtp';

import Toast from '../../../components/common/Toast';

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    container: {
        backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius,
        width: '35vw',
        height: '25vw',
        boxShadow: SHADOW,
        padding: theme.spacing(2, 5),

        [theme.breakpoints.down('lg')]: {
            width: '45vw',
            height: '35vw'
        },

        [theme.breakpoints.down('md')]: {
            height: '40vh',
            width: '70vw',
        },
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(5, 2),
            height: '40vh',
            width: '90vw',
        },
    },

    item: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        textAlign: 'center',

        '& h5': {
            [theme.breakpoints.down('sm')]: {
                fontSize: theme.spacing(2.5),
            }
        },
        
        '& span': {
            [theme.breakpoints.down('sm')]: {
                fontSize: theme.spacing(1.2),
            }
        }
    },

    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '70%',

        [theme.breakpoints.down('sm')]: {
            width: '100%'
        }
    },

    iconButton: {
        backgroundColor: COLORS.lightGrey,

        '&:hover': {
            backgroundColor: COLORS.darkGrey
        }
    },

    button: {
        borderRadius: '30px',
        paddingLeft: theme.spacing(7),
        paddingRight: theme.spacing(7)
    }
}));

const VerifyPhoneNumberModal = ({ dismissAction, generateOtp, isOpen, validatePhoneNumber, phoneNumber }) => {
	const classes = useStyles();
    const dispatch = useDispatch();

    const errorsState = useSelector(state => state.errors);

    const [open, setOpen] = useState(false);

    const [first, setFirst] = useState('');
    const [second, setSecond] = useState('');
    const [third, setThird] = useState('');
    const [fourth, setFourth] = useState('');
    const [fifth, setFifth] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    
    const firstField = useRef();
    const secondField = useRef();
    const thirdField = useRef();
    const fourthField = useRef();
    const fifthField = useRef();
    
    const toast = useRef();

    useEffect(() => {
        setOpen(isOpen);
    }, [isOpen]);

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

    const closeModal = () => {
        setOpen(false);
        if (dismissAction) {
            dismissAction();
        }
    };

    // const moveToNextField = (current, nextField, previousField) => {
    //     if (nextField === null && current.value) {
    //         return onSubmit();
    //     }

    //     if (previousField && current.value.length === 0) {
    //         return previousField.getElementsByTagName('input')[0].focus();
    //     }

    //     const input = nextField.getElementsByTagName('input')[0];

    //     if (current.value.length >= current.maxLength) {
    //         return input.focus();
    //     }
    // };

    const onSubmit = (e) => {
        if (e) {
            e.preventDefault();
        }

        setErrors({});
        
        const { isValid } = validateSmsOtp({
            first,
            second,
            third,
            fourth,
            fifth
        });

        if (!isValid) {
            return setErrors({ msg: 'Invalid Code' });
        }
        
        const code = `${first}${second}${third}${fourth}${fifth}`;
        setErrors({});
        setLoading(true);
        dispatch({
            type: GET_ERRORS,
            payload: {}
        });

        return validatePhoneNumber({ otp: code, phoneNumber });
    };

    const handleResendOtp = () => generateOtp(phoneNumber);

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
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                disableBackdropClick
                disableEscapeKeyDown
                onClose={() => setOpen(false)}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Grid container className={classes.container}>
                        <Grid item xs={12} className={classes.item}>
                            <Typography variant="h5" color="primary">Verify your phone number</Typography>
                            <Typography variant="subtitle2" component="span">Enter the six-digit code we sent to your phone number</Typography>
                            <form onSubmit={onSubmit} noValidate>
                                <Grid container direction="row" justify="center" spacing={matches ? 2 : 3}>
                                    <Grid item xs={2}>
                                        <TextField
                                            className={classes.input}
                                            value={first}
                                            onChange={(e) => setFirst(e.target.value)}
                                            // onKeyUp={(e) => moveToNextField(e.target, secondField.current, null)}
                                            type="text"
                                            variant="outlined" 
                                            inputProps={{
                                                maxLength: 1
                                            }}
                                            required
                                            error={!isEmpty(errors) ? true : false}
                                            ref={firstField}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <TextField
                                            className={classes.input}
                                            value={second}
                                            onChange={(e) => setSecond(e.target.value)}
                                            // onKeyUp={(e) => moveToNextField(e.target, thirdField.current, firstField.current)}
                                            type="text"
                                            variant="outlined" 
                                            inputProps={{
                                                maxLength: 1
                                            }}
                                            max={1}
                                            required
                                            error={!isEmpty(errors) ? true : false}
                                            ref={secondField}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <TextField
                                            className={classes.input}
                                            value={third}
                                            onChange={(e) => setThird(e.target.value)}
                                            // onKeyUp={(e) => moveToNextField(e.target, fourthField.current, secondField.current)}
                                            type="text"
                                            variant="outlined" 
                                            inputProps={{
                                                maxLength: 1
                                            }}
                                            max={1}
                                            required
                                            error={!isEmpty(errors) ? true : false}
                                            ref={thirdField}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <TextField
                                            className={classes.input}
                                            value={fourth}
                                            onChange={(e) => setFourth(e.target.value)}
                                            // onKeyUp={(e) => moveToNextField(e.target, fifthField.current, thirdField.current)}
                                            type="text"
                                            variant="outlined" 
                                            inputProps={{
                                                maxLength: 1
                                            }}
                                            max={1}
                                            required
                                            error={!isEmpty(errors) ? true : false}
                                            ref={fourthField}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <TextField
                                            className={classes.input}
                                            value={fifth}
                                            onChange={(e) => setFifth(e.target.value)}
                                            // onKeyUp={(e) => moveToNextField(e.target, null, fourthField.current)}
                                            type="text"
                                            variant="outlined" 
                                            inputProps={{
                                                maxLength: 1
                                            }}
                                            max={1}
                                            required
                                            error={!isEmpty(errors) ? true : false}
                                            ref={fifthField}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" component="p">Didn't receive the code? <Button variant="text" color="primary" onClick={handleResendOtp}>Resend</Button></Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <div className={classes.buttonContainer}>
                                            <IconButton color="primary" variant="contained" className={classes.iconButton} onClick={closeModal}>
                                                <ChevronLeft />
                                            </IconButton>
                                            
                                            <Button 
                                                variant="contained" 
                                                color="primary" 
                                                type="submit" 
                                                className={classes.button}
                                                disabled={loading ? true : false}
                                            >
                                                {loading ? <span>Verifying. . .&nbsp;&nbsp;&nbsp;<CircularProgress size={20} className={classes.progress} /></span> : 'Verify'}
                                            </Button>
                                        </div>
                                    </Grid>
                                </Grid>
                            </form>
                        </Grid>
                    </Grid>
                </Fade>
            </Modal>
        </>
	);
};

VerifyPhoneNumberModal.propTypes = {
    dismissAction: PropTypes.func,
    generateOtp: PropTypes.func.isRequired,
    validatePhoneNumber: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    phoneNumber: PropTypes.bool.isRequired
};

export default connect( undefined, { generateOtp, validatePhoneNumber } )(VerifyPhoneNumberModal);