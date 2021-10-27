import axios from 'axios';

import { SET_COUNTRIES } from './types';

import reIssueCustomerToken from '../utils/reIssueCustomerToken';
import handleError from '../utils/handleError';
import { API } from '../utils/constants';

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