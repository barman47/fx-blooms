import axios from 'axios';
import { batch } from 'react-redux';

import { REMOVE_NOTIFICATION, SET_LOADING, SET_TRANSACTIONS, SET_TRANSACTION_TERMS } from './types';
import { API } from '../utils/constants';
import handleError from '../utils/handleError';
import reIssueCustomerToken from '../utils/reIssueCustomerToken';

import { markNotificationAsRead } from './notifications';

const api = `${API}/Transfer`;

export const getTransactions = (retrieveAll) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.get(`${api}/Transfers?retrieveAll=${retrieveAll}`);
        return batch(() => {
            dispatch({
                type: SET_TRANSACTIONS,
                payload: res.data.data
            });
            dispatch({
                type: SET_LOADING,
                payload: false
            });
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const sendTransactionNotification = (transferId, notificationId = null) => async (dispatch) => {
    try {
        await Promise.all([
            reIssueCustomerToken(),
            axios.post(`${api}/TransactionNotification?transferId=${transferId}`)
        ]);
        if (notificationId) {
            dispatch({
                type: REMOVE_NOTIFICATION,
                payload: notificationId
            });
            dispatch(markNotificationAsRead(notificationId));
        }
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