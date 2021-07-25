import axios from 'axios';
import { API } from './constants';
import { store } from '../store';
import setAuthToken from './setAuthToken';
import { tokenExpired, tokenExpiring } from './checkToken';
import { AUTH_TOKEN } from './constants';
import { SET_AUTH_TOKEN } from '../actions/types';

// const reIssueToken = async () => {
//     try {
//         const { token } = store.getState().customer;
        // if (!tokenExpired()) {
        //     console.log('token not expired');
        //     return token;
        // }
        // console.log('token expired');
//         const res = await axios.get(`${API}/Customer/ReIssueToken`, {
//             headers: {
//                 'Authorization': 'Bearer',
//                 token: localStorage.getItem(AUTH_TOKEN)
//             } 
//         });
//         setAuthToken(res.data.data.token);
//         store.dispatch({
//             type: SET_AUTH_TOKEN,
//             payload: res.data.data.token
//         });
//         return console.log(res);
//     } catch (err) {
//         console.log(err.response);
//     }
// };

const reIssueToken = new Promise(async(resolve, reject) => {
    try {
        const { token } = store.getState().customer;
        if (!tokenExpired()) {
            console.log('token not expired');
            return token;
        }
        if (!tokenExpiring()) {
            console.log('token not expiring');
            return token;
        }
        
        const res = await axios.get(`${API}/Customer/ReIssueToken`, {
            headers: {
                'Authorization': 'Bearer',
                token: localStorage.getItem(AUTH_TOKEN)
            } 
        });
        setAuthToken(res.data.data.token);
        store.dispatch({
            type: SET_AUTH_TOKEN,
            payload: res.data.data.token
        });
        resolve(console.log(res));
    } catch (err) {
        console.log(err.response);
        reject('Failed to reissue token');
    }
});

export default reIssueToken;