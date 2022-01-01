import { useEffect, useRef, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { Button, Typography } from '@material-ui/core'; 
import { makeStyles } from '@material-ui/core/styles'; 
import PropTypes from 'prop-types';

import { disableTwoFactor } from '../../../actions/twoFactor';

import { COLORS } from '../../../utils/constants';
import isEmpty from '../../../utils/isEmpty';

import Spinner from '../../../components/common/Spinner';
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

    const errorsState = useSelector(state => state.errors);
    const { msg } = useSelector(state => state.twoFactor);

    const [spinnerText, setSpinnerText] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const toast = useRef();

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
            console.log('opening modal');
            setSpinnerText('');
            setLoading(false);
        }
    }, [msg]);

    const handleDisable2FA = () => {
        setLoading(true);
        setSpinnerText('Disabling 2FA...');
        disableTwoFactor();
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
            {loading && <Spinner text={spinnerText} />}
            <section className={classes.root}>
                <Typography variant="h6">You already have two factor authentication enabled</Typography>
                <Typography variant="subtitle1" component="p">Click the button below to disable 2FA.</Typography>
                <Button variant="outlined" color="primary" className={classes.button} onClick={handleDisable2FA}>Disable 2FA</Button>
            </section>
        </>
    );
};

DisableTwoFactor.propTypes = {
    disableTwoFactor: PropTypes.func.isRequired,
};

export default connect(undefined, { disableTwoFactor })(DisableTwoFactor);