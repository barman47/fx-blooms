import { batch } from 'react-redux';
import axios from 'axios';

import { PAYMENT_MADE, SET_CHATS, SET_CUSTOMER_MSG } from './types';
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
        const res = await axios.post(`${api}/SendMessage`, message);
        console.log(res);
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const sendTransactionNotification = (chatId) => async (dispatch) => {
    try {
        await reIssueToken();
        const res = await axios.post(`${api}/TransactionNotification?chatId=${chatId}`);
        console.log(res);
        batch(() => {
            dispatch({
                type: SET_CUSTOMER_MSG,
                payload: res.data.data
            });
            dispatch({
                type: PAYMENT_MADE,
                payload: true
            });
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};