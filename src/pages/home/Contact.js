import { useEffect, useRef, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, CircularProgress, Grid, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Validator from 'validator';

import { sendMail, subscribeToNewsletter } from '../../actions/customer';
import { GET_ERRORS, SET_CUSTOMER_MSG } from '../../actions/types';
import { COLORS } from '../../utils/constants';
import validateSendEmail from '../../utils/validation/customer/sendMail';
import isEmpty from '../../utils/isEmpty';
import { CONTACT_US } from '../../routes';

import SuccessModal from '../../components/common/SuccessModal';
import Toast from '../../components/common/Toast';

const useStyles = makeStyles(theme => ({
    root: {
        color: COLORS.offBlack,
        padding: theme.spacing(15),

        [theme.breakpoints.down('md')]: {
            padding: theme.spacing(10),
        },

        '& h4': {
            fontWeight: 700,
            marginBottom: theme.spacing(3),

            [theme.breakpoints.down('sm')]: {
                textAlign: 'center'
            }
        },

        '& h6': {
            [theme.breakpoints.down('sm')]: {
                textAlign: 'center'
            }
        },

        [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2)
        }
    },

    subscribeContainer: {
        backgroundColor: COLORS.lightTeal,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: theme.spacing(13),

        [theme.breakpoints.down('md')]: {
            marginBottom: theme.spacing(10)
        },

        [theme.breakpoints.down('sm')]: {
            marginTop: theme.spacing(-5),
            marginBottom: theme.spacing(5)
        },
    },

    formHeader: {
        marginTop: theme.spacing(-6)
    },

    input: {
        backgroundColor: 'transparent',

        '.MuiInputBase-root MuiOutlinedInput-root MuiInputBase-fullWidth MuiInputBase-formControl MuiInputBase-multiline MuiOutlinedInput-multiline': {
            border: 'none !important',
            outline: 'none !important',
        },

        '&:focus': {
            backgroundColor: 'transparent'
        }
    },

    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    }
}));

const Contact = ({ sendMail, subscribeToNewsletter }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const { msg } = useSelector(state => state.customer);
    const errorsState = useSelector(state => state.errors);

    const [NewsLetterEmail, setNewsLetterEmail] = useState('');

    const [FullName, setFullName] = useState('');
    const [EmailAddress, setEmailAddress] = useState('');
    const [PhoneNumber, setPhoneNumber] = useState('');
    const [Subject, setSubject] = useState('');
    const [Message, setMessage] = useState('');

    const [loading, setLoading] = useState(false);
    const [newsLetterLoading, setNewsLetterLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const successModal = useRef();
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

    useEffect(() => {
        if (msg) {
            resetForm();
            successModal.current.openModal();
            successModal.current.setModalText(msg);
        }
    }, [dispatch, msg]);

    const resetForm = () => {
        setLoading(false);
        setNewsLetterLoading(false);
        setNewsLetterEmail('');
        setFullName('');
        setEmailAddress('');
        setPhoneNumber('');
        setSubject('');
        setMessage('');
    };

    const dismissSuccessModal = () => {
        dispatch({
            type: SET_CUSTOMER_MSG,
            payload: null 
        });
    };

    const handleSendContactMessage = (e) => {
        e.preventDefault();
        setErrors({});
        const data = {
            EmailAddress,
            FullName,
            PhoneNumber,
            Subject,
            Message
        };
        
        const { errors, isValid } = validateSendEmail(data);

        if (!isValid) {
            return setErrors(errors);
        }

        setLoading(true);
        setErrors({});
        sendMail(data);
    };

    const handleSubscribe = (e) => {
        e.preventDefault();
        setErrors({});
        
        if (!Validator.isEmail(NewsLetterEmail)) {
            return setErrors({ NewsLetterEmail: 'Please enter a valid email' });
        }

        setNewsLetterLoading(true);
        setErrors({});
        subscribeToNewsletter(NewsLetterEmail);
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
            <SuccessModal ref={successModal} dismissAction={dismissSuccessModal} />
            <section className={classes.root} id={CONTACT_US}>
                <Grid container direction="row" spacing={10}>
                    <Grid item xs={12} lg={6} className={classes.subscribeContainer}>
                        <form onSubmit={handleSubscribe} noValidate>
                            <Typography variant="h4">Stay in the loop</Typography>
                            <Typography variant="h6">Subscribe to our newsletter</Typography>
                            <br />
                            <Grid container direction="column" spacing={4}>
                                <Grid item xs={12}>
                                    <TextField 
                                        classes={{ root: classes.input }}
                                        value={NewsLetterEmail}
                                        onChange={(e) => setNewsLetterEmail(e.target.value)}
                                        type="text"
                                        variant="outlined" 
                                        placeholder="Enter Your Email Address"
                                        helperText={errors.NewsLetterEmail}
                                        fullWidth
                                        required
                                        error={errors.NewsLetterEmail ? true : false}
                                        disabled={newsLetterLoading ? true : false}
                                    />
                                </Grid>
                                <Grid item xs={12} className={classes.buttonContainer}>
                                    <Button 
                                        variant="contained" 
                                        color="primary"
                                        type="submit"
                                        disabled={newsLetterLoading ? true : false}
                                        fullWidth
                                    >
                                        {!newsLetterLoading ? 'Subscribe' : <CircularProgress style={{ color: '#f8f8f8' }} />}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <Typography variant="h4" className={classes.formHeader}>Contact us!</Typography>
                        <Typography variant="h6">Give us a call or drop by any time.</Typography>
                        <br />
                        <form onSubmit={handleSendContactMessage} noValidate>
                            <Grid container direction="row" spacing={4}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" component="span">Your Name</Typography>
                                    <TextField 
                                        classes={{ root: classes.input }}
                                        value={FullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        type="text"
                                        variant="outlined" 
                                        placeholder="Enter Your Name"
                                        helperText={errors.FullName}
                                        fullWidth
                                        required
                                        error={errors.FullName ? true : false}
                                        disabled={loading ? true : false}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" component="span">Your Email</Typography>
                                    <TextField 
                                        classes={{ root: classes.input }}
                                        value={EmailAddress}
                                        onChange={(e) => setEmailAddress(e.target.value)}
                                        type="text"
                                        variant="outlined" 
                                        placeholder="Enter Your Email Address"
                                        helperText={errors.EmailAddress}
                                        fullWidth
                                        required
                                        error={errors.EmailAddress ? true : false}
                                        disabled={loading ? true : false}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" component="span">Your Subject</Typography>
                                    <TextField 
                                        classes={{ root: classes.input }}
                                        value={Subject}
                                        onChange={(e) => setSubject(e.target.value.toUpperCase())}
                                        type="text"
                                        variant="outlined" 
                                        placeholder="Enter Your Subject"
                                        helperText={errors.Subject}
                                        fullWidth
                                        required
                                        error={errors.Subject ? true : false}
                                        disabled={loading ? true : false}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" component="span">Your Message</Typography>
                                    <TextField 
                                        classes={{ root: classes.input }}
                                        value={Message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        type="text"
                                        variant="outlined" 
                                        placeholder="Enter Your Message"
                                        helperText={errors.Message}
                                        minRows={2}
                                        rowsMax={10}
                                        fullWidth
                                        required
                                        multiline
                                        error={errors.Message ? true : false}
                                        disabled={loading ? true : false}
                                    />
                                </Grid>
                                <Grid item xs={12} className={classes.buttonContainer}>
                                    <Button 
                                        variant="contained" 
                                        color="primary"
                                        type="submit"
                                        disabled={loading ? true : false}
                                        fullWidth
                                    >
                                        {!loading ? 'Send Message' : <CircularProgress style={{ color: '#f8f8f8' }} />}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            </section>
        </>
    );
};

Contact.propTypes = {
    sendMail: PropTypes.func.isRequired,
    subscribeToNewsletter: PropTypes.func.isRequired
};

export default connect(undefined, { sendMail, subscribeToNewsletter })(Contact);