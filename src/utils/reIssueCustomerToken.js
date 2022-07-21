import axios from 'axios';
// import { createBrowserHistory } from 'history';

import { store } from '../store';
import setAuthToken from './setAuthToken';
import { AUTH_TOKEN, NETWORK_ERROR } from './constants';
import { RESET_CUSTOMER_SESSION, SET_AUTH_TOKEN } from '../actions/types';
import { SESSION_LIFE, SESSION_TIME } from './constants';

const API = `${process.env.REACT_APP_BACKEND_API}`;

const reIssueCustomerToken = () => {
    return new Promise(async(resolve, reject) => {
        try {
            const sessionTime = sessionStorage.getItem(SESSION_TIME);
            if (new Date().getTime() >= sessionTime) {
                console.log('reissuing token');
                const res = await axios.get(`${API}/Customer/ReIssueToken`, {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem(AUTH_TOKEN)}`
                    } 
                });
                // const res = await axios.get(`${API}/Customer/ReIssueToken`, {
                //     headers: {
                //         'Authorization': 'Bearer',
                //         token: sessionStorage.getItem(AUTH_TOKEN)
                //     } 
                // });
                setAuthToken(res.data.data);
                store.dispatch({
                    type: SET_AUTH_TOKEN,
                    payload: res.data.data
                });
                store.dispatch({
                    type: RESET_CUSTOMER_SESSION,
                    payload: true
                });
                sessionStorage.setItem(SESSION_TIME, new Date().getTime() + SESSION_LIFE);
                return resolve('Reissued token');
            }
            return resolve('No need to reissue token');
            
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

export default reIssueCustomerToken;