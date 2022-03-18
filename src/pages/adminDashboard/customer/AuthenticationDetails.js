import { useEffect, useRef, useState, useLayoutEffect, useCallback, useMemo } from 'react'; 
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { 
    Box, 
    Button,
    Divider,
    Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { DotsHorizontal } from 'mdi-material-ui';
import clsx from 'clsx';

import { COLORS } from '../../../utils/constants';
import { getIdCardValidationResponse, getResidencePermitValidationResponse, getCustomer } from '../../../actions/customer';
import { CLEAR_CUSTOMER_STATUS_MSG, GET_ERRORS } from '../../../actions/types';
import isEmpty from '../../../utils/isEmpty';

import Spinner from '../../../components/common/Spinner';
import SuccessModal from '../../../components/common/SuccessModal';
import Toast from '../../../components/common/Toast';

const useStyles = makeStyles(theme =>({
    root: {
        backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius,
        marginTop: theme.spacing(3),
        padding: [[theme.spacing(2), theme.spacing(5)]],
        height: '100%',

        [theme.breakpoints.down('md')]: {
            paddingBottom: theme.spacing(7)
        }
    },

    content: {
        display: 'grid',
      marginTop: theme.spacing(15),
      gridTemplateColumns: '1fr 0.2fr 1fr'
    },

    detail: {
        marginBottom: theme.spacing(2),

        '& h6:first-child': {
            margin: theme.spacing(2, 0)
        }
    },

    divider: {
        backgroundColor: theme.palette.primary.main,
        width: theme.spacing(0.5)
    },

    detailTitle: {
      marginBottom: theme.spacing(5)
    },

    btnGroup: {
      marginBottom: theme.spacing(5),
      marginTop: theme.spacing(5),
      '& button': {
        marginRight: theme.spacing(2),
        color: theme.palette.primary.main,
        fontWeight: theme.typography.fontWeightBold,
        borderColor: theme.palette.primary.main,
      }
    },

    btn: {
      '& span': {
        gap: theme.spacing(3),
        color: 'red',
      }
    },

    authTrue: {
      color: 'green !important',
    },

    authFalse: {
      color: 'grey !important',
    },

    btnLeft: {
      '& span': {
        gap: theme.spacing(3),
        color: theme.palette.primary.main,
        textTransform: 'uppercase'
      }
    },


}));

const AuthenticationDetails = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { customer, idCheckData, msg, profileCheckData } = useSelector(state => state.customers);
    const errorsState = useSelector(state => state.errors);
    
    const [loading, setLoading] = useState(false);
    // eslint-disable-next-line
    const [errors, setErrors] = useState({});

    const toast = useRef();
    const successModal = useRef();

    const handleAuthClass = useCallback((detail) => clsx({
      // [classes.authFalse]: !customer[detail],
      [classes.authTrue]: customer[detail],
    }), [customer, classes.authTrue])

    const hasSetup2FAInactive = useMemo(() => clsx({
      [classes.authFalse]: customer.twoFactorEnabled,
    }), [customer, classes.authFalse])

    const hasSetup2FASetup = useMemo(() => clsx({
      [classes.authFalse]: customer.twoFactorEnabled,
      [classes.authTrue]: customer.hasSetUpTwoFactor,
    }), [customer, classes.authFalse, classes.authTrue])

    useLayoutEffect(() => {
      
      if (!idCheckData) {
          dispatch(getIdCardValidationResponse(customer.id));
      }

      if (!profileCheckData) {
          dispatch(getResidencePermitValidationResponse(customer.id));
      }

      dispatch({
          type: GET_ERRORS,
          payload: {}
      });
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (errorsState?.msg) {
            setLoading(false);
            toast.current.handleClick();
        }
    }, [errorsState, errors]);

    useEffect(() => {
        if (msg) {
            setLoading(false);
            successModal.current.openModal();
            successModal.current.setModalText(msg);
        }
    }, [dispatch, msg]);

    useEffect(() => {
      dispatch(getCustomer(customer.id))
    }, [dispatch, customer])

    const dismissSuccessModal = () => {
        dispatch({
            type: CLEAR_CUSTOMER_STATUS_MSG,
            payload: null
        });
    };

    return (
        <>
            {!isEmpty(errorsState) && 
                <Toast 
                    ref={toast}
                    title="ERROR"
                    duration={5000}
                    msg={errorsState.msg || ''}
                    type="error"
                />
            }
            {loading && <Spinner />}
            <SuccessModal ref={successModal} dismissAction={dismissSuccessModal} />
            <Box component="section" className={classes.root}>
                <Typography className={classes.detailTitle} variant="h6" color="primary">AUTHENTICATIONS</Typography>
                <Box component="section" className={classes.content}>
                    <Box component="div" className={classes.detail}>
                        <Typography color="primary" variant="h6">2FA</Typography>
                          <div className={classes.btnGroup}>
                            <Button className={classes.btnLeft} variant="outlined">Google Authenticator &nbsp; &nbsp; &nbsp; <DotsHorizontal /></Button>
                            <Button className={classes.btn} variant="outlined">
                              <Typography className={hasSetup2FASetup} variant="span" component="span">SETUP</Typography>
                              <Typography className={handleAuthClass('twoFactorEnabled')} variant="span" component="span">ACTIVE</Typography>
                              <Typography className={hasSetup2FAInactive} variant="span" component="span">INACTIVE</Typography>
                            </Button>
                          </div>
                          <div className={classes.btnGroup}>
                            <Button className={classes.btnLeft} variant="outlined">SMS OTP &nbsp; &nbsp; &nbsp; <DotsHorizontal /></Button>
                            <Button className={classes.btn} variant="outlined">
                              <Typography className={hasSetup2FASetup} variant="span" component="span">SETUP</Typography>
                              <Typography className={handleAuthClass('twoFactorEnabled')} variant="span" component="span">ACTIVE</Typography>
                              <Typography className={hasSetup2FAInactive} variant="span" component="span">INACTIVE</Typography>
                            </Button>
                          </div>
                          <div className={classes.btnGroup}>
                            <Button className={classes.btnLeft} variant="outlined">EMAIL OTP &nbsp; &nbsp; &nbsp; <DotsHorizontal /></Button>
                            <Button className={classes.btn} variant="outlined">
                              <Typography className={hasSetup2FASetup} variant="span" component="span">SETUP</Typography>
                              <Typography className={handleAuthClass('twoFactorEnabled')} variant="span" component="span">ACTIVE</Typography>
                              <Typography className={hasSetup2FAInactive} variant="span" component="span">INACTIVE</Typography>
                            </Button>
                          </div>
                    </Box>
                    <Divider orientation="vertical" flexItem classes={{ root: classes.divider }} />       
                    <Box component="div" className={classes.detail}>
                      <Box component="div" className={classes.detail}>
                        <Typography color="primary" variant="h6">VERIFICATION</Typography>
                          <div className={classes.btnGroup}>
                            <Button className={classes.btnLeft} variant="outlined">Phone Number &nbsp; &nbsp; &nbsp; <DotsHorizontal /></Button>
                            <Button className={classes.btn} variant="outlined">
                              <Typography className={handleAuthClass('phoneNo')} variant="span" component="span">PROVIDED</Typography>
                              <Typography className={handleAuthClass('isPhoneNumberVerified')} variant="span" component="span">VERIFIED</Typography>
                            </Button>
                          </div>
                          <div className={classes.btnGroup}>
                            <Button className={classes.btnLeft} variant="outlined">Address &nbsp; &nbsp; &nbsp; <DotsHorizontal /></Button>
                            <Button className={classes.btn} variant="outlined">
                              <Typography className={handleAuthClass('address')} variant="span" component="span">PROVIDED</Typography>
                              <Typography className={handleAuthClass('residentialPermitVerificationResponse')} variant="span" component="span">VERIFIED</Typography>
                            </Button>
                          </div>
                          <div className={classes.btnGroup}>
                            <Button className={classes.btnLeft} variant="outlined">Email &nbsp; &nbsp; &nbsp; <DotsHorizontal /></Button>
                            <Button className={classes.btn} variant="outlined">
                              <Typography className={handleAuthClass('email')} variant="span" component="span">PROVIDED</Typography>
                              <Typography className={handleAuthClass('isEmailVerified')} variant="span" component="span">VERIFIED</Typography>
                            </Button>
                          </div>
                    </Box>
                    </Box>     
                </Box>
            </Box>
        </>
    );
};

AuthenticationDetails.propTypes = {
    getIdCardValidationResponse: PropTypes.func.isRequired,
    getResidencePermitValidationResponse: PropTypes.func.isRequired,
    getCustomer: PropTypes.func.isRequired,
};

export default AuthenticationDetails;