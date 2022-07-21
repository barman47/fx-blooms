import axios from 'axios';

import { AUTH_TOKEN } from '../utils/constants';

const setAuthToken =  async (token) => {
    if (token) {
        // Apply to every request
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('Setting token');
        axios.defaults.headers.common['Accept'] = 'application/json';
        // axios.defaults.headers.common['token'] = token;
        sessionStorage.setItem(AUTH_TOKEN, token);
    } else {
        // Delete auth header
        delete axios.defaults.headers.common['Authorization'];
        sessionStorage.removeItem(AUTH_TOKEN);
    }
};

export default setAuthToken;