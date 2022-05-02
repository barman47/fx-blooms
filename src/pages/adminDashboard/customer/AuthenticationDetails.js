import { useRef, useState, useMemo } from 'react'; 
import { useDispatch } from 'react-redux';
// import PropTypes from 'prop-types';
import { 
    Box, 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

// import { COLORS } from '../../../utils/constants';
// import { getIdCardValidationResponse, getResidencePermitValidationResponse, getCustomer } from '../../../actions/customer';
import { CLEAR_CUSTOMER_STATUS_MSG } from '../../../actions/types';
// import { CLEAR_CUSTOMER_STATUS_MSG, GET_RRORS } from '../../../actions/types';
// import isEmpty from '../../../utils/isEmpty';

import Spinner from '../../../components/common/Spinner';
import SuccessModal from '../../../components/common/SuccessModal';
// import Toast from '../../../components/common/Toast';
import GenericGridAuth from '../../../components/admin-dashboard/GenericGridAuth'


const useStyles = makeStyles(theme =>({
  root: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: [[theme.spacing(2), theme.spacing(4)]],

      [theme.breakpoints.down('md')]: {
          paddingBottom: theme.spacing(4)
      }
  },

  // content: {
  //   display: 'grid',
  //   gridTemplateColumns: '1fr 0.2fr 1fr'
  // },

  // detail: {
  //     marginBottom: theme.spacing(2),

  //     '& h6:first-child': {
  //         margin: theme.spacing(2, 0)
  //     }
  // },

  // divider: {
  //     backgroundColor: theme.palette.primary.main,
  //     width: theme.spacing(0.5)
  // },

  // detailTitle: {
  //   marginBottom: theme.spacing(5)
  // },

  // btnGroup: {
  //   marginBottom: theme.spacing(5),
  //   marginTop: theme.spacing(5),
  //   '& button': {
  //     marginRight: theme.spacing(2),
  //     color: theme.palette.primary.main,
  //     fontWeight: theme.typography.fontWeightBold,
  //     borderColor: theme.palette.primary.main,
  //   }
  // },

  // btn: {
  //   '& span': {
  //     gap: theme.spacing(3),
  //     color: 'red',
  //   }
  // },

  // authTrue: {
  //   color: 'green !important',
  // },

  // authFalse: {
  //   color: 'grey !important',
  // },

  // btnLeft: {
  //   '& span': {
  //     gap: theme.spacing(3),
  //     color: theme.palette.primary.main,
  //     textTransform: 'uppercase'
  //   }
  // },


  //NEW STYLE
  authentications: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
  },

  twoFA: {
    // borderRight: '1px solid #C4C4C4'
  }

}));

const AuthenticationDetails = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    // const { customer, idCheckData, msg, profileCheckData } = useSelector(state => state.customers);
    // const { customer } = useSelector(state => state.customers);
    // const errorsState = useSelector(state => state.errors);
    
    // const [loading, setLoading] = useState(false);
    const [loading] = useState(false);
    // eslint-disable-next-line
    // const [errors, setErrors] = useState({});

    // const toast = useRef();
    const successModal = useRef();
    console.log('hello')

    // const handleAuthClass = useCallback((detail) => clsx({
    //   // [classes.authFalse]: !customer[detail],
    //   [classes.authTrue]: customer[detail],
    // }), [customer, classes.authTrue])

    // const hasSetup2FAInactive = useMemo(() => clsx({
    //   [classes.authFalse]: customer.twoFactorEnabled,
    // }), [customer, classes.authFalse])

    const hasSetup2FASetup = useMemo(() => clsx({
      // [classes.authFalse]: customer.twoFactorEnabled,
      // [classes.authTrue]: customer.hasSetUpTwoFactor,
    }), [])

    // useLayoutEffect(() => {
      
    //   if (!idCheckData) {
    //       dispatch(getIdCardValidationResponse(customer.id));
    //   }

    //   if (!profileCheckData) {
    //       dispatch(getResidencePermitValidationResponse(customer.id));
    //   }

    //   dispatch({
    //       type: GET_ERRORS,
    //       payload: {}
    //   });
    //     // eslint-disable-next-line
    // }, []);

    console.log('hello')

    // useEffect(() => {
    //     if (errorsState?.msg) {
    //         setLoading(false);
    //         // toast.current.handleClick();
    //     }
    // }, [errorsState, errors]);

    // useEffect(() => {
    //     if (msg) {
    //         setLoading(false);
    //         successModal.current.openModal();
    //         successModal.current.setModalText(msg);
    //     }
    // }, [dispatch, msg]);

    // useEffect(() => {
    //   dispatch(getCustomer(customer.id))
    // }, [dispatch, customer])

    const dismissSuccessModal = () => {
        dispatch({
            type: CLEAR_CUSTOMER_STATUS_MSG,
            payload: null
        });
    };

    return (
        <>
            {/* {!isEmpty(errorsState) && 
                <Toast 
                    ref={toast}
                    title="ERROR"
                    duration={5000}
                    msg={errorsState.msg || ''}
                    type="error"
                />
            } */}
            {loading && <Spinner />}
            <SuccessModal ref={successModal} dismissAction={dismissSuccessModal} />
            <Box component="div" className={classes.root}>
              <Box component="div" className={classes.authentications}>
                <Box component="div" className={classes.twoFA}>
                  <GenericGridAuth mb="15px" twoFactorName="Google Authenticator" statusName="Active" bgColor="#DDF2E5" textColor="#1E6262" hasSetup2FASetup={hasSetup2FASetup} />
                  <GenericGridAuth mb="15px" twoFactorName="SMS Authenticator" statusName="Inactive" bgColor="#FFCECE" textColor="#1E6262" hasSetup2FASetup={hasSetup2FASetup} />
                  <GenericGridAuth mb="15px" twoFactorName="Email Authenticator" statusName="Not setup" bgColor="#C4C4C4" textColor="#FFFFFF" hasSetup2FASetup={hasSetup2FASetup} />
                </Box>

                <Box component="div" className={classes.verifications}>
                  
                </Box>
              </Box>
            </Box>
            {/* <Box component="section" className={classes.root}>
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
            </Box> */}
        </>
    );
};

AuthenticationDetails.propTypes = {
    // getIdCardValidationResponse: PropTypes.func.isRequired,
    // getResidencePermitValidationResponse: PropTypes.func.isRequired,
    // getCustomer: PropTypes.func.isRequired,
};

export default AuthenticationDetails;