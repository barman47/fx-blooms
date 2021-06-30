import axios from 'axios';

import { API } from '../utils/constants';
import handleError from '../utils/handleError';
import { SET_CURRENCIES } from './types';


export const getCurrencies = () => async (dispatch) => {
    try {
        const res = await axios.get(`${API}/Customer/GetCurrencies`);
        const currencies = res.data.data;
        return dispatch({
            type: SET_CURRENCIES,
            payload: currencies
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};