import axios from 'axios';

import { API } from '../utils/constants';
import handleError from '../utils/handleError';
import { SET_LISTINGS } from './types';
import reIssueToken from '../utils/reIssueToken';

const URL = `${API}/Listing`;

export const getListings = () => async (dispatch) => {
    try {
        await reIssueToken();
        const res = await axios.post(`${URL}/GetListings`, {
            PageNumber: 1,
            PageSize: 1,
            CurrencyNeeded: 'NGN',
            CurrencyAvailable: 'NGN',
            MinExchangeAmount: 0
        });

        const { items, ...rest } = res.data.data;

        dispatch({
            type: SET_LISTINGS,
            payload: { listings: items, ...rest }
        });
        console.log(res);
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const addListing = (listing) => async (dispatch) => {
    try {
        await reIssueToken();
        const res = await axios.post(`${URL}/AddListing`, listing);
        console.log(res);
    } catch (err) {
        return handleError(err, dispatch);
    }
};