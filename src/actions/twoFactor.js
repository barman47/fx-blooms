import axios from 'axios';
import { batch } from 'react-redux';

import { API } from '../utils/constants';
import handleError from '../utils/handleError';
import setAuthToken from '../utils/setAuthToken';
import { DASHBOARD_HOME } from '../routes';

import { 
    DISABLED_2FA,
    ENABLED_2FA,
    SET_AUTH_TOKEN,
    SET_2FA_MSG,
    SET_BARCODE,
    TWO_FACTOR_AUTHORIZED
 } from './types';

const api = `${API}/TwoFactor`;

export const authorizeTwoFactor = ({ code, profileId }, history) => async (dispatch) => {
    try {
        const res = await axios.post(`${api}/Authorize?inputCode=${code}&profileId=${profileId}`);
        const token = res.data.data;
        setAuthToken(token);
        batch(() => {
            dispatch({
                type: SET_AUTH_TOKEN,
                payload: token
            });
            dispatch({ type: TWO_FACTOR_AUTHORIZED });
        });
        
        return history.push(DASHBOARD_HOME);
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getBarcode = () => async (dispatch) => {
    try {
        const res = await axios.get(`${api}/BarCode`);
        return dispatch({
            type: SET_BARCODE,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const disableTwoFactor = () => async (dispatch) => {
    try {
        const res = await axios.post(`${api}/Disable?`);
        batch(() => {
            dispatch({
                type: DISABLED_2FA,
                payload: true
            });
            dispatch({
                type: SET_2FA_MSG,
                payload: res.data.data
            });
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const enableTwoFactor = () => async (dispatch) => {
    try {
        const res = await axios.post(`${api}/Enable`);
        const { token, message } = res.data.data;
        setAuthToken(token);
        batch(() => {
            dispatch({
                type: ENABLED_2FA,
                payload: true
            });
            dispatch({
                type: SET_2FA_MSG,
                payload: message
            });
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};