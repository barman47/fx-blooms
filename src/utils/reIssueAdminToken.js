import axios from 'axios';

import { API } from './constants';
import { store } from '../store';
import setAuthToken from './setAuthToken';
import { AUTH_TOKEN } from './constants';
import { RESET_ADMIN_SESSION, RESET_STORE, SET_AUTH_TOKEN } from '../actions/types';
import { ADMIN_LOGIN } from '../routes';

const reIssueAdminToken = () => {
    return new Promise(async(resolve, reject) => {
        try {
            const res = await axios.get(`${API}/Admin/ReIssueToken`, {
                headers: {
                    'Authorization': 'Bearer',
                    token: sessionStorage.getItem(AUTH_TOKEN)
                } 
            });
            setAuthToken(res.data.data);
            store.dispatch({
                type: SET_AUTH_TOKEN,
                payload: res.data.data
            });
            store.dispatch({
                type: RESET_ADMIN_SESSION,
                payload: true
            });
            resolve('Reissued token');
        } catch (err) {
            console.error(err);
            // console.log(err.response)
            setAuthToken(null);
            store.dispatch({ type: RESET_STORE });
            window.location.href = ADMIN_LOGIN;
        }
    }); 
};

export default reIssueAdminToken;