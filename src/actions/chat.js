import axios from 'axios';

import { SET_CHATS, SET_CUSTOMER_MSG } from './types';
import { API } from '../utils/constants';
import handleError from '../utils/handleError';
import reIssueToken from '../utils/reIssueToken';

const api = `${API}/Chat`;

export const getChats = () => async (dispatch) => {
    try {
        await reIssueToken();
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
        await reIssueToken();
        await axios.post(`${api}/SendMessage`, message);
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const sendTransactionNotification = (chatId, { customerUsername, otherUsername }) => async (dispatch) => {
    try {
        await reIssueToken();
        await axios.post(`${api}/TransactionNotification?chatId=${chatId}`);
        const message = `Hi ${customerUsername} a notification has been sent to ${otherUsername}`;
        return dispatch({
            type: SET_CUSTOMER_MSG,
            payload: message
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const updateMessageStatus = (chatId) => async (dispatch) => {
    try {
        // await reIssueToken();
        console.log('Updating message status');
        const res = await axios.post(`${api}/UpdateMessageStatus?chatId=${chatId}`);
        console.log('message status ', res);
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const acceptChatPopupNotification = (chatId) => async (dispatch) => {
    try {
        // await reIssueToken();
        console.log('Updating message status');
        const res = await axios.post(`${api}/UpdateMessageStatus?chatId=${chatId}`);
        console.log('message status ', res);
    } catch (err) {
        return handleError(err, dispatch);
    }
};