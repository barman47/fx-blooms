import axios from 'axios';

import { SET_TRANSACTIONS, SET_TRANSACTION_TERMS } from './types';
import { API } from '../utils/constants';
import handleError from '../utils/handleError';
import reIssueCustomerToken from '../utils/reIssueCustomerToken';

const api = `${API}/Transfer`;

export const getTransactions = (retrieveAll) => async (dispatch) => {
    try {
        console.log('Getting transactions');
        await reIssueCustomerToken();
        const res = await axios.get(`${api}/Transfers?retrieveAll=${retrieveAll}`);
        console.log('transactions ', res);
        return dispatch({
            type: SET_TRANSACTIONS,
            payload: res.data.data
        }); 
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const sendTransactionNotification = (transferId) => async (dispatch) => {
    try {
        await Promise.all([
            await reIssueCustomerToken(),
            await axios.post(`${api}/TransactionNotification?transferId=${transferId}`)
        ]);
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const acceptChatPopupNotification = (chatId) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.post(`${api}/AcceptChatPopupNotification?chatId=${chatId}`);
        const { buyerAcceptedTransactionTerms, sellerAcceptedTransactionTerms } = res.data.data;
        return dispatch({
            type: SET_TRANSACTION_TERMS,
            payload: { buyerAcceptedTransactionTerms, sellerAcceptedTransactionTerms }
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};