import axios from 'axios';
import { NETWORK_ERROR } from '../utils/constants';

import { ADDED_SUBSCRIPTION, GET_ERRORS } from './types';

export const addSubscription = (data) => async (dispatch) => {
    try {
        const res = await axios.post('https://api.fxblooms.com/api/Subscription/CreateSubscription', data);
        return dispatch({
            type: ADDED_SUBSCRIPTION
        });
    } catch (err) {
        if (err?.message === NETWORK_ERROR) {
            return dispatch({
                type: GET_ERRORS,
                payload: { msg: NETWORK_ERROR }
            });     
        } else if (err?.response?.data) {
            return dispatch({
                type: GET_ERRORS,
                payload: { msg: err?.response?.data }
            }); 
        } else {
            console.log(err.response);
            return dispatch({
                type: GET_ERRORS,
                payload: { msg: 'Subscription Failed' }
            }); 
        }
    }
};