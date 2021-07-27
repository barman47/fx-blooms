import axios from 'axios';

import { SET_CHATS, SENT_MESSAGE } from './types';
import { API } from '../utils/constants';
import handleError from '../utils/handleError';

const api = `${API}/Chat`;

export const getChats = () => async (dispatch) => {
    try {
        // await reIssueToken();
        const res = await axios.get(`${api}/Chats`);
        return dispatch({
            type: SET_CHATS,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const sendMessage = (message) => async (dispatch) => {
    try {
        const res = await axios.post(`${api}/SendMessage`, message);
        console.log(res);
        // return dispatch({
        //     type: SENT_MESSAGE,
        //     payload: message
        // });
    } catch (err) {
        return handleError(err, dispatch);
    }
};