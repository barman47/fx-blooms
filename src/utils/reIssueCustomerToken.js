import axios from 'axios';
import { API } from './constants';
import { store } from '../store';
import setAuthToken from './setAuthToken';
import { AUTH_TOKEN } from './constants';
import { RESET_CUSTOMER_SESSION, SET_AUTH_TOKEN } from '../actions/types';
import { LOGIN } from '../routes';

const reIssueCustomerToken = () => {
    return new Promise(async(resolve, reject) => {
        try {
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
            console.error(err);
            window.location.href = LOGIN;
        }
    }); 
};

export default reIssueCustomerToken;