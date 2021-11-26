import axios from 'axios';

import { WALLET_API as API } from '../utils/constants';
import handleError from '../utils/handleError';
import { ADDED_ACCOUNT } from './types';
import reIssueCustomerToken from '../utils/reIssueCustomerToken';

const URL = `${API}/account-management`;

export const addAccount = (account) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.post(`${URL}/accounts/add`, account);
        console.log('Added account ', res);
    } catch (err) {
        return handleError(err, dispatch);
    }
};