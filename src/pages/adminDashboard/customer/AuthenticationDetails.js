import { useState, useLayoutEffect, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
// import PropTypes from 'prop-types';
import { Box, Typography, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
// import clsx from 'clsx';

// import { COLORS } from '../../../utils/constants';
import {
    getIdCardValidationResponse,
    getResidencePermitValidationResponse,
    getCustomer,
} from "../../../actions/customer";
import GenericGridAuth from "../../../components/admin-dashboard/GenericGridAuth";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: "white",
        borderRadius: "12px",
        padding: [[theme.spacing(2), theme.spacing(4)]],
        boxShadow: "1px 1px 3px #dbdddd",

        [theme.breakpoints.down("md")]: {
            paddingBottom: theme.spacing(4),
        },
    },

    //NEW STYLE
    authentications: {
        display: "grid",
        gridTemplateColumns: "1fr 5px 1fr",
        gap: ".9vw",
        marginTop: "20px",
    },

    twoFA: {
        // borderRight: '1px solid #C4C4C4'
    },

    divider: {
        backgroundColor: "#E1E1E1",
        width: theme.spacing(0.3),
    },

    authName: {
        fontWeight: "bold",
        color: "#5D6060",
    },

    subAuthName: {
        marginBottom: theme.spacing(1.4),
    },

    status: {
        backgroundColor: "#C4C4C4",
        color: "white",
    },

    verified: {
        backgroundColor: "#DDF2E5",
        color: "#1E6262",
    },

    pending: {
        backgroundColor: "#FFF5CE",
        color: "#FBBC05",
    },

    rejected: {
        backgroundColor: "#FFCECE",
        color: "#FF0000",
    },

    suspended: {
        backgroundColor: "#f5f7be",
        color: "#d1c70c",
    },
}));

const AuthenticationDetails = () => {
    const classes = useStyles();
    const { customer, idCheckData, profileCheckData } = useSelector(
        (state) => state.customers
    );
    // const { customer } = useSelector(state => state.customers);
    // const errorsState = useSelector(state => state.errors);

    // const [loading, setLoading] = useState(false);

    const [twoFactorEnabled] = useState(customer.twoFactorEnabled);
    const [hasSetUpTwoFactor] = useState(customer.hasSetUpTwoFactor);

    const [verifiedPhoneNumber] = useState(customer.isPhoneNumberVerified);
    const [verifiedEmail] = useState(customer.isEmailVerified);
    const [verifiedAddress] = useState(customer.residencePermitStatus);

    // eslint-disable-next-line
    // const [errors, setErrors] = useState({});

    // const toast = useRef();
    // console.log('auth', twoFactorEnabled)

    const isVerified = useCallback(
        (status) => {
            switch (status) {
                case true || "APPROVED":
                    return classes.verified;
                default:
                    return classes.rejected;
            }
        },
        [classes.verified, classes.rejected]
    );

    const hasSetup2FASetup = useCallback(
        (status) => {
            if (!!status) {
                if (!!twoFactorEnabled) {
                    return classes.verified;
                } else {
                    return classes.rejected;
                }
            } else {
                return classes.status;
            }
        },
        [classes.rejected, classes.verified, classes.status, twoFactorEnabled]
    );

    const handleDisplayStatus = useCallback(() => {
        if (!!hasSetUpTwoFactor) {
            if (!!twoFactorEnabled) {
                return "ACTIVE";
            } else {
                return "INACTIVE";
            }
        } else {
            return "NOT SETUP";
        }
    }, [twoFactorEnabled, hasSetUpTwoFactor]);

    const handleVerification = (status) => {
        switch (status) {
            case true || "APPROVED":
                return "VERIFIED";
            default:
                return "UNVERIFIED";
        }
    };

    useLayoutEffect(() => {
        if (!idCheckData) {
            getIdCardValidationResponse(customer.id);
        }

        if (!profileCheckData) {
            getResidencePermitValidationResponse(customer.id);
        }

        // dispatch({
        //     type: GET_ERRORS,
        //     payload: {}
        // });
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (!twoFactorEnabled) {
            getCustomer(customer.id);
        }
    }, [twoFactorEnabled, customer]);

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
            {/* {loading && <Spinner />} */}
            <Box component="div" className={classes.root}>
                <Typography className={classes.authName} variant="h5">
                    Authentications
                </Typography>
                <Box component="div" className={classes.authentications}>
                    <Box component="div" className={classes.twoFA}>
                        <Typography
                            className={classes.subAuthName}
                            variant="body1"
                        >
                            2FA
                        </Typography>
                        <GenericGridAuth
                            mb="15px"
                            twoFactorName="Google Authenticator"
                            statusName={handleDisplayStatus()}
                            conditionalStyles={hasSetup2FASetup(
                                hasSetUpTwoFactor
                            )}
                        />

                        <GenericGridAuth
                            mb="15px"
                            twoFactorName="SMS Authenticator"
                            statusName={handleDisplayStatus()}
                            conditionalStyles={hasSetup2FASetup(
                                hasSetUpTwoFactor
                            )}
                        />

                        <GenericGridAuth
                            mb="15px"
                            twoFactorName="Email Authenticator"
                            statusName={handleDisplayStatus()}
                            conditionalStyles={hasSetup2FASetup(
                                hasSetUpTwoFactor
                            )}
                        />
                    </Box>

                    <Divider
                        orientation="vertical"
                        flexItem
                        classes={{ root: classes.divider }}
                    />

                    <Box component="div" className={classes.verifications}>
                        <Typography
                            className={classes.subAuthName}
                            variant="body1"
                        >
                            Verifications
                        </Typography>
                        <GenericGridAuth
                            conditionalStyles={isVerified(verifiedPhoneNumber)}
                            btnWidth="9vw"
                            gridColumns="1fr 1fr"
                            mb="15px"
                            twoFactorName="Phone Number"
                            statusName={handleVerification(verifiedPhoneNumber)}
                        />

                        <GenericGridAuth
                            conditionalStyles={isVerified(verifiedAddress)}
                            btnWidth="9vw"
                            gridColumns="1fr 1fr"
                            mb="15px"
                            twoFactorName="Address"
                            statusName={handleVerification(verifiedAddress)}
                        />

                        <GenericGridAuth
                            conditionalStyles={isVerified(verifiedEmail)}
                            btnWidth="9vw"
                            gridColumns="1fr 1fr"
                            mb="15px"
                            twoFactorName="Email"
                            statusName={handleVerification(verifiedEmail)}
                        />
                    </Box>
                </Box>
            </Box>
        </>
    );
};

AuthenticationDetails.propTypes = {
    // getIdCardValidationResponse: PropTypes.func.isRequired,
    // getResidencePermitValidationResponse: PropTypes.func.isRequired,
    // getCustomer: PropTypes.func.isRequired,
};

export default AuthenticationDetails;
