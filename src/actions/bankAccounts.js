import axios from 'axios';
import $ from "jquery";

import handleError from '../utils/handleError';
import { ADDED_ACCOUNT, EDITED_ACCOUNT, DELETED_ACCOUNT, SET_ACCOUNT, SET_ACCOUNTS, SET_ACCOUNT_VALIDATION, GET_ERRORS } from './types';
import reIssueCustomerToken from '../utils/reIssueCustomerToken';

const API = `${process.env.REACT_APP_WALLET_API}`;
const URL = `${API}/account-management`;

export const addAccount = (account) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.post(`${URL}/accounts/add`, account);
        dispatch({
            type: ADDED_ACCOUNT,
            payload: {
                msg: 'Bank account added successfully!',
                account: res.data
            }
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const editAccount = (account, accountId) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.post(`${URL}/accounts/${accountId}/edit`, account);
        dispatch({
            type: EDITED_ACCOUNT,
            payload: {
                msg: 'Bank account has been updated successfully!',
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
            payload: res.data.data
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
        await Promise.all([reIssueCustomerToken(), axios.post(`${URL}/accounts/${accountId}/delete`)]);
        dispatch({
            type: DELETED_ACCOUNT,
            payload: accountId
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
}

export const validateIban = (iban) => async (dispatch) => {
    try {
        $.ajax({
            url: `https://api.ibanapi.com/v1/validate/${iban}?api_key=${process.env.REACT_APP_IBAN_API_KEY}`,
            dataType: 'jsonp',
            success: function (res) {
                const validationData = {
                    message: res.message,
                    valid: res.result === 200 ? true : false,
                    bank: res.result === 200 ? res.data.bank : {},
                };
                return dispatch({
                    type: SET_ACCOUNT_VALIDATION,
                    payload: validationData
                });
            },
            error: function (err) {
                console.error(err);
                return dispatch({
                    type: GET_ERRORS,
                    payload: {  msg: 'Something went wrong.' }
                });
            },
            method: 'get',
        });
    } catch (err) {
        console.error(err);
        return dispatch({
            type: GET_ERRORS,
            payload: {  msg: 'Something went wrong. Please try again.' }
        });
        // return handleError(err, dispatch);
    }
}