import axios from 'axios';
import { batch } from 'react-redux';

import { 
    REMOVE_NOTIFICATION,
    REMOVE_TRANSACTION,
    SET_LOADING,
    SET_TRANSACTION,
    SET_TRANSACTIONS,
    SET_TRANSACTION_TERMS,
    SET_PENDING_TRANSACTION_COUNT,
    SET_TRANSACTION_MSG
} from './types';
import handleError from '../utils/handleError';
import reIssueCustomerToken from '../utils/reIssueCustomerToken';

import { markNotificationAsRead } from './notifications';

const API = `${process.env.REACT_APP_BACKEND_API}`;
const api = `${API}/Transfer`;

export const getTransaction = (transferId) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.get(`${api}/Transfer?transferId=${transferId}`);
        return dispatch({
            type: SET_TRANSACTION,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

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

export const getPendingTransactionCount = () => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.get(`${api}/GetPendingTransferCount`);
        return dispatch({
            type: SET_PENDING_TRANSACTION_COUNT,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const cancelTransaction = (transactionId) => async (dispatch) => {
    try {
        await Promise.all([
            reIssueCustomerToken(),
            axios.post(`${api}/CancelOffer?transferId=${transactionId}`)
        ]);
        return batch(() => {
            dispatch({
                type: SET_TRANSACTION_MSG,
                payload: 'Offer successfully cancelled. Your EUR is reverted to wallet. You may accept or create a new offer.'
            });
            dispatch({
                type: REMOVE_TRANSACTION,
                payload: transactionId
            });
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};