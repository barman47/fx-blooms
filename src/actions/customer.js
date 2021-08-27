import axios from 'axios';
import { batch } from 'react-redux';

import { CREATE_PROFILE, LOGIN, SETUP_2FA, SIGN_UP } from '../routes';
import { 
    API,
    SETUP_2FA as GOTO_2FA,
    EMAIL_VERIFICATION,
    PROCEED_TO_LOGIN,
    PROCEED_TO_DASHBOARD,
    FILL_FORM1,
    FILL_FORM2,
} from '../utils/constants';
import handleError from '../utils/handleError';
import reIssueToken from '../utils/reIssueToken';
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
    SET_CUSTOMER_STATUS,
    SET_CUSTOMER_STATS,
    SET_CUSTOMER,
    SET_CUSTOMER_MSG,
    HIDE_PHONE_NUMBER,
    SHOW_PHONE_NUMBER,
    SET_NEW_CUSTOMERS,
    SET_MORE_NEW_CUSTOMERS,
    SET_RESIDENCE_PERMIT,
    SET_PERMIT_URL,
    // eslint-disable-next-line
    GET_ERRORS,
    SET_EMAIL
 } from './types';

const api = `${API}/Customer`;

export const getMe = (history) => async (dispatch) => {
    try {} catch (err) {
        return handleError(err, dispatch);
    }
};

export const createCustomer = (customer, history) => async (dispatch) => {
    try {
        const res = await axios.post(`${api}/CompleteOnboarding`, customer);
        console.log(res);
        setAuthToken(res.data.data.token);
        history.push(SETUP_2FA);
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getCustomerInformation = () => async (dispatch) => {
    try {
        // await reIssueToken();
        const res = await axios.get(`${api}/CustomerInformation`);
        dispatch({
            type: SET_CUSTOMER_PROFILE,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const registerCustomer = ({EmailAddress, Username, Password}, history) => async (dispatch) => {
    try {
        const res = await axios.get(`${api}/Available/username/${Username}/email/${EmailAddress}`);
        console.log(res);
        const { nextStep } = res.data.data;

        switch (nextStep) {
            case FILL_FORM1:
                await axios.post(`${api}/CreateProfile`, { Username, EmailAddress, Password });
                return dispatch({
                    type: SET_CUSTOMER_MSG,
                    payload: 'A verification link has been sent to your email address. Verify your email to proceed.'
                });

            case FILL_FORM2:
                const email = res.data.data.message[0].split(' ')[0];
                dispatch({ type: SET_EMAIL, payload: email });
                return history.push(CREATE_PROFILE, { verifiedEmail: true });

            case EMAIL_VERIFICATION:
                return dispatch({
                    type: SET_CUSTOMER_MSG,
                    payload: 'A verification link has been sent to your email address. Verify your email to proceed.'
                });

            case GOTO_2FA:
                setAuthToken(res.data.data.token);
                return history.push(SETUP_2FA);

            case PROCEED_TO_LOGIN:
                return history.push(LOGIN);

            default:
                return;
        }

    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const verifyEmail = ({ externalid, token }) => async (dispatch) => {
    try {
        const res = await axios.post(`${api}/CompleteEmailVerification/externalid/${externalid}/token/${token}`);
        console.log(res);
        batch(() => {
            dispatch({
                type: SET_EMAIL,
                payload: res.data.data.emailAddress
            });
            dispatch({
                type: SET_CUSTOMER_MSG,
                payload: 'Your email has been verified successfully. Please proceed to complete your profile.'
            });
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getIdVerificationLink = () => async (dispatch) => {
    try {
        const res = await axios.get(`${api}/IDCardVerificationLink`);
        return dispatch({
            type: SET_ID_VERIFICATION_LINK,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

// export const registerCustomer = (username, email) => async (dispatch) => {
//     try {
//         const res = await axios.get(`${api}/Available/username/${username}/email/${email}`);
//         const { generatedUsernames, message, isEmailAvailable, isUsernameAvailable } = res.data.data;

//         if (isEmailAvailable && isUsernameAvailable) {
//             dispatch({
//                 type: GET_ERRORS,
//                 payload: {
//                     usernameAvailable: true
//                 }
//             });
//         } else {
//             dispatch({
//                 type: GET_ERRORS,
//                 payload: {
//                     msg: message,
//                     usernames: generatedUsernames,
//                     usernameAvailable: isUsernameAvailable,
//                     emailAvailable: isEmailAvailable,
//                     Username: message
//                 }
//             });
//         }
//     } catch (err) {
//         return handleError(err, dispatch);
//     }
// };

export const login = (data, history) => async (dispatch) => {
    try {
        const res = await axios.post(`${api}/login`, data);
        const { nextStep } = res.data.data;

        switch (nextStep) {
        case PROCEED_TO_DASHBOARD:
                setAuthToken(res.data.data.token);
                dispatch({
                    type: SET_CURRENT_CUSTOMER,
                    payload: { ...res.data.data, timeGenerated: res.data.timeGenerated }
                });
                break;

            case FILL_FORM1:
                history.push(SIGN_UP);
                break;

            default: 
                break;
        }

        
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getCustomerStats = () => async (dispatch) => {
    try {
        console.log('getting customer stats');
        const res = await axios.get(`${api}/GetCustomerStats`);
        console.log(res);
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
        // await reIssueToken();
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

// export const getCustomers = () => async (dispatch) => {
//     try {
//         // await reIssueToken();
//         const res = await axios.post(`${api}/GetAllCustomers`, { pageSize: 10, pageNumber: 1 });
//         const { items, ...rest } = res.data.data;
//         const confirmed = [];
//         const pending = [];
//         const rejected = [];
//         items.forEach(customer => {
//             switch (customer.customerStatus) {
//                 case CONFIRMED:
//                     confirmed.push(customer);
//                     break;

//                 case PENDING:
//                     pending.push(customer);
//                     break;

//                 case REJECTED:
//                     rejected.push(customer);
//                     break;

//                 default:
//                     break;
//             }
//         });
//         dispatch({
//             type: SET_CUSTOMERS,
//             payload: {
//                 confirmed,
//                 pending,
//                 rejected,
//                 count: items.length,
//                 ...rest
//             }
//         });
//     } catch (err) {
//         return handleError(err, dispatch);
//     }
// };

export const getCustomer = (customerId) => async(dispatch) => {
    try {
        // Issue admin token
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
        const res = await axios.get(`${api}/GetCustomer/${customerId}`);
        console.log(res);
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
        const res = await axios.post(`${api}/GetConfirmedCustomers/`, query);
        return dispatch({
            type: SET_MORE_CONFIRMED_CUSTOMERS,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getSeller = (sellerId) => async(dispatch) => {
    try {
        await reIssueToken();
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
        await reIssueToken();
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
        await reIssueToken();
        await axios.post(`${api}/ShowPhoneNumber/status/false`);
        dispatch({ type: HIDE_PHONE_NUMBER });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const setShowPhoneNumber = () => async (dispatch) => {
    try {
        await reIssueToken();
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

export const logout = (history) => dispatch => {
    setAuthToken(null);
    dispatch({ type: RESET_STORE });
    history.push(LOGIN);
};