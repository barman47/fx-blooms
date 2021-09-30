import axios from 'axios';

import { ADDED_ACCOUNT } from './types';

import { API } from '../utils/constants';
import reIssueCustomerToken from '../utils/reIssueCustomerToken';
import handleError from '../utils/handleError';

const URL = `${API}/Account`;

export const addAccount = (data) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.post(`${URL}/AddAccount`, data);
        dispatch({
            type: ADDED_ACCOUNT,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};