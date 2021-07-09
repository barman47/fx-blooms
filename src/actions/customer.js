import axios from 'axios';

import { API, CONFIRMED, PENDING, REJECTED } from '../utils/constants';
import { DASHBOARD, DASHBOARD_HOME } from '../routes';
import handleError from '../utils/handleError';
import setAuthToken from '../utils/setAuthToken';
import { 
    SET_CURRENT_CUSTOMER, 
    SET_CUSTOMER_PROFILE,
    SET_CUSTOMERS,
    SET_CUSTOMER_STATUS
 } from './types';

const api = `${API}/Customer`;

export const getMe = (history) => async (dispatch) => {
    try {} catch (err) {
        return handleError(err, dispatch);
    }
};

export const reIssueToken = (history) => async (dispatch) => {
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
        const res = await axios.get(`${api}/CustomerInformation`);
        dispatch({
            type: SET_CUSTOMER_PROFILE,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const login = (data, history) => async (dispatch) => {
    try {
        const res = await axios.post(`${api}/login`, data);
        const { token } = res.data.data;
        setAuthToken(token);
        dispatch({
            type: SET_CURRENT_CUSTOMER,
            payload: { ...res.data.data, timeGenerated: res.data.timeGenerated }
        });
        history.push(`${DASHBOARD}${DASHBOARD_HOME}`);
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getCustomers = () => async (dispatch) => {
    try {
        const res = await axios.get(`${api}/GetAll`);
        const { result } = res.data.data;
        const confirmed = [];
        const pending = [];
        const rejected = [];
        result.forEach(customer => {
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
                count: result.length
            }
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const setCustomerStatus = ({ customerID, status, currentStatus }) => async (dispatch) => {
    try {
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