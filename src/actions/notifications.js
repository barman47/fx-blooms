import axios from 'axios';
import { batch } from 'react-redux';

import { CUSTOMER_MADE_PAYMENT, SET_BIDS, SET_CUSTOMER_MSG, SET_NOTIFICATIONS, SET_TRANSACTION_TERMS } from './types';
import { API } from '../utils/constants';
import handleError from '../utils/handleError';
import reIssueCustomerToken from '../utils/reIssueCustomerToken';

const api = `${API}/Transfer`;

export const getNotifications = () => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.get(`${api}/Transfers`);
        console.log(res);
        let events = [];
        let bids = [];
        res.data.data.forEach(item => {
            const { transferEvents, ...rest } = item;
            bids.push({ ...rest });
            if (transferEvents.length > 0){
                transferEvents.forEach(event => events.push(event));
            }
        });
        batch(() => {
            dispatch({
                type: SET_BIDS,
                payload: bids
            });
            dispatch({
                type: SET_NOTIFICATIONS,
                payload: events
            });
        });
        return 
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