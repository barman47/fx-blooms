import axios from 'axios';

import { SET_DOCUMENTS } from './types';

import handleError from '../utils/handleError';
import reIssueToken from '../utils/reIssueToken';
import { API } from '../utils/constants';

export const getDocuments = () => async dispatch => {
    try {
        // await reIssueToken();
        const res = await axios.get(`${API}/Customer/GetDocumentType`);

        dispatch({
            type: SET_DOCUMENTS,
            payload: res.data.data
        });

    } catch (err) {
        return handleError(err, dispatch)
    }
};