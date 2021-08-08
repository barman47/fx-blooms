import { useEffect, useRef, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, CircularProgress, Grid, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Instagram, Linkedin, Twitter, Telegram } from 'mdi-material-ui';

import { sendMail } from '../../actions/customer';
import { SET_CUSTOMER_MSG } from '../../actions/types';
import { COLORS } from '../../utils/constants';
import validateSendEmail from '../../utils/validation/customer/sendMail';
import { CONTACT_US } from '../../routes';

import SuccessModal from '../../components/common/SuccessModal';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: COLORS.lightTeal,
        color: COLORS.offBlack,
        marginTop: theme.spacing(8),
        padding: [[theme.spacing(5), theme.spacing(10)]],

        '& h3': {
            fontWeight: 800,
            fontStyle: 'italic',
            marginBottom: theme.spacing(3)
        },

        [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2)
        }
    },

    title: {
        color: theme.palette.primary.main,
        fontWeight: 600,

        [theme.breakpoints.down('sm')]: {
            textAlign: 'center'
        },
    },

    social: {
        backgroundColor: COLORS.white,
        borderRadius: '25px',
        display: 'inline-block',
        marginTop: theme.spacing(5),
        padding: [[theme.spacing(1), theme.spacing(2)]],
        width: 'initial', 

        [theme.breakpoints.down('md')]: {
            margin: [[theme.spacing(1), 0]]
        },

        [theme.breakpoints.down('sm')]: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: theme.spacing(4),
            width: '90%'
        },

        '& a': {
            marginRight: theme.spacing(4),

            '&:last-child': {
                marginRight: 0
            }
        }
    },

    icon: {
        color: theme.palette.primary.main
    },

    input: {
        backgroundColor: 'transparent',
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

const Contact = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const { msg } = useSelector(state => state.customer);

    const [FullName, setFullName] = useState('');
    const [EmailAddress, setEmailAddress] = useState('');
    const [PhoneNumber, setPhoneNumber] = useState('');
    const [Subject, setSubject] = useState('');
    const [Message, setMessage] = useState('');

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const { sendMail } = props;

    const successModal = useRef();

    useEffect(() => {
        if (msg) {
            resetForm();
            successModal.current.openModal();
            successModal.current.setModalText(msg);
        }
    }, [dispatch, msg]);

    const resetForm = () => {
        setLoading(false);
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

    const handleFormSubmit = (e) => {
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

    return (
        <>
            <SuccessModal ref={successModal} dismissAction={dismissSuccessModal} />
            <section className={classes.root} id={CONTACT_US}>
                <Grid container direction="row">
                    <Grid item xs={12} md={12} lg={4}>
                        <Typography variant="subtitle1" component="p" className={classes.title}>Connect with us on social media</Typography>
                        <br />
                        <div className={classes.social}>
                            <a href="https://www.instagram/fxblooms" target="_blank" rel="noreferrer">
                                <Instagram className={classes.icon} />
                            </a>
                        
                            <a href="https://www.linkedin.com/company/fxblooms/" target="_blank" rel="noreferrer">
                                <Linkedin className={classes.icon} />
                            </a>
                            <a href="https://google.com" target="_blank" rel="noreferrer">
                                <Twitter className={classes.icon} />
                            </a>
                            <a href="https://google.com" target="_blank" rel="noreferrer">
                                <Telegram className={classes.icon} />
                            </a>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={12} lg={6}>
                        <Typography variant="subtitle1" component="p" className={classes.title}>Send us a mail</Typography>
                        <br />
                        <form onSubmit={handleFormSubmit} noValidate>
                            <Grid container direction="row" spacing={4}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" component="span">Full name</Typography>
                                    <TextField 
                                        className={classes.input}
                                        value={FullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        type="text"
                                        variant="outlined" 
                                        placeholder="Enter full name"
                                        helperText={errors.FullName}
                                        fullWidth
                                        required
                                        error={errors.FullName ? true : false}
                                        disabled={loading ? true : false}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" component="span">Phone number</Typography>
                                    <TextField 
                                        className={classes.input}
                                        value={PhoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        type="text"
                                        variant="outlined" 
                                        placeholder="Enter phone number"
                                        helperText={errors.PhoneNumber}
                                        fullWidth
                                        required
                                        error={errors.PhoneNumber ? true : false}
                                        disabled={loading ? true : false}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" component="span">Email address</Typography>
                                    <TextField 
                                        className={classes.input}
                                        value={EmailAddress}
                                        onChange={(e) => setEmailAddress(e.target.value)}
                                        type="text"
                                        variant="outlined" 
                                        placeholder="Enter email address"
                                        helperText={errors.EmailAddress}
                                        fullWidth
                                        required
                                        error={errors.EmailAddress ? true : false}
                                        disabled={loading ? true : false}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" component="span">Subject</Typography>
                                    <TextField 
                                        className={classes.input}
                                        value={Subject}
                                        onChange={(e) => setSubject(e.target.value.toUpperCase())}
                                        type="text"
                                        variant="outlined" 
                                        placeholder="Enter subject"
                                        helperText={errors.Subject}
                                        fullWidth
                                        required
                                        error={errors.Subject ? true : false}
                                        disabled={loading ? true : false}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" component="span">Message</Typography>
                                    <TextField 
                                        className={classes.input}
                                        value={Message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        type="text"
                                        variant="outlined" 
                                        placeholder="Enter message"
                                        helperText={errors.Message}
                                        rows={1}
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
    sendMail: PropTypes.func.isRequired
};

export default connect(undefined, { sendMail })(Contact);