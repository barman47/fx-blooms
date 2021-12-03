import axios from 'axios';

import { WALLET_API as API } from '../utils/constants';
import handleError from '../utils/handleError';
import { DELETED_ACCOUNT, SET_ACCOUNT, SET_ACCOUNTS } from './types';
import reIssueCustomerToken from '../utils/reIssueCustomerToken';

const URL = `${API}/account-management`;

export const addAccount = (account) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.post(`${URL}/accounts/add`, account);
        dispatch({
            type: SET_ACCOUNTS,
            payload: {
                msg: 'Bank account added successfully!',
                account: res.data
            }
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getAccounts = (customerId) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.get(`${URL}/customers/${customerId}/accounts`);
        dispatch({
            type: SET_ACCOUNTS,
            payload: res.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
}

export const getAccount = (accountId) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.get(`${URL}/accounts/${accountId}`);
        dispatch({
            type: SET_ACCOUNT,
            payload: res.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
}

export const deleteAccount = (accountId) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.put(`${URL}/accounts/${accountId}/delete`);
        console.log(res);
        dispatch({
            type: DELETED_ACCOUNT,
            payload: accountId
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
}