import axios from 'axios';

import { API } from '../utils/constants';
import { DASHBOARD, DASHBOARD_HOME } from '../routes';
import handleError from '../utils/handleError';
import setAuthToken from '../utils/setAuthToken';
import { SET_CURRENT_CUSTOMER, SET_CUSTOMER_PROFILE } from './types';

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