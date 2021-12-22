import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { connect} from 'react-redux';
import PropTypes from 'prop-types';
import { 
    Backdrop,
	Button,
    Fade,
	Grid,
    Modal,
	Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { InformationOutline } from 'mdi-material-ui';

import { COLORS, LOGOUT, SHADOW } from '../../utils/constants';
import { RESET_CUSTOMER_SESSION } from '../../actions/types';
import reIssueCustomerToken from '../../utils/reIssueCustomerToken';
import { logout } from '../../actions/customer';

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

        [theme.breakpoints.down('md')]: {
            height: '50vw',
            width: '50vw',
        },
        
        [theme.breakpoints.down('sm')]: {
            height: '40vh',
            width: '90vw'
        }
    },

    item: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        textAlign: 'center'
    },

    icon: {
        color: theme.palette.primary.main,
        fontSize: theme.spacing(5)
    }
}));

const SessionModal = ({ logout }) => {
	const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const { resetSession } = useSelector(state => state.customer);

    const [open, setOpen] = useState(false);
    const [expired, setExpired] = useState(false);
    const [inactiveTime, setInActiveTime] = useState(0);
    const [timeToLogout, setTimeToLogout] = useState(60);

    let sessionTimer = useRef();
    let logoutTimer = useRef();

    const timeoutDuration = 300; //300 seconds: 5 minutes

    const resetSessionTimer = useCallback(() => {
        setOpen(false);
        setInActiveTime(0);
        setTimeToLogout(60);
        clearInterval(logoutTimer.current);
        logoutTimer.current = undefined;
        startSessionTimer();
    }, []);

    useEffect(() => {
        startSessionTimer();
        
        return () => {
            clearInterval(sessionTimer.current);
            sessionTimer.current = undefined;
            clearInterval(logoutTimer.current);
            logoutTimer.current = undefined;
        };
        // eslint-disable-next-line
    }, []);

    // Show logout modal and start logout countdown
    useEffect(() => {
        if (inactiveTime >= timeoutDuration) {
            setOpen(true);
            clearInterval(sessionTimer.current);
            sessionTimer.current = undefined;
            startLogoutTimer();
        }
    }, [inactiveTime]);

    const handleLogin = useCallback(() => {
        setOpen(false);
        logout(history);
    }, [history, logout]);

    // logout user when time has elapsed
    useEffect(() => {
        if (timeToLogout <= 0) {
            clearInterval(logoutTimer.current);
            logoutTimer.current = undefined;
            setExpired(true);
            sessionStorage.setItem(LOGOUT, 'true');
        }
    }, [timeToLogout]);

    useEffect(() => {
        if (resetSession === true) {
            resetSessionTimer();
            dispatch({
                type: RESET_CUSTOMER_SESSION,
                payload: false
            });
        }
    }, [dispatch, resetSession, resetSessionTimer]);

    const startSessionTimer = () => {
        if (!sessionTimer.current) {
            sessionTimer.current = setInterval(() => {
                setInActiveTime(inactiveTime => inactiveTime + 1);
            },1000);
        }
    };

    const startLogoutTimer = () => {
        if (!logoutTimer.current) {
            logoutTimer.current = setInterval(() => {
                setTimeToLogout(timeToLogout => timeToLogout - 1);
            },1000);
        }
    };

    const handleReissueToken = async () => {
        await reIssueCustomerToken();
        resetSessionTimer();
    };

	return (
        <Modal
            aria-labelledby="session-modal-title"
            aria-describedby="session-modal-description"
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
                        <InformationOutline className={classes.icon} />
                        {expired ? 
                            <>
                                <Typography variant="subtitle1">
                                    Sorry your session has expired due to inactivity.
                                </Typography>
                                <Button color="primary" onClick={handleLogin}>Log Me In</Button>
                            </>
                            :
                            <>
                                <Typography variant="subtitle1">
                                    Sorry your session is expiring due to inactivity. You will be logged out in {timeToLogout} second(s).
                                </Typography>
                                <Button color="primary" onClick={handleReissueToken}>Keep me signed in</Button>
                            </>
                        }
                    </Grid>
                </Grid>
            </Fade>
        </Modal>
	);
};

SessionModal.propTypes = {
    logout: PropTypes.func.isRequired
};

export default connect(undefined, { logout })(SessionModal);