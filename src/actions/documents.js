import axios from 'axios';

import { SET_DOCUMENTS } from './types';

import handleError from '../utils/handleError';

const API = `${process.env.REACT_APP_BACKEND_API}`;

export const getDocuments = () => async dispatch => {
    try {
        const res = await axios.get(`${API}/Customer/GetDocumentType`);

        dispatch({
            type: SET_DOCUMENTS,
            payload: res.data.data
        });

    } catch (err) {
        return handleError(err, dispatch)
    }
};