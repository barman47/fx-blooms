import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useLocation, useHistory } from 'react-router-dom';
import { batch, connect, useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { 
    Button, 
    Container, 
    Grid,
    TextField,
    Typography,
    useMediaQuery 
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import Spinner from '../../components/common/Spinner';
import SuccessModal from '../../components/common/SuccessModal';
import Toast from '../../components/common/Toast';

import { authorizeTwoFactor, enableTwoFactor } from '../../actions/twoFactor';
import { DASHBOARD, DASHBOARD_HOME } from '../../routes';
import isEmpty from '../../utils/isEmpty';
import { COLORS } from '../../utils/constants';
import cancelLogin from '../../utils/cancelLogin';
import validateAuthenticatorCode from '../../utils/validation/customer/authenticator';

import logo from '../../assets/img/logo.svg';
import { SET_2FA_MSG, SET_BARCODE } from '../../actions/types';

const useStyles = makeStyles(theme => ({
    root: {
        paddingTop: theme.spacing(5),
        
        [theme.breakpoints.down('sm')]: {
            paddingTop: theme.spacing(2)
        }
    },
    
    content: {
        backgroundColor: COLORS.lightTeal,
        display: 'grid',
        gridTemplateColumns: '1fr',
        rowGap: theme.spacing(3),
        justifyContent: 'center',
        fontWeight: 300,
        margin: [[theme.spacing(5), 'auto', 0, 'auto']],
        padding: theme.spacing(3),
        textAlign: 'center',
        width: '50%',

        [theme.breakpoints.down('md')]: {
            width: '70%'
        },

        [theme.breakpoints.down('sm')]: {
            marginTop: theme.spacing(2),
            padding: theme.spacing(1),
            width: '95%'
        }
    },

    input: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // border: '1px solid red',
        textAlign: 'center'
    },

    buttonContainer: {
        marginTop: theme.spacing(2),
    },

    button: {
        margin: '0 auto',
        paddingBottom: theme.spacing(1),
        paddingTop: theme.spacing(1),
        transition: '0.3s linear all',
        width: '15%',

        [theme.breakpoints.down('sm')]: {
            width: '100%'
        }
    },

    cancelButton: {
        color: COLORS.red,
        marginLeft: theme.spacing(2),
        
        '&:hover': {
            backgroundColor: 'rgba(255, 0, 0, 0.1)'
        }
    }
}));

const VerifyQrCode = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    const { customerId } = useSelector(state => state.customer);
    const errorsState = useSelector(state => state.errors);
    const { msg } = useSelector(state => state.twoFactor);
    
    const [first, setFirst] = useState('');
    const [second, setSecond] = useState('');
    const [third, setThird] = useState('');
    const [fourth, setFourth] = useState('');
    const [fifth, setFifth] = useState('');
    const [sixth, setSixth] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    const toast = useRef();
    const successModal = useRef();
    
    const firstField = useRef();
    const secondField = useRef();
    const thirdField = useRef();
    const fourthField = useRef();
    const fifthField = useRef();
    const sixthField = useRef();

    useEffect(() => {
        if (location.state.twoFactorEnabled) {
            setTwoFactorEnabled(location.state.twoFactorEnabled);
        }
    }, [location.state]);

    useEffect(() => {
        if (errorsState?.msg) {
            setErrors({ ...errors, msg: errorsState.msg });
            setLoading(false);
        }
    }, [errorsState, errors]);

    useEffect(() => {
        setErrors(errors);
        if (!isEmpty(errors)) {
            toast.current.handleClick();
        }
    }, [errors]);

    useEffect(() => {
        if (msg) {
            setLoading(false);
            successModal.current.openModal();
            successModal.current.setModalText(msg);
        }
    }, [msg]);

    const moveToNextField = (current, nextField, previousField) => {
        if (nextField === null) {
            return onSubmit();
        }

        const input = nextField.getElementsByTagName('input')[0];

        if (current.value.length >= current.maxLength) {
            input.focus();
        }

        if (previousField && current.value.length === 0) {
            previousField.getElementsByTagName('input')[0].focus();
        }
    };

    const dismissAction = () => {
        batch(() => {
            dispatch({
                type: SET_BARCODE,
                payload: {}
            });
            dispatch({
                type: SET_2FA_MSG,
                payload: null
            });
        });
        return history.push(`${DASHBOARD}${DASHBOARD_HOME}`);
    };

    const onSubmit = (e) => {
        if (e) {
            e.preventDefault();
        }

        setErrors({});
        
        const { isValid } = validateAuthenticatorCode({
            first,
            second,
            third,
            fourth,
            fifth,
            sixth
        });

        if (!isValid) {
            return setErrors({ msg: 'Invalid Code' });
        }
        
        const code = `${first}${second}${third}${fourth}${fifth}${sixth}`;
        setErrors({});
        setLoading(true);

        if (twoFactorEnabled) {
            return props.authorizeTwoFactor({ code, profileId: customerId }, history);
        }
        return props.enableTwoFactor(code);
    };


    return (
        <>
            <Helmet><title>Verify Code | FXBlooms.com</title></Helmet>
            {!isEmpty(errors) && 
                <Toast 
                    ref={toast}
                    title="ERROR"
                    duration={5000}
                    msg={errors.msg || ''}
                    type="error"
                />
            }
            {loading && <Spinner />}
            <SuccessModal ref={successModal} dismissAction={dismissAction} />
            <Container className={classes.root}>
                <RouterLink to="/" className={classes.logo}>
                    <img src={logo} className={classes.logo} alt="FXBlooms Logo" />
                </RouterLink>
                <div className={classes.content}>
                    <Typography variant="h5">Verify Google Authenticator</Typography>
                    <Typography variant="subtitle1" component="p">Enter the 6-digit code displayed on your Google Authenticator to make sure everything works.</Typography>
                    <form onSubmit={onSubmit} noValidate>
                        <Grid container direction="row" spacing={matches ? 1 : 3}>
                            <Grid item xs={2}>
                                <TextField
                                    className={classes.input}
                                    value={first}
                                    onChange={(e) => setFirst(e.target.value)}
                                    onKeyUp={(e) => moveToNextField(e.target, secondField.current, null)}
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
                                />
                            </Grid>
                            <Grid item xs={2}>
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
                                />
                            </Grid>
                            <Grid item xs={2}>
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
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <TextField
                                    className={classes.input}
                                    value={fifth}
                                    onChange={(e) => setFifth(e.target.value)}
                                    onKeyUp={(e) => moveToNextField(e.target, sixthField.current, fourthField.current)}
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
                            <Grid item xs={2}>
                                <TextField
                                    className={classes.input}
                                    value={sixth}
                                    onChange={(e) => setSixth(e.target.value)}
                                    onKeyUp={(e) => moveToNextField(e.target, null, fifthField.current)}
                                    type="text"
                                    variant="outlined" 
                                    inputProps={{
                                        maxLength: 1
                                    }}
                                    max={1}
                                    required
                                    error={!isEmpty(errors) ? true : false}
                                    ref={sixthField}
                                />
                            </Grid>
                        </Grid>
                        <div className={classes.buttonContainer}>
                            <Button variant="contained" color="primary" className={classes.button} type="submit">Proceed</Button>
                            <Button className={clsx(classes.button, classes.cancelButton)} onClick={() =>cancelLogin(history)}>Cancel</Button>
                        </div>
                    </form>
                </div>
            </Container>
        </>
    );
};

VerifyQrCode.propTypes = {
    authorizeTwoFactor: PropTypes.func.isRequired,
    enableTwoFactor: PropTypes.func.isRequired
};

export default connect(undefined, { authorizeTwoFactor, enableTwoFactor })(VerifyQrCode);