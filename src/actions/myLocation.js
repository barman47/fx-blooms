import axios from 'axios';

import { SET_MY_LOCATION } from './types';

export const getMyLocation = () => async dispatch => {
    try {
        const res = await axios.get('http://ip-api.com/json');
        dispatch({
            type: SET_MY_LOCATION,
            payload: res.data
        });
    } catch (err) {
        console.error(err);
    }
};