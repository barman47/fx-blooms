import axios from 'axios';
import { API } from './constants';
import { store } from '../store';
import setAuthToken from './setAuthToken';
import { tokenExpiring } from './checkToken';
import { AUTH_TOKEN } from './constants';
import { SET_AUTH_TOKEN } from '../actions/types';
import { LOGIN } from '../routes';

const reIssueToken = () => {
    const { token } = store.getState().customer;
    if (!tokenExpiring()) {
        console.log('token not expiring');
        return token;
    }

    return new Promise(async(resolve, reject) => {
        try {
            const res = await axios.get(`${API}/Customer/ReIssueToken`, {
                headers: {
                    'Authorization': 'Bearer',
                    token: localStorage.getItem(AUTH_TOKEN)
                } 
            });
            setAuthToken(res.data.data);
            console.log('reIssued token ', res);
            resolve(store.dispatch({
                type: SET_AUTH_TOKEN,
                payload: res.data.data
            }));

        } catch (err) {
            console.log(err.response);
            reject('Token expired!');
            window.location.href = LOGIN;
        }
    }); 
};

export default reIssueToken;