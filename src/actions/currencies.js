import axios from 'axios';

import handleError from '../utils/handleError';
import reIssueCustomerToken from '../utils/reIssueCustomerToken';
import { SET_CURRENCIES } from './types';

const API = `${process.env.REACT_APP_BACKEND_API}`;

export const getCurrencies = () => async (dispatch) => {
    try {
        await reIssueCustomerToken();
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