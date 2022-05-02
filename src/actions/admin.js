import axios from 'axios';

import { API } from '../utils/constants';
import { ADMIN_HOME, ADMIN_LOGIN } from '../routes';
import handleError from '../utils/handleError';
import reIssueAdminToken from '../utils/reIssueAdminToken';
import setAuthToken from '../utils/setAuthToken';
import { 
    RESET_STORE, 
    SET_CURRENT_ADMIN, 
    SET_CUSTOMER_COUNT, 
    SET_LISTING_COUNT,
    SET_CUSTOMERS,
    SET_TRANSACTION_VOLUME,
    SET_STATS,
    SET_ACTIVE_CUSTOMER_COUNT, 
    UPDATED_CUSTOMER 
} from './types';

const api = `${API}/Admin`;

export const login = (data, navigate) => async (dispatch) => {
    try {
        const res = await axios.post(`${api}/Login`, data);
        const { token } = res.data.data;
        setAuthToken(token);
        dispatch({
            type: SET_CURRENT_ADMIN,
            payload: { ...res.data.data, timeGenerated: res.data.timeGenerated }
        });
        navigate(ADMIN_HOME);
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

export const getCustomerCount = (timeframe) => async (dispatch) => {
    try {
        await reIssueAdminToken();
        const res = await axios.get(`${api}/GetCustomerCount?timeframe=${timeframe}`);
        return dispatch({
            type: SET_CUSTOMER_COUNT,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getActiveUserCount = (timeframe) => async (dispatch) => {
    try {
        await reIssueAdminToken();
        const res = await axios.get(`${api}/GetCustomerCount?timeframe=${timeframe}`);
        return dispatch({
            type: SET_ACTIVE_CUSTOMER_COUNT,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getListingCount = (timeframe) => async (dispatch) => {
    try {
        await reIssueAdminToken();
        const res = await axios.get(`${api}/GetListingCount?timeframe=${timeframe}`);
        return dispatch({
            type: SET_LISTING_COUNT,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getTransactionVolume = (timeframe) => async (dispatch) => {
    try {
        await reIssueAdminToken();
        const res = await axios.get(`${api}/GetTransactionVolume?timeframe=${timeframe}`);
        console.log('hello')
        return dispatch({
            type: SET_TRANSACTION_VOLUME,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const searchForCustomer = ({searchText, pageNumber, pageSize}) => async (dispatch) => {
    try {
        await reIssueAdminToken();
        const res = await axios.get(`${api}/SearchForCustomer?KeyWord=${searchText}&PageNumber=${pageNumber}&PageSize=${pageSize}`);
        return dispatch({
            type: SET_CUSTOMERS,
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

export const logout = (navigate) => dispatch => {
    setAuthToken(null);
    dispatch({ type: RESET_STORE });
    return navigate(ADMIN_LOGIN);
};