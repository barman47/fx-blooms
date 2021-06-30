import axios from 'axios';

import { SET_COUNTRIES } from './types';

import handleError from '../utils/handleError';
import { API } from '../utils/constants';

export const getCountries = () => async dispatch => {
    try {
        const res = await axios.get(`${API}/Customer/GetCountries`);

        dispatch({
            type: SET_COUNTRIES,
            payload: res.data.data
        });

    } catch (err) {
        return handleError(err, dispatch);
    }
};