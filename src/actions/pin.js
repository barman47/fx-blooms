import axios from 'axios';
import { batch } from 'react-redux';

import handleError from '../utils/handleError';
import { 
    SETUP_PIN,
    SET_CUSTOMER_MSG
} from './types';
import reIssueCustomerToken from '../utils/reIssueCustomerToken';

const API = `${process.env.REACT_APP_WALLET_API}`;
const URL = `${API}/pin-management`;

export const createPin = (data) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.post(`${URL}/add`, data);
        batch(() => {
            dispatch({
                type: SET_CUSTOMER_MSG,
                payload: res.data.data
            });
            dispatch({
                type: SETUP_PIN,
                payload: true
            });
        });
        return sessionStorage.setItem('pin', true);
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const resetPin = (data) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.post(`${URL}/reset`, data);
        dispatch({
            type: SET_CUSTOMER_MSG,
            payload: res.data.data
        });
        return sessionStorage.setItem('pin', true);
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const checkPin = (customerId) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.get(`${URL}/check/${customerId}`);
        return dispatch({
            type: SETUP_PIN,
            payload: res.data.data.status
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};