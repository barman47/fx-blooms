import axios from 'axios';

import { SET_MY_IP } from './types';

export const getMyLocation = () => async dispatch => {
    try {
        const res = await axios.get('https://api.ipify.org?format=json');
        dispatch({
            type: SET_MY_IP,
            payload: res.data.ip
        });
    } catch (err) {
        console.error(err);
    }
};