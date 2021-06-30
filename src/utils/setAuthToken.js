import axios from 'axios';

import { AUTH_TOKEN } from '../utils/constants';

const setAuthToken =  async (token) => {
    if (token) {
        // Apply to every request
        axios.defaults.headers.common['Authorization'] = 'Bearer';
        axios.defaults.headers.common['Accept'] = 'application/json';
        axios.defaults.headers.common['token'] = token;
        localStorage.setItem(AUTH_TOKEN, token);
    } else {
        // Delete auth header
        delete axios.defaults.headers.common['Authorization'];
        localStorage.removeItem(AUTH_TOKEN);
    }
};

export default setAuthToken;