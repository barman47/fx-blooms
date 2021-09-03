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

export const sendTransactionNotification = (chatId, { customerId, buyer, seller, buyerUsername, sellerUsername }) => async (dispatch) => {
    try {
        await reIssueToken();
        await axios.post(`${api}/TransactionNotification?chatId=${chatId}`);
        // const { buyerHasMadePayment, buyerHasRecievedPayment, sellerHasMadePayment, sellerHasRecievedPayment, isDeleted } = res.data.data;
        const message = `Hi ${customerId === seller ? sellerUsername : buyerUsername} a notification has been sent to $${customerId === seller ? sellerUsername : buyerUsername}`;
        return dispatch({
            type: SET_CUSTOMER_MSG,
            payload: message
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};