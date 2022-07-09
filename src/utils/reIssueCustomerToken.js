import axios from 'axios';
import { createBrowserHistory } from 'history';

import { store } from '../store';
import setAuthToken from './setAuthToken';
import { AUTH_TOKEN, NETWORK_ERROR } from './constants';
import { GET_ERRORS, RESET_CUSTOMER_SESSION, RESET_STORE, SET_AUTH_TOKEN } from '../actions/types';
import { LOGIN } from '../routes';

const API = `${process.env.REACT_APP_BACKEND_API}`;

const reIssueCustomerToken = () => {
    return new Promise(async(resolve, reject) => {
        try {
            // Redirect to login page
            const res = await axios.get(`${API}/Customer/ReIssueToken`, {
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
                type: RESET_CUSTOMER_SESSION,
                payload: true
            });
            resolve('Reissued token');
        } catch (err) {
            if (err?.message === NETWORK_ERROR) {
                return store.dispatch({
                    type: GET_ERRORS,
                    payload: { msg: NETWORK_ERROR }
                });     
            }
            console.error(err);
            setAuthToken(null);
            store.dispatch({ type: RESET_STORE });
            createBrowserHistory().push(LOGIN, { msg: 'Your session has expired' });
        }
    }); 
};

export default reIssueCustomerToken;