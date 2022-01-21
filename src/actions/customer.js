import axios from 'axios';
import { batch } from 'react-redux';

import { DASHBOARD_HOME, LOGIN, SETUP_2FA } from '../routes';
import { ACCEPTED_CUSTOMER_ID, ACCEPTED_CUSTOMER_RESIDENCE_PERMIT, PROFILE_UPDATED, SET_ID_CHECK_DATA, SET_PROFILE_CHECK_DATA } from './types';
import { 
    API,
    SETUP_2FA as GOTO_2FA,
    EMAIL_VERIFICATION,
    PROCEED_TO_LOGIN,
    // PROCEED_TO_DASHBOARD,
    ID_STATUS,
    FILL_FORM1
} from '../utils/constants';
import handleError from '../utils/handleError';
import reIssueCustomerToken from '../utils/reIssueCustomerToken';
import reIssueAdminToken from '../utils/reIssueAdminToken';
import setAuthToken from '../utils/setAuthToken';

import { 
    RESET_STORE,
    SET_ID_VERIFICATION_LINK,
    SET_CURRENT_CUSTOMER, 
    SET_CUSTOMER_PROFILE,
    SET_CONFIRMED_CUSTOMERS,
    SET_MORE_CONFIRMED_CUSTOMERS,
    SET_REJECTED_CUSTOMERS,
    SET_MORE_REJECTED_CUSTOMERS,
    SET_SUSPENDED_CUSTOMERS,
    SET_MORE_SUSPENDED_CUSTOMERS,
    SET_CUSTOMERS_WITHOUT_PROFILE,
    SET_MORE_CUSTOMERS_WITHOUT_PROFILE,
    SET_CUSTOMER_STATUS,
    SET_CUSTOMER_STATS,
    SET_CUSTOMER,
    SET_CUSTOMERS,
    SET_MORE_CUSTOMERS,
    SET_CUSTOMER_MSG,
    HIDE_PHONE_NUMBER,
    SHOW_PHONE_NUMBER,
    SET_NEW_CUSTOMERS,
    SET_MORE_NEW_CUSTOMERS,
    SET_RESIDENCE_PERMIT,
    SET_PERMIT_URL,
    SET_EMAIL,
    GET_ERRORS
 } from './types';

 const { APPROVED } = ID_STATUS;

const api = `${API}/Customer`;

export const createCustomer = (customer, history) => async (dispatch) => {
    try {
        const res = await axios.post(`${api}/CompleteOnboarding`, customer);
        setAuthToken(res.data.data.token);
        history.push(SETUP_2FA);
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
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

const handleNextStep = async (res, history, dispatch, { Username, EmailAddress, Password } = null) => {
    const { nextStep } = res.data.data;

    switch (nextStep) {
        case FILL_FORM1:
            try {
                await axios.post(`${api}/CreateProfile`, { Username, EmailAddress, Password });
                return dispatch({
                    type: SET_CUSTOMER_MSG,
                    payload: 'A verification link has been sent to your email address. Verify your email to proceed.'
                });
            } catch (err) {
                return handleError(err, dispatch);
            }

        case EMAIL_VERIFICATION:
            try {
                return dispatch({
                    type: SET_CUSTOMER_MSG,
                    payload: 'A verification link has been sent to your email address. Verify your email to proceed.'
                });
            } catch (err) {
                return handleError(err, dispatch);
            }

        case GOTO_2FA:
            setAuthToken(res.data.data.token);
            return history.push(SETUP_2FA);

        case PROCEED_TO_LOGIN:
            dispatch({
                type: GET_ERRORS,
                payload: { msg: `${EmailAddress} Email has been linked to a profile. Please login to continue` }
            });
            return history.push(LOGIN);

        default:
            return;
    }
};

export const registerCustomer = ({ EmailAddress, Username, Password }, history) => async (dispatch) => {
    try {
        const res = await axios.get(`${api}/Available/username/${Username}/email/${EmailAddress}`);
        const { generatedUsernames, message, isEmailAvailable, isUsernameAvailable } = res.data.data;

        if (isUsernameAvailable) {
            dispatch({
                type: GET_ERRORS,
                payload: {
                    usernameAvailable: true
                }
            });
            return handleNextStep(res, history, dispatch, { EmailAddress, Username, Password });
        } else {
            return dispatch({
                type: GET_ERRORS,
                payload: {
                    msg: message,
                    usernames: generatedUsernames,
                    usernameAvailable: isUsernameAvailable,
                    emailAvailable: isEmailAvailable,
                    Username: message
                }
            });
        }

    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const verifyEmail = ({ externalid, token }) => async (dispatch) => {
    try {
        const res = await axios.post(`${api}/CompleteEmailVerification/externalid/${externalid}/token/${token}`);
        setAuthToken(res.data.data.token);
        batch(() => {
            dispatch({
                type: SET_CURRENT_CUSTOMER,
                payload: res.data.data
            });
            dispatch({
                type: SET_EMAIL,
                payload: res.data.data.emailAddress
            });
            dispatch({
                type: SET_CUSTOMER_MSG,
                payload: 'Email successfully verified. Welcome to FXBLOOMS.'
            });
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getIdVerificationLink = () => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.get(`${api}/IDCardVerificationLink`);
        return dispatch({
            type: SET_ID_VERIFICATION_LINK,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const login = (data, history, userLocation) => async (dispatch) => {
    try {
        const res = await axios.post(`${api}/login`, data, {
            headers: {
                'Location': JSON.stringify(userLocation)
            }
        });
        const {  token } = res.data.data;
        setAuthToken(token);
        dispatch({
            type: SET_CURRENT_CUSTOMER,
            payload: res.data.data
        });
        return history.push(DASHBOARD_HOME);
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
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getResidencePermitLink = () => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.get(`${api}/GetLinkForResidencePermitUpload`);
        dispatch({
            type: SET_PERMIT_URL,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const addResidentPermit = (data) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.post(`${api}/AddResidencePermit`, data);
        dispatch({
            type: SET_CUSTOMER_MSG,
            payload: res.data.data
        });
        dispatch({
            type: SET_RESIDENCE_PERMIT,
            payload: true
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getCustomers = (query) => async (dispatch) => {
    try {
        // Issue admin token
        await reIssueAdminToken();
        const res = await axios.post(`${api}/GetAllCustomers`, query);
        dispatch({
            type: SET_CUSTOMERS,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getMoreCustomers = (query) => async (dispatch) => {
    try {
        // Issue admin token
        await reIssueAdminToken();
        const res = await axios.post(`${api}/GetAllCustomers`, query);
        dispatch({
            type: SET_MORE_CUSTOMERS,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getCustomer = (customerId) => async(dispatch) => {
    try {
        // Issue admin token
        await reIssueAdminToken();
        const res = await axios.get(`${api}/GetCustomer/${customerId}`);
        return dispatch({
            type: SET_CUSTOMER,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getCustomerStatus = (customerId) => async(dispatch) => {
    try {
        // Issue admin token
        await reIssueAdminToken();
        const res = await axios.get(`${api}/GetCustomer/${customerId}`);
        return dispatch({
            type: SET_CUSTOMER,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getNewCustomers = (query) => async(dispatch) => {
    try {
        // Issue admin token
        await reIssueAdminToken();
        const res = await axios.post(`${api}/GetCustomersAwaitingConfirmation/`, query);
        return dispatch({
            type: SET_NEW_CUSTOMERS,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getMoreNewCustomers = (query) => async(dispatch) => {
    try {
        // Issue admin token
        await reIssueAdminToken();
        const res = await axios.post(`${api}/GetCustomersAwaitingConfirmation/`, query);
        return dispatch({
            type: SET_MORE_NEW_CUSTOMERS,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getRejectedCustomers = (query) => async(dispatch) => {
    try {
        // Issue admin token
        await reIssueAdminToken();
        const res = await axios.post(`${api}/GetRejectedCustomers/`, query);
        return dispatch({
            type: SET_REJECTED_CUSTOMERS,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getMoreRejectedCustomers = (query) => async(dispatch) => {
    try {
        // Issue admin token
        await reIssueAdminToken();
        const res = await axios.post(`${api}/GetRejectedCustomers/`, query);
        return dispatch({
            type: SET_MORE_REJECTED_CUSTOMERS,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getVerifiedCustomers = (query) => async(dispatch) => {
    try {
        // Issue admin token
        await reIssueAdminToken();
        const res = await axios.post(`${api}/GetConfirmedCustomers/`, query);
        return dispatch({
            type: SET_CONFIRMED_CUSTOMERS,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getMoreVerifiedCustomers = (query) => async(dispatch) => {
    try {
        // Issue admin token
        await reIssueAdminToken();
        const res = await axios.post(`${api}/GetConfirmedCustomers/`, query);
        return dispatch({
            type: SET_MORE_CONFIRMED_CUSTOMERS,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getCustomersWithoutProfile = (query) => async(dispatch) => {
    try {
        // Issue admin token
        await reIssueAdminToken();
        const res = await axios.post(`${api}/GetCustomersWithNoProfile`, query);
        console.log(res);
        return dispatch({
            type: SET_CUSTOMERS_WITHOUT_PROFILE,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getMoreCustomersWithoutProfile = (query) => async(dispatch) => {
    try {
        // Issue admin token
        await reIssueAdminToken();
        const res = await axios.post(`${api}/GetCustomersWithNoProfile`, query);
        return dispatch({
            type: SET_MORE_CUSTOMERS_WITHOUT_PROFILE,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getSuspendedCustomers = (query) => async(dispatch) => {
    try {
        // Issue admin token
        await reIssueAdminToken();
        const res = await axios.post(`${api}/GetSuspendedCustomers`, query);
        return dispatch({
            type: SET_SUSPENDED_CUSTOMERS,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getMoreSuspendedCustomers = (query) => async(dispatch) => {
    try {
        // Issue admin token
        await reIssueAdminToken();
        const res = await axios.post(`${api}/GetSuspendedCustomers`, query);
        return dispatch({
            type: SET_MORE_SUSPENDED_CUSTOMERS,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getSeller = (sellerId) => async(dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.get(`${api}/Seller/${sellerId}`);
        return dispatch({
            type: SET_CUSTOMER,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const reportSeller = (message) => async(dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.post(`${api}/ReportSeller`, message);
        return dispatch({
            type: SET_CUSTOMER_MSG,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const setCustomerStatus = ({ customerID, status, currentStatus }) => async (dispatch) => {
    try {
        // Issue admin token
        await reIssueAdminToken();
        const res = await axios.post(`${api}/CustomerStatus?customerID=${customerID}&status=${status}`);
        const msg = res.data.data;
        return dispatch({
            type: SET_CUSTOMER_STATUS,
            payload: { customerID, status, currentStatus, msg }
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const setHidePhoneNumber = () => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        await axios.post(`${api}/ShowPhoneNumber/status/false`);
        dispatch({ type: HIDE_PHONE_NUMBER });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const setShowPhoneNumber = () => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        await axios.post(`${api}/ShowPhoneNumber/status/true`);
        dispatch({ type: SHOW_PHONE_NUMBER });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const forgotPassword = (email) => async (dispatch) => {
    try {
        await axios.post(`${api}/GenerateResetToken?email=${email}`);
        return dispatch({
            type: SET_CUSTOMER_MSG,
            payload: 'A magic link has been sent to your email'
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
            payload: 'A new passwod has been set'
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
            payload: res.data.data
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
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getIdCardValidationResponse = (customerId) => async (dispatch) => {
    try {
        await reIssueAdminToken();
        const res = await axios.get(`${api}/GetIDCardValidationResponse/id/${customerId}`,);
        const data = JSON.parse(res.data.data);
        const customerData = {
            firstName: data.application.fields.$values[1].content,
            lastName: data.application.fields.$values[2].content,
            dateOfBirth: data.application.fields.$values[3].content,

            idFront:  data.application.documents.$values[0].files.$values[0].uri,
            idBack: data.application.documents.$values[0].files.$values[1].uri,
            issueCountry: data.application.documents.$values[0].issuingCountry,
            documentType: data.application.documents.$values[0].documentType,

            status: data.overallResult.status
        };
        dispatch({
            type: SET_ID_CHECK_DATA,
            payload: customerData
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getResidencePermitValidationResponse = (customerId) => async (dispatch) => {
    try {
        await reIssueAdminToken();
        const res = await axios.get(`${api}/GetResidencePermitValidationResponse/id/${customerId}`,);
        const data = JSON.parse(res.data.data);
        const customerData = {
            firstName: data.application.fields.$values[1].content,
            lastName: data.application.fields.$values[2].content,
            dateOfBirth: data.application.fields.$values[3].content,

            idFront:  data.application.documents.$values[0].files.$values[0].uri,
            idBack: data.application.documents.$values[0].files.$values[1].uri,
            issueCountry: data.application.documents.$values[0].issuingCountry,
            documentType: data.application.documents.$values[0].documentType,

            status: data.overallResult.status
        };
        dispatch({
            type: SET_PROFILE_CHECK_DATA,
            payload: customerData
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const approveIdCard = (customerId) => async (dispatch) => {
    try {
        await reIssueAdminToken();
        await axios.post(`${api}/ApproveIDCard`, { customerId, status: APPROVED });
        dispatch({
            type: ACCEPTED_CUSTOMER_ID
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};
export const approveResidencePermit = (customerId) => async (dispatch) => {
    try {
        await reIssueAdminToken();
        await axios.post(`${api}/ApproveResidencePermit`, { customerId, status: APPROVED });
        dispatch({
            type: ACCEPTED_CUSTOMER_RESIDENCE_PERMIT,
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const logout = (history) => dispatch => {
    setAuthToken(null);
    dispatch({ type: RESET_STORE });
    return history.push(LOGIN);
};

export const subscribeToNewsletter = (email) => async (dispatch) => {
    try {
        await axios.post(`${API}/Subscription/CreateSubscription`, { email, isCurrentlySubscribed: true });
        return dispatch({
            type: SET_CUSTOMER_MSG,
            payload: 'Thanks for subscribing to FXBLOOMS newsletter.'
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};