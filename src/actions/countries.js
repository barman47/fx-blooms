import axios from 'axios';

import { SET_COUNTRIES } from './types';

import reIssueCustomerToken from '../utils/reIssueCustomerToken';
import handleError from '../utils/handleError';

const API = `${process.env.REACT_APP_BACKEND_API}`;

export const getCountries = () => async (dispatch) => {
    try {
        await reIssueCustomerToken
        const res = await axios.get(`${API}/Customer/GetCountries`);
        dispatch({
            type: SET_COUNTRIES,
            payload: res.data.data
        });

    } catch (err) {
        return handleError(err, dispatch);
    }
};