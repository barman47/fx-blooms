import axios from 'axios';
import { API } from './constants';
import { store } from '../store';
import tokenExpired from './tokenExpired';

const reIssueToken = async () => {
    try {
        const { token } = store.getState().customer;
        if (!tokenExpired()) {
            console.log('token not expired');
            return token;
        }
        console.log('token expired');
        const res = await axios.get(`${API}/Customer/ReIssueToken`);
        return console.log(res);
    } catch (err) {
        console.log(err.response)
    }
};

export default reIssueToken;