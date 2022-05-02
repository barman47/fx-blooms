import axios from 'axios';

import { SET_NOTIFICATIONS, SET_NOTIFICATION_COUNT, VERIFIED_PHONE_NUMBER } from './types';
import handleError from '../utils/handleError';
import reIssueCustomerToken from '../utils/reIssueCustomerToken';

const API = `${process.env.REACT_APP_BACKEND_API}`;
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

export const getNotificationCount = (customerId) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.get(`${api}/GetNotificationCount/${customerId}`);
        return dispatch({
            type: SET_NOTIFICATION_COUNT,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const markNotificationAsRead = (id) => async (dispatch) => {
    try {
        await Promise.all([
            reIssueCustomerToken(),
            axios.post(`${api}/UpdateNotification/${id}`)
        ]);
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