import axios from 'axios';

import { store } from '../store';
import setAuthToken from './setAuthToken';
import { AUTH_TOKEN, NETWORK_ERROR } from './constants';
import { RESET_ADMIN_SESSION, SET_AUTH_TOKEN } from '../actions/types';

const API = `${process.env.REACT_APP_BACKEND_API}`;

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
            if (err?.message === NETWORK_ERROR) {
                return reject('Network error');
                // return store.dispatch({
                //     type: GET_ERRORS,
                //     payload: { msg: NETWORK_ERROR }
                // });   
            }
            return reject('Something went wrong');
            // return store.dispatch({
            //     type: GET_ERRORS,
            //     payload: { msg: 'Something went wrong' }
            // });
            // console.error(err);
            // setAuthToken(null);
            // store.dispatch({ type: RESET_STORE });
            // createBrowserHistory().push(LOGIN, { msg: 'Your session has expired' });
        }
    }); 
};

export default reIssueAdminToken;