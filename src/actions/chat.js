import axios from 'axios';
import { batch } from 'react-redux';

import { CUSTOMER_MADE_PAYMENT, SET_CHATS, SET_CUSTOMER_MSG, SET_TRANSACTION_TERMS, GET_UNREAD_MESSAGES } from './types';
import { API } from '../utils/constants';
import handleError from '../utils/handleError';
import reIssueCustomerToken from '../utils/reIssueCustomerToken';

const api = `${API}/Chat`;

export const getChats = () => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.get(`${api}/Chats`);
        return dispatch({
            type: SET_CHATS,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const sendMessage = (message) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        await axios.post(`${api}/SendMessage`, message);
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getUnreadMessages = () => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.get(`${api}/UnreadMessagesCount`);
        return dispatch({
            type: GET_UNREAD_MESSAGES,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const sendTransactionNotification = (chatId, { customerUsername, otherUsername, buyerHasMadePayment, sellerHasMadePayment }) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        await axios.post(`${api}/TransactionNotification?chatId=${chatId}`);
        const message = `Hi ${customerUsername} a notification has been sent to ${otherUsername}`;
        return batch(() => {
            dispatch({
                type: CUSTOMER_MADE_PAYMENT,
                payload: {
                    buyerHasMadePayment,
                    sellerHasMadePayment,
                }
            });
            dispatch({
                type: SET_CUSTOMER_MSG,
                payload: message
            });
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const updateMessageStatus = (chatId) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        await axios.post(`${api}/UpdateMessageStatus?chatId=${chatId}`);
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