import axios from 'axios';

import { API } from '../utils/constants';
import handleError from '../utils/handleError';

const api = `${API}/Customer`;

export const createCustomer = (customer) => async (dispatch) => {
    try {
        const res = await axios.post(`${api}/CreateCustomer`, customer);
        console.log(res);
    } catch (err) {
        return handleError(err, dispatch);
    }
};