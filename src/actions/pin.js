import axios from 'axios';
import { batch } from 'react-redux';

import handleError from '../utils/handleError';
import { 
    SET_CUSTOMER_MSG
} from './types';
import reIssueCustomerToken from '../utils/reIssueCustomerToken';

const API = `${process.env.REACT_APP_BACKEND_API}`;
const URL = `${API}/pin-management`;

export const createPin = (data) => async (dispatch) => {
    try {
            await reIssueCustomerToken();
            const res = axios.post(`${URL}/add`, data);
            console.log('Pin set  ', res);
        // dispatch({
        //     type: REMOVE_NOTIFICATION,
        //     payload: notificationId
        // });
    } catch (err) {
        return handleError(err, dispatch);
    }
};