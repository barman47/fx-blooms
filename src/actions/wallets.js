import axios from 'axios';
import handleError from '../utils/handleError';
import reIssueCustomerToken from '../utils/reIssueCustomerToken';

import { SET_WALLETS } from './types';

const API = `${process.env.REACT_APP_WALLET_API}`;
const WALLETS_API = `${API}/wallet-management`;
const YAPILY_API = `${API}/YAPILY`;

export const getWallets = (customerId) => async (dispatch)  => {
    try {
        await reIssueCustomerToken();
        const res = await axios.get(`${WALLETS_API}/customers/${customerId}/wallets`);
        console.log('Wallets ', res);
        dispatch({
            type: SET_WALLETS,
            payload: res.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const fundWallet = (data) => async (dispatch)  => {
    try {
        await reIssueCustomerToken();
        const res = await axios.post(`${YAPILY_API}/fund`, data);
        console.log(res);
    } catch (err) {
        return handleError(err, dispatch);
    }
};