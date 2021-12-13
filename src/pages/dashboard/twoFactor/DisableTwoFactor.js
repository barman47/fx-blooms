import { useEffect, useRef, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Button, Grid, TextField, Typography, useMediaQuery } from '@material-ui/core'; 
import { makeStyles, useTheme } from '@material-ui/core/styles'; 
import PropTypes from 'prop-types';

import { disableTwoFactor } from '../../../actions/twoFactor';

import { COLORS } from '../../../utils/constants';
import isEmpty from '../../../utils/isEmpty';
import { GET_ERRORS, SET_2FA_MSG } from '../../../actions/types';
import validateAuthenticatorCode from '../../../utils/validation/customer/authenticator';

import Spinner from '../../../components/common/Spinner';
import SuccessModal from '../../../components/common/SuccessModal';
import Toast from '../../../components/common/Toast';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius,
        display: 'grid',
        gridTemplateColumns: '1fr',
        rowGap: theme.spacing(3),
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 300,
        marginTop: theme.spacing(-3),
        padding: theme.spacing(3),
        textAlign: 'center',
        // width: '100%',

        [theme.breakpoints.down('sm')]: {
            marginTop: theme.spacing(2),
            padding: theme.spacing(1)
        }
    },

    form: {
        justifySelf: 'center',
        width: '90%'
    },

    input: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // border: '1px solid red',
        textAlign: 'center'
    },

    button: {
        justifySelf: 'center',
        marginBottom: theme.spacing(4),
        marginTop: theme.spacing(4),
        paddingBottom: theme.spacing(1),
        paddingTop: theme.spacing(1),
        transition: '0.3s linear all',

        [theme.breakpoints.down('sm')]: {
            width: '100%'
        }
    },
}));

const DisableTwoFactor = ({ disableTwoFactor }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

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

    const toast = useRef();
    const successModal = useRef();
    
    const firstField = useRef();
    const secondField = useRef();
    const thirdField = useRef();
    const fourthField = useRef();
    const fifthField = useRef();
    const sixthField = useRef();

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
        if (nextField === null && current.value) {
            return onSubmit();
        }

        if (previousField && current.value.length === 0) {
            return previousField.getElementsByTagName('input')[0].focus();
        }

        const input = nextField.getElementsByTagName('input')[0];

        if (current.value.length >= current.maxLength) {
            return input.focus();
        }
    };

    const dismissAction = () => {
        // batch(() => {
        //     dispatch({
        //         type: SET_BARCODE,
        //         payload: {}
        //     });
        //     dispatch({
        //         type: SET_2FA_MSG,
        //         payload: null
        //     });
        // });
        dispatch({
            type: SET_2FA_MSG,
            payload: null
        });
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
        dispatch({
            type: GET_ERRORS,
            payload: {}
        });

        return disableTwoFactor(code);
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
            {loading && <Spinner />}
            <SuccessModal ref={successModal} dismissAction={dismissAction} />
            <section className={classes.root}>
                <Typography variant="h6">You already have two factor authentication enabled</Typography>
                <Typography variant="subtitle1" component="p">Enter the 6-digit code displayed on your Google Authenticator app to disable 2FA.</Typography>
                <form onSubmit={onSubmit} noValidate className={classes.form}>
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
                    <Button type="submit" variant="outlined" color="primary" className={classes.button}>Disable 2FA</Button>
                </form>
            </section>
        </>
    );
};

DisableTwoFactor.propTypes = {
    disableTwoFactor: PropTypes.func.isRequired,
};

export default connect(undefined, { disableTwoFactor })(DisableTwoFactor);