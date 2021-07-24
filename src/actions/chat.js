import axios from 'axios';

import { SET_CHATS } from './types';
import { API } from '../utils/constants';
import handleError from '../utils/handleError';

const api = `${API}/Chat`;

export const getChats = () => async (dispatch) => {
    try {
        // await reIssueToken();
        const res = await axios.get(`${api}/Chats`);
        return console.log(res);
        dispatch({
            type: SET_CHATS,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};