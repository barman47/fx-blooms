import axios from 'axios';

import { SET_CUSTOMER_MSG, SET_NOTIFICATIONS, SET_TRANSACTION_TERMS, VERIFIED_PHONE_NUMBER } from './types';
import { API } from '../utils/constants';
import handleError from '../utils/handleError';
import reIssueCustomerToken from '../utils/reIssueCustomerToken';

const api = `${API}/Transfer`;

export const getNotifications = () => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.get(`${api}/Transfers`);
        dispatch({
            type: SET_NOTIFICATIONS,
            payload: res.data.data
        });
        return 
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const sendTransactionNotification = (transferId, sellerUsername) => async (dispatch) => {
    try {
        await Promise.all([
            await reIssueCustomerToken(),
            await axios.post(`${api}/TransactionNotification?transferId=${transferId}`)
        ]);
        const message = `Hi ${sellerUsername} a notification has been sent to the buyer informing him of your payment.`;
        dispatch({
            type: SET_CUSTOMER_MSG,
            payload: message
        });
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

export const generateOtp = (data) => async (dispatch) => {
    try {
        await Promise.all([
            reIssueCustomerToken(),
            axios.post(`${API}/Notification/GenerateOTP`, data)
        ]);
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const validatePhoneNumber = (data) => async (dispatch) => {
    try {
        await Promise.all([
            reIssueCustomerToken(),
            axios.post(`${API}/Notification/ValidatePhoneNumber`, data)
        ]);
        return dispatch({ 
            type: VERIFIED_PHONE_NUMBER, 
            payload: { phoneNumber: data.phoneNumber }
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};