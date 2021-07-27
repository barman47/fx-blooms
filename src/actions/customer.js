import axios from 'axios';

import { API, CONFIRMED, PENDING, REJECTED } from '../utils/constants';
import handleError from '../utils/handleError';
// import reIssueToken from '../utils/reIssueToken';
import setAuthToken from '../utils/setAuthToken';

import { 
    SET_CURRENT_CUSTOMER, 
    SET_CUSTOMER_PROFILE,
    SET_CUSTOMERS,
    SET_CUSTOMER_STATUS,
    SET_CUSTOMER,
    SET_CUSTOMER_MSG
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

export const addResidentPermit = (data) => async (dispatch) => {
    try {
        const res = await axios.post(`${api}/AddResidencePermit`, data);
        console.log(res);
        // dispatch({
        //     type: SET_CURRENT_CUSTOMER,
        //     payload: { ...res.data.data, timeGenerated: res.data.timeGenerated }
        // });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getCustomers = () => async (dispatch) => {
    try {
        // await reIssueToken();
        const res = await axios.post(`${api}/GetAllCustomers`, { pageSize: 0, pageNumber: 0 });
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

export const getSeller = (sellerId) => async(dispatch) => {
    try {
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
        // await reIssueToken();
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

export const logout = (history) => dispatch => {
    dispatch({});
    history.push('/');
};