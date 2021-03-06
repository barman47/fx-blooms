import axios from "axios";
import { batch } from "react-redux";

import { ADD_USERNAME, DASHBOARD_HOME, LOGIN, SETUP_2FA } from "../routes";
import {
    ACCEPTED_CUSTOMER_ID,
    ACCEPTED_CUSTOMER_RESIDENCE_PERMIT,
    PROFILE_UPDATED,
    SET_ID_CHECK_DATA,
    SET_PROFILE_CHECK_DATA,
} from "./types";
import {
    SETUP_2FA as GOTO_2FA,
    EMAIL_VERIFICATION,
    PROCEED_TO_LOGIN,
    // PROCEED_TO_DASHBOARD,
    ID_STATUS,
    FILL_FORM1,
    SESSION_TIME,
} from "../utils/constants";
import handleError from "../utils/handleError";
import reIssueCustomerToken from "../utils/reIssueCustomerToken";
import reIssueAdminToken from "../utils/reIssueAdminToken";
import setAuthToken from "../utils/setAuthToken";

import {
    RESET_STORE,
    SET_CURRENT_CUSTOMER,
    SET_CUSTOMER_PROFILE,
    SET_CONFIRMED_CUSTOMERS,
    SET_REJECTED_CUSTOMERS,
    SET_SUSPENDED_CUSTOMERS,
    SET_CUSTOMERS_WITHOUT_PROFILE,
    SET_CUSTOMER_STATUS,
    SET_CUSTOMER_STATS,
    SET_CUSTOMER,
    SET_BUYER,
    SET_CUSTOMERS,
    SET_CUSTOMER_MSG,
    HIDE_PHONE_NUMBER,
    SHOW_PHONE_NUMBER,
    // APPROVE_ID_START,
    // APPROVE_ID_STOP,
    FETCHING_ID_START,
    FETCHING_ID_STOP,
    SET_NEW_CUSTOMERS,
    SET_CUSTOMER_LISTING_COUNT,
    SET_CUSTOMER_VOLUME_COUNT,
    FETCHING_START,
    FETCHING_STOP,
    SET_EMAIL,
    GET_ERRORS,
    CLEAR_IDCHECK_DATA,
    CLEAR_PROFILE_DATA,
} from "./types";
import extractIdDetails from "../utils/extractIdDetails";

const { APPROVED } = ID_STATUS;
const API = `${process.env.REACT_APP_BACKEND_API}`;
const api = `${API}/Customer`;
const admin = `${API}/Admin`;

export const createCustomer = (customer, navigate) => async (dispatch) => {
    try {
        const res = await axios.post(`${api}/CompleteOnboarding`, customer);
        setAuthToken(res.data.data.token);
        navigate(SETUP_2FA);
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getCustomerInformation = () => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.get(`${api}/CustomerInformation`);
        dispatch({
            type: SET_CUSTOMER_PROFILE,
            payload: res.data.data,
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

const handleNextStep = async (
    res,
    navigate,
    dispatch,
    { Username, EmailAddress, Password } = null
) => {
    const { nextStep } = res.data.data;

    switch (nextStep) {
        case FILL_FORM1:
            try {
                await axios.post(`${api}/CreateProfile`, {
                    Username,
                    EmailAddress,
                    Password,
                });
                return dispatch({
                    type: SET_CUSTOMER_MSG,
                    payload:
                        "A verification link has been sent to your email address. Verify your email to proceed.",
                });
            } catch (err) {
                return handleError(err, dispatch);
            }

        case EMAIL_VERIFICATION:
            try {
                return dispatch({
                    type: SET_CUSTOMER_MSG,
                    payload:
                        "A verification link has been sent to your email address. Verify your email to proceed.",
                });
            } catch (err) {
                return handleError(err, dispatch);
            }

        case GOTO_2FA:
            setAuthToken(res.data.data.token);
            return navigate(SETUP_2FA);

        case PROCEED_TO_LOGIN:
            dispatch({
                type: GET_ERRORS,
                payload: {
                    msg: `${EmailAddress} Email has been linked to a profile. Please login to continue`,
                },
            });
            return navigate(LOGIN);

        default:
            return;
    }
};

export const registerCustomer =
    ({ EmailAddress, Username, Password }, navigate) =>
    async (dispatch) => {
        try {
            const res = await axios.get(
                `${api}/Available/username/${Username}/email/${EmailAddress}`
            );
            const {
                generatedUsernames,
                message,
                isEmailAvailable,
                isUsernameAvailable,
            } = res.data.data;

            if (isUsernameAvailable) {
                dispatch({
                    type: GET_ERRORS,
                    payload: {
                        usernameAvailable: true,
                    },
                });
                return handleNextStep(res, navigate, dispatch, {
                    EmailAddress,
                    Username,
                    Password,
                });
            } else {
                return dispatch({
                    type: GET_ERRORS,
                    payload: {
                        msg: message,
                        usernames: generatedUsernames,
                        usernameAvailable: isUsernameAvailable,
                        emailAvailable: isEmailAvailable,
                        Username: message,
                    },
                });
            }
        } catch (err) {
            return handleError(err, dispatch);
        }
    };

export const verifyEmail =
    ({ externalid, token }) =>
    async (dispatch) => {
        try {
            const res = await axios.post(
                `${api}/CompleteEmailVerification/externalid/${externalid}/token/${token}`
            );
            setAuthToken(res.data.data.token);
            batch(() => {
                dispatch({
                    type: SET_CURRENT_CUSTOMER,
                    payload: res.data.data,
                });
                dispatch({
                    type: SET_EMAIL,
                    payload: res.data.data.emailAddress,
                });
                dispatch({
                    type: SET_CUSTOMER_MSG,
                    payload:
                        "Email successfully verified. Welcome to FXBLOOMS.",
                });
            });
        } catch (err) {
            return handleError(err, dispatch);
        }
    };

export const login = (data, navigate) => async (dispatch) => {
    try {
        const res = await axios.post(`${api}/Login`, data);
        const { token } = res.data.data;
        setAuthToken(token);
        dispatch({
            type: SET_CURRENT_CUSTOMER,
            payload: res.data.data,
        });
        return navigate(DASHBOARD_HOME);
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const externalLogin = (data, navigate) => async (dispatch) => {
    try {
        const res = await axios.post(`${api}/ExternalLogin`, data);
        const { authResponse, isLinkedToProfile } = res.data.data;
        setAuthToken(authResponse.token);
        dispatch({
            type: SET_CURRENT_CUSTOMER,
            payload: authResponse,
        });
        return isLinkedToProfile ? navigate(DASHBOARD_HOME) : navigate(ADD_USERNAME, { addUsername: true });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const addUsername = (username, navigate) => async (dispatch) => {
    try {
        const res = await axios.post(`${api}/AddUserName`, { username });
        const { token } = res.data.data;
        setAuthToken(token);
        dispatch({
            type: SET_CURRENT_CUSTOMER,
            payload: res.data.data,
        });
        return navigate(DASHBOARD_HOME);
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getCustomerStats = () => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.get(`${api}/GetCustomerStats`);
        dispatch({
            type: SET_CUSTOMER_STATS,
            payload: res.data.data,
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const fetchStart = () => ({
    type: FETCHING_START,
});

export const getCustomers = (query) => async (dispatch) => {
    try {
        // Issue admin token
        await reIssueAdminToken();
        dispatch(fetchStart());
        const res = await axios.post(`${api}/GetAllCustomers`, query);
        dispatch({
            type: SET_CUSTOMERS,
            payload: res.data.data,
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getCustomer =
    (customerId, buyer = "") =>
    async (dispatch) => {
        try {
            // Issue admin token
            await reIssueAdminToken();
            const res = await axios.get(`${api}/GetCustomer/${customerId}`);
            return dispatch({
                type: !!buyer ? SET_BUYER : SET_CUSTOMER,
                payload: res.data.data,
            });
        } catch (err) {
            return handleError(err, dispatch);
        }
    };

export const getCustomerStatus = (customerId) => async (dispatch) => {
    try {
        // Issue admin token
        await reIssueAdminToken();
        const res = await axios.get(`${api}/GetCustomer/${customerId}`);
        return dispatch({
            type: SET_CUSTOMER,
            payload: res.data.data,
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getNewCustomers = (query) => async (dispatch) => {
    try {
        // Issue admin token
        await reIssueAdminToken();
        dispatch(fetchStart());
        const res = await axios.post(
            `${api}/GetCustomersAwaitingConfirmation/`,
            query
        );
        return dispatch({
            type: SET_NEW_CUSTOMERS,
            payload: res.data.data,
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getRejectedCustomers = (query) => async (dispatch) => {
    try {
        // Issue admin token
        await reIssueAdminToken();
        dispatch(fetchStart());
        const res = await axios.post(`${api}/GetRejectedCustomers/`, query);
        return dispatch({
            type: SET_REJECTED_CUSTOMERS,
            payload: res.data.data,
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getVerifiedCustomers = (query) => async (dispatch) => {
    try {
        // Issue admin token
        await reIssueAdminToken();
        dispatch(fetchStart());
        const res = await axios.post(`${api}/GetConfirmedCustomers/`, query);
        return dispatch({
            type: SET_CONFIRMED_CUSTOMERS,
            payload: res.data.data,
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getCustomersWithoutProfile = (query) => async (dispatch) => {
    try {
        // Issue admin token
        await reIssueAdminToken();
        dispatch(fetchStart());
        const res = await axios.post(`${api}/GetCustomersWithNoProfile`, query);
        return dispatch({
            type: SET_CUSTOMERS_WITHOUT_PROFILE,
            payload: res.data.data,
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getSuspendedCustomers = (query) => async (dispatch) => {
    try {
        // Issue admin token
        await reIssueAdminToken();
        dispatch(fetchStart());
        const res = await axios.post(`${api}/GetSuspendedCustomers`, query);
        return dispatch({
            type: SET_SUSPENDED_CUSTOMERS,
            payload: res.data.data,
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getSeller = (sellerId) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.get(`${api}/Seller/${sellerId}`);
        return dispatch({
            type: SET_CUSTOMER,
            payload: res.data.data,
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const reportSeller = (message) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.post(`${api}/ReportSeller`, message);
        return dispatch({
            type: SET_CUSTOMER_MSG,
            payload: res.data.data,
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const setCustomerStatus =
    ({ customerID, newStatus, currentStatus, isPersonal = false }) =>
    async (dispatch) => {
        try {
            // Issue admin token
            await reIssueAdminToken();
            dispatch(fetchStart());
            const res = await axios.post(
                `${api}/CustomerStatus?customerID=${customerID}&status=${newStatus}`
            );
            // console.log("res", res);
            const msg = res.data.data;
            batch(() => {
                dispatch({
                    type: SET_CUSTOMER_STATUS,
                    payload: {
                        customerID,
                        newStatus,
                        currentStatus,
                        msg,
                        isPersonal,
                    },
                });
                dispatch({
                    type: FETCHING_STOP,
                });
            });
            return await axios.get(`${API}/admin/GetAppStatistics`);
        } catch (err) {
            return handleError(err, dispatch);
        }
    };

export const setHidePhoneNumber = () => async (dispatch) => {
    try {
        await Promise.all([
            reIssueCustomerToken(),
            axios.post(`${api}/ShowPhoneNumber/status/false`),
        ]);
        return dispatch({ type: HIDE_PHONE_NUMBER });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const setShowPhoneNumber = () => async (dispatch) => {
    try {
        await Promise.all([
            reIssueCustomerToken(),
            axios.post(`${api}/ShowPhoneNumber/status/true`),
        ]);
        return dispatch({ type: SHOW_PHONE_NUMBER });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const forgotPassword = (email) => async (dispatch) => {
    try {
        await axios.post(`${api}/GenerateResetToken?email=${email}`);
        return dispatch({
            type: SET_CUSTOMER_MSG,
            payload: "A magic link has been sent to your email",
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const resetPassword = (data) => async (dispatch) => {
    try {
        await axios.post(`${api}/ResetPassword`, data);
        return dispatch({
            type: SET_CUSTOMER_MSG,
            payload: "A new passwod has been set",
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const updateProfile = (data) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.post(`${api}/UpdateProfile`, data);
        return dispatch({
            type: PROFILE_UPDATED,
            payload: res.data.data,
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const sendMail = (data) => async (dispatch) => {
    try {
        const res = await axios.post(`${api}/SendMail`, data);
        return dispatch({
            type: SET_CUSTOMER_MSG,
            payload: res.data.data,
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const fetchIdsStart = () => ({
    type: FETCHING_ID_START,
});

// export const approveIdStart = () => ({
//     type: APPROVE_ID_START
// })

export const fetchIdsStop = () => ({
    type: FETCHING_ID_STOP,
});

export const getIdCardValidationResponse = (customerId) => async (dispatch) => {
    try {
        await reIssueAdminToken();
        dispatch(fetchIdsStart());
        const res = await axios.get(
            `${api}/GetIDCardValidationResponse/id/${customerId}`
        );
        const data = JSON.parse(res.data.data);
        const customerData = extractIdDetails(
            data.servicesResults.docCheck.extracted.ocr.$values,
            {
                idFront:
                    data.servicesResults.docCheck.extracted.images.$values[0]
                        .content,
                idBack: data.servicesResults.docCheck.extracted.images
                    .$values[1].content,
                status: data.overallResult.status,
            }
        );

        // const customerData = {
        //     documentNumber: data.servicesResults.docCheck.extracted.ocr.$values[0].content,
        //     expiryDate: data.servicesResults.docCheck.extracted.ocr.$values[1].content,
        //     dateOfIssue: data.servicesResults.docCheck.extracted.ocr.$values[2].content,
        //     dateOfBirth: data.servicesResults.docCheck.extracted.ocr.$values[3].content,
        //     lastName: data.servicesResults.docCheck.extracted.ocr.$values[4].content,
        //     firstName: data.servicesResults.docCheck.extracted.ocr.$values[5].content,
        //     middleName: data.servicesResults.docCheck.extracted.ocr.$values[5].content,
        //     documentType: data.servicesResults.docCheck.extracted.ocr.$values[16].content,
        //     issueCountry: data.servicesResults.docCheck.extracted.ocr.$values[17].content,

        //     idFront:  data.servicesResults.docCheck.extracted.images.$values[0].content,
        //     idBack: data.servicesResults.docCheck.extracted.images.$values[1].content,

        //     status: data.overallResult.status
        // };
        // console.log(res.data.data);
        batch(() => {
            dispatch({
                type: SET_ID_CHECK_DATA,
                payload: customerData,
            });
            dispatch({
                type: FETCHING_ID_STOP,
            });
        });
    } catch (err) {
        dispatch({
            type: CLEAR_IDCHECK_DATA,
        });
        return handleError(err, dispatch);
    }
};

export const getResidencePermitValidationResponse =
    (customerId) => async (dispatch) => {
        try {
            await reIssueAdminToken();
            dispatch(fetchIdsStart());
            const res = await axios.get(
                `${api}/GetResidencePermitValidationResponse/id/${customerId}`
            );
            const data = JSON.parse(res.data.data);
            const customerData = extractIdDetails(
                data.servicesResults.docCheck.extracted.ocr.$values,
                {
                    idFront:
                        data.servicesResults.docCheck.extracted.images
                            .$values[0].content,
                    idBack: data.servicesResults.docCheck.extracted.images
                        .$values[1].content,
                    status: data.overallResult.status,
                }
            );
            // const customerData = {
            //     documentNumber: data.servicesResults.docCheck.extracted.ocr.$values[0].content,
            //     expiryDate: data.servicesResults.docCheck.extracted.ocr.$values[1].content,
            //     dateOfIssue: data.servicesResults.docCheck.extracted.ocr.$values[2].content,
            //     dateOfBirth: data.servicesResults.docCheck.extracted.ocr.$values[3].content,
            //     lastName: data.servicesResults.docCheck.extracted.ocr.$values[5].content,
            //     firstName: data.servicesResults.docCheck.extracted.ocr.$values[6].content,
            //     documentType: data.servicesResults.docCheck.extracted.ocr.$values[22].content,
            //     issueCountry: data.servicesResults.docCheck.extracted.ocr.$values[23].content,

            //     idFront:  data.servicesResults.docCheck.extracted.images.$values[0].content,
            //     idBack: data.servicesResults.docCheck.extracted.images.$values[1].content,

            //     status: data.overallResult.status
            // };
            console.log(customerData);
            batch(() => {
                dispatch({
                    type: SET_PROFILE_CHECK_DATA,
                    payload: customerData,
                });
                dispatch({
                    type: FETCHING_ID_STOP,
                });
            });
        } catch (err) {
            dispatch({
                type: CLEAR_PROFILE_DATA,
            });
            return handleError(err, dispatch);
        }
    };

export const approveIdCard =
    (customerId, currentStatus) => async (dispatch) => {
        try {
            await Promise.all([
                await reIssueAdminToken(),
                await axios.post(`${api}/ApproveIDCard`, {
                    customerId,
                    status: APPROVED,
                }),
            ]);
            dispatch({
                type: ACCEPTED_CUSTOMER_ID,
                payload: {
                    customerId,
                    currentStatus,
                },
            });
        } catch (err) {
            return handleError(err, dispatch);
        }
    };

export const approveResidencePermit =
    (customerId, currentStatus) => async (dispatch) => {
        try {
            await Promise.all([
                reIssueAdminToken(),
                axios.post(`${api}/ApproveResidencePermit`, {
                    customerId,
                    status: APPROVED,
                }),
            ]);
            dispatch({
                type: ACCEPTED_CUSTOMER_RESIDENCE_PERMIT,
                payload: {
                    customerId,
                    currentStatus,
                },
            });
        } catch (err) {
            return handleError(err, dispatch);
        }
    };

export const logout = (navigate, msg) => (dispatch) => {
    setAuthToken(null);
    dispatch({ type: RESET_STORE });
    sessionStorage.removeItem(SESSION_TIME);
    return navigate(LOGIN, { state: { msg } });
};

export const subscribeToNewsletter = (email) => async (dispatch) => {
    try {
        await axios.post(`${API}/Subscription/CreateSubscription`, {
            email,
            isCurrentlySubscribed: true,
        });
        return dispatch({
            type: SET_CUSTOMER_MSG,
            payload: "Thanks for subscribing to FXBLOOMS newsletter.",
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getCustomerListingCounts = (customerId) => async (dispatch) => {
    try {
        const promises = [
            reIssueAdminToken(),
            axios.get(`${admin}/GetUserDeletedListingCount?customerId=${customerId}`),
            axios.get(`${admin}/GetUserCompletedListingCount?customerId=${customerId}`),
            axios.get(`${admin}/GetUserTotalListingCount?customerId=${customerId}`),
            axios.get(`${admin}/GetUserActiveListingCount?customerId=${customerId}`),
            axios.get(`${admin}/GetUserListingInProgressCount?customerId=${customerId}`)
        ];
        
        // eslint-disable-next-line no-unused-vars
        const [_, deletedListingCount, completedListingCount, totalListingCount, activeListingCount, inProgressListingCount] = await Promise.all(promises);
        dispatch({
            type: SET_CUSTOMER_LISTING_COUNT,
            payload: {
                deletedListingCount: deletedListingCount.data.data.data,
                completedListingCount: completedListingCount.data.data.data,
                totalListingCount: totalListingCount.data.data.data,
                activeListingCount: activeListingCount.data.data.data,
                inProgressListingCount: inProgressListingCount.data.data.data,
            },
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getCustomerVolumeCounts = (customerId) => async (dispatch) => {
    try {
        await reIssueAdminToken();
        const buyCount = await axios.get(
            `${admin}/GetCustomerBuyVolume?customerId=${customerId}`
        );

        const sellCount = await axios.get(
            `${admin}/GetCustomerSellVolume?customerId=${customerId}`
        );

        const sellAvgCount = await axios.get(
            `${admin}/GetUserSellAverage?customerId=${customerId}`
        );
        const buyAvgCount = await axios.get(
            `${admin}/GetUserBuyAverage?customerId=${customerId}`
        );

        dispatch({
            type: SET_CUSTOMER_VOLUME_COUNT,
            payload: {
                buyCount: buyCount.data.data.data,
                sellCount: sellCount.data.data.data,
                sellAvgCount: sellAvgCount.data.data.data,
                buyAvgCount: buyAvgCount.data.data.data,
            },
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};
