import { useEffect, useRef, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Button, CircularProgress, TextField, Typography, useMediaQuery } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import Validator from 'validator';
import PropTypes from 'prop-types';

import Toast from '../../components/common/Toast';
import SubscriptionSuccessModal from './SubscriptionSuccessModal';

import { addSubscription } from '../../actions/subscription';
import { ADDED_SUBSCRIPTION, GET_ERRORS } from '../../actions/types';
import isEmpty from '../../utils/isEmpty';
import { COLORS } from '../../utils/constants';
import img from '../../assets/img/landing.svg';
import logo from '../../assets/img/logo-white.svg';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: '#00827f',
        color: COLORS.offWhite,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        columnGap: theme.spacing(4),
        height: '100vh',
        width: '100vw',
        
        [theme.breakpoints.down('md')]: {
            gridTemplateColumns: '1fr',
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1)
        }
    },

    content: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        height: '100%',
        paddingLeft: theme.spacing(4),

        '& img': {
            [theme.breakpoints.down('sm')]: {
                width: '100vw'
            }
        },

        '& h6': {
            [theme.breakpoints.down('sm')]: {
                textAlign: 'left',
                width: '100vw'
            }
        },

        '& form': {
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: theme.spacing(2),
            width: '100%',

            [theme.breakpoints.down('sm')]: {
                gridTemplateColumns: '1fr',
                width: '100vw'
            }
        },

        [theme.breakpoints.down('md')]: {
            textAlign: 'center',
            paddingLeft: 0
        }
    },

    button: {
        [theme.breakpoints.down('sm')]: {
            width: '100%'
        }
    },

    input: {
        color: COLORS.offWhite,
        fontWeight: 300,
        [theme.breakpoints.down('sm')]: {
            width: '100%'
        }
    },

    spinner: {
        color: COLORS.offWhite
    },

    timerSection: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingRight: theme.spacing(4),

        [theme.breakpoints.down('md')]: {
            paddingRight: 0
        },

        [theme.breakpoints.down('sm')]: {
            width: '100vw'
        },

        '& img': {
            width: '100%',

            [theme.breakpoints.down('md')]: {
                width: '50%'
            },
        }
    },

    timerContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        columnGap: theme.spacing(3),
        textAlign: 'center',

        [theme.breakpoints.down('md')]: {
            display: 'flex',
            flexDirection: 'row'
        },

        [theme.breakpoints.down('sm')]: {
            maxWidth: '100vw'
        },
    },

    timerText: {
        color: COLORS.offWhite,
        fontWeight: 300,

        [theme.breakpoints.down('sm')]: {
            fontSize: theme.spacing(1)
        }
    }
}));

const minuteSeconds = 60;
const hourSeconds = 3600;
const daySeconds = 86400;

const Landing = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const dispatch = useDispatch();

    const errorsState = useSelector(state => state.errors);
    const { subscription } = useSelector(state => state);

    const [Email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const toast = useRef();

    useEffect(() => {
        if (!isEmpty(errors)) {
            toast.current.handleClick();
        }
    }, [errors]);

    useEffect(() => {
        if (errorsState?.msg) {
            setErrors({ ...errorsState });
            // setErrors({ Email: errorsState?.msg, ...errorsState });
            setLoading(false);
            dispatch({
                type: GET_ERRORS,
                payload: {}
            });
        }
    }, [dispatch, errorsState, errors]);

    useEffect(() => {
        if (subscription) {
            setEmail('');
            setLoading(false);
            setOpen(true);
            return dispatch({ type: ADDED_SUBSCRIPTION });
        }
    }, [dispatch, subscription]);

    const renderTime = (dimension, time) => {
        return (
            <div className={classes.timerText}>
                <div className="time">{time}</div>
                <div>{dimension}</div>
            </div>
        );
    };

    const getTimeSeconds = (time) => (minuteSeconds - time) | 0;
    const getTimeMinutes = (time) => ((time % hourSeconds) / minuteSeconds) | 0;
    const getTimeHours = (time) => ((time % daySeconds) / hourSeconds) | 0;
    const getTimeDays = (time) => (time / daySeconds) | 0;

    const onSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        if (Validator.isEmpty(Email)) {
            return setErrors({ msg: 'Your email is required!' });
        }

        if (!Validator.isEmail(Email)) {
            return setErrors({ msg: 'Invalid email address!' });
        }

        setErrors({});
        setLoading(true);
        props.addSubscription({ Email });
    };

    const endTime = new Date('July 29, 2021 00:00:00').getTime() / 1000; // use UNIX timestamp in seconds
    const startTime = Date.now() / 1000; // use UNIX timestamp in seconds
    // const endTime = startTime + 2678400; // use UNIX timestamp in seconds

    const remainingTime = endTime - startTime;
    const days = Math.ceil(remainingTime / daySeconds);
    const daysDuration = days * daySeconds;

    const handleCloseModal = () => setOpen(false);

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
            <SubscriptionSuccessModal open={open} handleCloseModal={handleCloseModal} />
            <section className={classes.root}>
                <div className={classes.content}>
                    <Typography variant="subtitle2" component="p">LAUNCHING 29-07-2021</Typography>
                    <img src={logo} alt="FXBLOOMS Logo" />
                    <Typography variant="h6">FX Blooms is a marketplace for peer-to-peer currency exchange.</Typography>
                    <form onSubmit={onSubmit} noValidate>
                        <Typography variant="subtitle2" component="span">Subscribe to receive our most recent updates.</Typography>
                        <TextField 
                            value={Email}
                            inputProps={{
                                className: classes.input
                            }}
                            onChange={(e) => setEmail(e.target.value.toLowerCase())}
                            type="text"
                            variant="outlined" 
                            label="Email" 
                            placeholder="Enter Your Email Address"
                            helperText={errors.Email || errors.message}
                            required
                            disabled={loading ? true : false}
                            error={errors.Email  || errors.message ? true : false}
                        />
                        <Button 
                            variant="contained" 
                            className={classes.button}
                            color="primary"
                            type="submit"
                            disabled={loading ? true : false}
                        >
                            {!loading && 'Subscribe'}
                            {loading && <CircularProgress className={classes.spinner} />}
                        </Button>
                    </form>
                </div>
                <div className={classes.timerSection}>
                    <img src={img} alt="FXBLOOMS.com" />
                    <Typography variant="h6" align="center">LAUNCHING IN</Typography>
                    <div className={classes.timerContainer}>
                        <CountdownCircleTimer
                            isPlaying={true}
                            size={matches ? 60 : 120}
                            strokeWidth={matches ? 3 : 6}
                            colors={[["#d9d9d9"]]}
                            trailColor="#005a5a"
                            duration={daysDuration}
                            initialRemainingTime={remainingTime}
                        >
                            {({ elapsedTime }) =>
                            renderTime("days", getTimeDays(daysDuration - elapsedTime))
                            }
                        </CountdownCircleTimer>
                        <CountdownCircleTimer
                            isPlaying={true}
                            size={matches ? 60 : 120}
                            strokeWidth={matches ? 3 : 6}
                            colors={[["#d9d9d9"]]}
                            trailColor="#005a5a"
                            duration={daySeconds}
                            initialRemainingTime={remainingTime % daySeconds}
                            onComplete={(totalElapsedTime) => [
                            remainingTime - totalElapsedTime > hourSeconds
                            ]}
                        >
                            {({ elapsedTime }) =>
                            renderTime("hours", getTimeHours(daySeconds - elapsedTime))
                            }
                        </CountdownCircleTimer>
                        <CountdownCircleTimer
                            isPlaying={true}
                            size={matches ? 60 : 120}
                            strokeWidth={matches ? 3 : 6}
                            colors={[["#d9d9d9"]]}
                            trailColor="#005a5a"
                            duration={hourSeconds}
                            initialRemainingTime={remainingTime % hourSeconds}
                            onComplete={(totalElapsedTime) => [
                            remainingTime - totalElapsedTime > minuteSeconds
                            ]}
                        >
                            {({ elapsedTime }) =>
                            renderTime("minutes", getTimeMinutes(hourSeconds - elapsedTime))
                            }
                        </CountdownCircleTimer>
                        <CountdownCircleTimer
                            isPlaying={true}
                            size={matches ? 60 : 120}
                            strokeWidth={matches ? 3 : 6}
                            colors={[["#d9d9d9"]]}
                            trailColor="#005a5a"
                            duration={minuteSeconds}
                            initialRemainingTime={remainingTime % minuteSeconds}
                            onComplete={(totalElapsedTime) => [
                            remainingTime - totalElapsedTime > 0
                            ]}
                        >
                            {({ elapsedTime }) =>
                            renderTime("Seconds", getTimeSeconds(elapsedTime))
                            }
                        </CountdownCircleTimer>
                    </div>
                </div>
            </section>
        </>
    );
}

Landing.propTypes = {
    addSubscription: PropTypes.func.isRequired
};

export default connect(undefined, { addSubscription })(Landing);