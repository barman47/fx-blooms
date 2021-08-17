import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useLocation, useHistory } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { 
    Container,
    } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { verifyEmail } from '../../actions/customer';

import Spinner from '../../components/common/Spinner';
import SuccessModal from '../../components/common/SuccessModal';
import Toast from '../../components/common/Toast';

import isEmpty from '../../utils/isEmpty';

import logo from '../../assets/img/logo.svg';
import { CREATE_PROFILE } from '../../routes';
import { SET_CUSTOMER_MSG } from '../../actions/types';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: theme.spacing(5),

        [theme.breakpoints.down('sm')]: {
            paddingTop: theme.spacing(2)
        }
    },

    logo: {
        alignSelf: 'flex-start',
    },

    image: {
        margin: '0 auto',
        width: 'initial',

        [theme.breakpoints.down('sm')]: {
            width: '90vw'
        }
    }
}));

const VerifyEmail = (props) => {
    const classes = useStyles();

    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();
    
    const { msg } = useSelector(state => state.customer);
    const errorsState = useSelector(state => state.errors);

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const { verifyEmail } = props;

    const successModal = useRef();
    const toast = useRef();

    useEffect(() => {
        setLoading(true);
        const data = location.search;
        const externalid = data.substring(data.indexOf('=') + 1,data.indexOf('&'));
        const token = data.split('token=')[1];
        
        verifyEmail({ externalid, token });
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (msg) {
            successModal.current.openModal();
            successModal.current.setModalText(msg);
        }
    }, [msg]);

    useEffect(() => {
        if (errorsState?.msg) {
            setErrors(errorsState);
            setLoading(false);
        }
    }, [errorsState]);

    useEffect(() => {
        if (!isEmpty(errors)) {
            toast.current.handleClick();
        }
    }, [errors]);

    const dismissSuccessModal = () => {
        dispatch({
            type: SET_CUSTOMER_MSG,
            payload: null
        });
        return history.push(CREATE_PROFILE, { verifiedEmail: true });
    };

    return (
        <>
            <Helmet><title>Verify Email | FXBLOOMS.com</title></Helmet>
            {loading && <Spinner text="Verifying Email . . ." />}
            <SuccessModal ref={successModal} dismissAction={dismissSuccessModal} />
            {!isEmpty(errors) && 
                <Toast 
                    ref={toast}
                    title="ERROR"
                    duration={5000}
                    msg={errors.msg || ''}
                    type="error"
                />
            }
            <Container className={classes.root}>
                <RouterLink to="/" className={classes.logo}>
                    <img src={logo} className={classes.logo} alt="FX Blooms Logo" />
                </RouterLink>
            </Container>
        </>
    );
}

VerifyEmail.propTypes = {
    verifyEmail: PropTypes.func.isRequired
};

export default connect(undefined, { verifyEmail })(VerifyEmail);