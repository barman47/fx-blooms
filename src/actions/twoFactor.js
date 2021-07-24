import axios from 'axios';

import { API } from '../utils/constants';
import handleError from '../utils/handleError';

import { 
    SET_BARCODE
 } from './types';

const api = `${API}/TwoFactor`;

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

export const enableTwoFactor = (code) => async (dispatch) => {
    try {
        const res = await axios.post(`${api}/Enable`, code);
        console.log(res);
        // return dispatch({
        //     type: SET_BARCODE,
        //     payload: res.data.data
        // });
    } catch (err) {
        return handleError(err, dispatch);
    }
};