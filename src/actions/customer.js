import axios from 'axios';

import { LOGIN } from '../routes';
import { API, CONFIRMED, PENDING, REJECTED } from '../utils/constants';
import handleError from '../utils/handleError';
import reIssueToken from '../utils/reIssueToken';
import setAuthToken from '../utils/setAuthToken';

import { 
    RESET_STORE,
    SET_CURRENT_CUSTOMER, 
    SET_CUSTOMER_PROFILE,
    SET_CUSTOMERS,
    SET_CUSTOMER_STATUS,
    SET_CUSTOMER,
    SET_CUSTOMER_MSG,
    HIDE_PHONE_NUMBER,
    SHOW_PHONE_NUMBER,
    SET_NEW_CUSTOMERS,
    SET_RESIDENCE_PERMIT,
    SET_PERMIT_URL,
    // eslint-disable-next-line
    GET_ERRORS
 } from './types';

const api = `${API}/Customer`;

export const getMe = (history) => async (dispatch) => {
    try {} catch (err) {
        return handleError(err, dispatch);
    }
};

export const createCustomer = (customer) => async (dispatch) => {
    try {
        const res = await axios.post(`${api}/CreateCustomer`, customer);
        const successMessage = res.data.data;
        dispatch({
            type: SET_CURRENT_CUSTOMER,
            payload: { successMessage }
        });
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

export const registerCustomer = (customer) => async (dispatch) => {
    try {
        const res = await axios.post(`${api}/CreateCustomerV2`, customer);
        window.location.href = res.data.data;
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

export const login = (data) => async (dispatch) => {
    try {
        const res = await axios.post(`${api}/login`, data);
        setAuthToken(res.data.data.token);
        return dispatch({
            type: SET_CURRENT_CUSTOMER,
            payload: { ...res.data.data, timeGenerated: res.data.timeGenerated }
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getResidencePermitLink = () => async (dispatch) => {
    try {
        const res = await axios.get(`${api}/GetLinkForResidencePermitUpload`);
        console.log(res);
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

export const getCustomers = () => async (dispatch) => {
    try {
        // await reIssueToken();
        const res = await axios.post(`${api}/GetAllCustomers`, { pageSize: 10, pageNumber: 1 });
        const { items, ...rest } = res.data.data;
        const confirmed = [];
        const pending = [];
        const rejected = [];
        items.forEach(customer => {
            switch (customer.customerStatus) {
                case CONFIRMED:
                    confirmed.push(customer);
                    break;

                case PENDING:
                    pending.push(customer);
                    break;

                case REJECTED:
                    rejected.push(customer);
                    break;

                default:
                    break;
            }
        });
        dispatch({
            type: SET_CUSTOMERS,
            payload: {
                confirmed,
                pending,
                rejected,
                count: items.length,
                ...rest
            }
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getCustomer = (customerId) => async(dispatch) => {
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
        console.log(res);
        return dispatch({
            type: SET_NEW_CUSTOMERS,
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
        const res = await axios.post(`${api}/GenerateResetToken?email=${email}`);
        return dispatch({
            type: SET_CUSTOMER_MSG,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const resetPassword = (data) => async (dispatch) => {
    try {
        const res = await axios.post(`${api}/ResetPassword`, data);
        console.log(res);
        return dispatch({
            type: SET_CUSTOMER_MSG,
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

export const logout = (history) => dispatch => {
    setAuthToken(null);
    dispatch({ type: RESET_STORE });
    history.push(LOGIN);
};