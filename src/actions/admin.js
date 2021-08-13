import axios from 'axios';

import { API } from '../utils/constants';
import { ADMIN_DASHBOARD, ADMIN_HOME } from '../routes';
import handleError from '../utils/handleError';
// import reIssueToken from '../utils/reIssueToken';
import setAuthToken from '../utils/setAuthToken';
import { SET_CURRENT_ADMIN, SET_STATS } from './types';

const api = `${API}/Admin`;

export const login = (data, history) => async (dispatch) => {
    try {
        const res = await axios.post(`${api}/Login`, data);
        const { token } = res.data.data;
        setAuthToken(token);
        dispatch({
            type: SET_CURRENT_ADMIN,
            payload: { ...res.data.data, timeGenerated: res.data.timeGenerated }
        });
        history.push(`${ADMIN_DASHBOARD}${ADMIN_HOME}`);
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getStats = () => async (dispatch) => {
    try {
        // await reIssueToken();
        const res = await axios.get(`${api}/GetAppStatistics`);
        return dispatch({
            type: SET_STATS,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};