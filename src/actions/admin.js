import axios from 'axios';

import { API } from '../utils/constants';
import { ADMIN_HOME, ADMIN_LOGIN } from '../routes';
import handleError from '../utils/handleError';
import reIssueAdminToken from '../utils/reIssueAdminToken';
import setAuthToken from '../utils/setAuthToken';
import { RESET_STORE, SET_CURRENT_ADMIN, SET_STATS, UPDATED_CUSTOMER } from './types';

const api = `${API}/Admin`;

export const login = (data, history) => async (dispatch) => {
    try {
        const res = await axios.post(`${api}/Login`, data);
        const { token } = res.data.data;
        setAuthToken(token);
        dispatch({
            type: SET_CURRENT_ADMIN,
            payload: { ...res.data.data, timeGenerated: res.data.timeGenerated }
        });
        history.push(ADMIN_HOME);
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getStats = () => async (dispatch) => {
    try {
        await reIssueAdminToken();
        const res = await axios.get(`${api}/GetAppStatistics`);
        return dispatch({
            type: SET_STATS,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const updateCustomerProfile = (data) => async (dispatch) => {
    try {
        await reIssueAdminToken();
        const res = await axios.post(`${api}/UpdateCustomerProfile`, data);
        return dispatch({
            type: UPDATED_CUSTOMER,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const logout = (history) => dispatch => {
    setAuthToken(null);
    dispatch({ type: RESET_STORE });
    return history.push(ADMIN_LOGIN);
};