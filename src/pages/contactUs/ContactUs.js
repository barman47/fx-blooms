import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Box, Button, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { EmailOpen, Help, Telegram } from 'mdi-material-ui';
import PropTypes from 'prop-types';

import Layout from '../../components/layout';

import { GET_ERRORS, SET_CUSTOMER_MSG } from '../../actions/types';
import { sendMail } from '../../actions/customer';
import isEmpty from '../../utils/isEmpty';
import { COLORS, TRANSITION } from '../../utils/constants';
import background from '../../assets/img/patterns-black.jpg';
import { FAQS } from '../../routes';
import validateSendEmail from '../../utils/validation/customer/sendMail';

import SuccessModal from '../../components/common/SuccessModal';
import Toast from '../../components/common/Toast';

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(8.1),

        [theme.breakpoints.down('sm')]: {
            marginTop: theme.spacing(7)
        }
    },

    content: {
        backgroundImage: `url(${background})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        position: 'absolute',
        left: 0,
        top: 0,
        height: '85vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',

        [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
            height: '95vh'
        },

        '& h4:first-child': {
            color: COLORS.offWhite,
            fontWeight: 800
        }
    },

    item: {
        backgroundColor: COLORS.offWhite,
        borderRadius: theme.shape.borderRadius,
        height: theme.spacing(20),
        overflow: 'hidden',
        width: theme.spacing(45),

        '& div': {
            backgroundColor: COLORS.offWhite,
            cursor: 'pointer',
            height: '100% !important',
            padding: theme.spacing(3, 5),
            transition: TRANSITION,

            '&:hover': {
                transform: 'translateY(-75px)'
            },

            '& h6': {
                color: COLORS.offBlack
            },

            '& span': {
                color: COLORS.offBlack,
                display: 'block',
                marginTop: theme.spacing(2)
            }
        }
    },

    icon: {
        color: theme.palette.primary.main,
        fontSize: theme.spacing(5.5),
        marginBottom: theme.spacing(2)
    },

    container: {
        backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: theme.spacing(75),
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: [[theme.spacing(10), theme.spacing(10), theme.spacing(10), theme.spacing(10)]],
        position: 'relative',
        top: -100,
        width: '80%',

        '& h4': {
            color: COLORS.offBlack,
            fontWeight: 600
        },

        '& p': {
            color: COLORS.offBlack,
            fontWeight: 300,
            marginTop: theme.spacing(3),

            [theme.breakpoints.down('sm')]: {
                textAlign: 'center'
            }
        },

        [theme.breakpoints.down('md')]: {
            marginTop: theme.spacing(150),
            paddingLeft: theme.spacing(5),
            paddingRight: theme.spacing(5),
            top: -300,
            width: '60%'
        },

        [theme.breakpoints.down('sm')]: {
            height: '100%',
            marginBottom: theme.spacing(55),
            marginTop: theme.spacing(45),
            padding: [[theme.spacing(2), theme.spacing(0.5), theme.spacing(3), theme.spacing(0.5)]],
            top: 370,
            width: '90%'
        },

        '& form': {
            width: '50%',

            [theme.breakpoints.down('md')]: {
                width: '80%'
            },
            [theme.breakpoints.down('sm')]: {
                width: '90%'
            },
        }
    },
}));

const ContactUs = ({ sendMail }) => {
    const classes = useStyles();
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const { msg } = useSelector(state => state.customer);
    const errorsState = useSelector(state => state.errors);

    const [FullName, setFullName] = useState('');
    const [EmailAddress, setEmailAddress] = useState('');
    const [PhoneNumber, setPhoneNumber] = useState('');
    const [Subject, setSubject] = useState('');
    const [Message, setMessage] = useState('');

    const [loading, setLoading] = useState(false);
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

    const handleHelpClick = () => navigate(FAQS);

    const handleTelegramClick = () => window.open('https://t.me/joinchat/AP-u-dVKEn9mZjg6', '_blank', 'noreferrer');

    const handleEmailClick = () => window.open('mailto:support@fxblooms.com');

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

    return (
        <Layout title="Contact Us">
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
            <Box component="section" className={classes.root}>
                <Box component="header" className={classes.content}>
                    <section className={classes.item} onClick={handleHelpClick}>
                        <div>
                            <Help className={classes.icon} />
                            <Typography variant="h6">Get more info quickly.</Typography>
                            <Typography variant="h6">Most popular help topics.</Typography>
                            <Typography variant="body2" component="span">See frequently asked questions</Typography>
                        </div>
                    </section>
                    <section className={classes.item} onClick={handleTelegramClick}>
                        <div>
                            <Telegram className={classes.icon} />
                            <Typography variant="h6">Have any questions?</Typography>
                            <Typography variant="h6">Join us on Telegram.</Typography>
                            <Typography variant="body2" component="span">Join our telegram community</Typography>
                        </div>
                    </section>
                    <section className={classes.item} onClick={handleEmailClick}>
                        <div>
                            <EmailOpen className={classes.icon} />
                            <Typography variant="h6">We're here for you.</Typography>
                            <Typography variant="h6">Just ask and get answers!</Typography>
                            <Typography variant="body2" component="span">Send us a mail</Typography>
                        </div>
                    </section>
                </Box>
                <Box component="section" className={classes.container}>
                    <Typography variant="h4" className={classes.formHeader}>Send a mail</Typography>
                    <Typography variant="body2" component="p">Have some suggestions or just want to say hi? Contact us:</Typography>
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
                                    maxRows={10}
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
                </Box>
            </Box>
        </Layout>
    );
};

ContactUs.propTypes = {
    sendMail: PropTypes.func.isRequired
};

export default connect(undefined, { sendMail })(ContactUs);