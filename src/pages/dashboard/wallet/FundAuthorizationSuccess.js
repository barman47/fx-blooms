import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { 
    Box,
    Button,
    Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import PropTypes from 'prop-types';

import { payment } from '../../../actions/wallets';
import { GET_ERRORS } from '../../../actions/types';

import isEmpty from '../../../utils/isEmpty';
import Spinner from '../../../components/common/Spinner';
import Toast from '../../../components/common/Toast';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',

        '& div': {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '80%'
        },

        [theme.breakpoints.down('sm')]: {
            justifyContent: 'center',
            padding: theme.spacing(1),
        }
    },

    button: {
        marginTop: theme.spacing(3)
    }

}));

const FundAuthorizationSuccess = ({ payment, handleSetTitle }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const location = useLocation();

    const errorsState = useSelector(state => state.errors);

    const [loadingText, setLoadingText] = useState('Processing Payment . . .');
    const [loading, setLoading] = useState(false);
    // eslint-disable-next-line
    const [errors, setErrors] = useState({});

    const toast = useRef();

    useEffect(() => {
        handleSetTitle('Authorization Success');
        handlePaymentRequest();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (!isEmpty(errors)) {
            toast.current.handleClick();
        }
    }, [errors]);

    useEffect(() => {
        if (errorsState?.msg) {
            setErrors({ ...errorsState });
            setLoading(false);
            setLoadingText('');
            dispatch({
                type: GET_ERRORS,
                payload: {}
            });
        }
    }, [dispatch, errorsState, errors]);

    const handlePaymentRequest = () => {
        const urlParams = {};
        const params = new URLSearchParams(location.search);
        for (let param of params.entries()) {
            urlParams[param[0]] = param[1];
        }
        const { request, consent, type } = urlParams;
        makePayment(request, consent, type);
    };

    const makePayment = (paymentRequestId, consentToken, type) => {
        payment({ paymentRequestId, consentToken, type });
    };

    const handleRetry = () => {
        setLoadingText('Processing Payment . . .');
        setLoading(true);
        handlePaymentRequest();
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
            {loading && <Spinner text={loadingText} />}
            <Box component="section" className={classes.root}>
                {!loading && 
                    <Box component="div">
                        <Typography variant="h6" color="secondary" className={classes.pageTitle}>Request Failed? No Problem!</Typography>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            size="large"
                            onClick={handleRetry}
                            className={classes.button}
                            disableRipple
                            disableFocusRipple
                            disableTouchRipple
                            disabled={loading}
                        >
                            Try Again
                        </Button>
                    </Box>
                }
            </Box>
        </>
    );
};

FundAuthorizationSuccess.propTypes = {
    payment: PropTypes.func.isRequired
};

export default connect(undefined, { payment })(FundAuthorizationSuccess);