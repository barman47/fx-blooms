import axios from 'axios';

import { SET_NOTIFICATIONS,  VERIFIED_PHONE_NUMBER } from './types';
import { API } from '../utils/constants';
import handleError from '../utils/handleError';
import reIssueCustomerToken from '../utils/reIssueCustomerToken';

const api = `${API}/Notification`;

export const getNotifications = () => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.get(`${api}/GetNotificationLogs`);
        const notifications = res.data.data.map(notification => {
            const { data, ...rest } = notification;
            return { data: JSON.parse(data), ...rest };
        })
        return dispatch({
            type: SET_NOTIFICATIONS,
            payload: notifications
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getUnreadNotificationCount = (customerId) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.get(`${api}/GetNotificationCount/${customerId}`);
        console.log('Notification count ', res);
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const markNotificationAsRead = (id) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.post(`${api}/UpdateNotification/${id}`);
        console.log('Marked as read ', res);
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const generateOtp = (data) => async (dispatch) => {
    try {
        await Promise.all([
            reIssueCustomerToken(),
            axios.post(`${api}/GenerateOTP`, data)
        ]);
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const validatePhoneNumber = (data) => async (dispatch) => {
    try {
        await Promise.all([
            reIssueCustomerToken(),
            axios.post(`${api}/ValidatePhoneNumber`, data)
        ]);
        return dispatch({ 
            type: VERIFIED_PHONE_NUMBER, 
            payload: { phoneNumber: data.phoneNumber }
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};