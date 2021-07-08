import axios from 'axios';

import { API } from '../utils/constants';
import handleError from '../utils/handleError';
import { ADDED_LISTING, SET_LISTINGS } from './types';
import reIssueToken from '../utils/reIssueToken';

const URL = `${API}/Listing`;

export const getListings = () => async (dispatch) => {
    try {
        await reIssueToken();
        const res = await axios.post(`${URL}/GetAllListings`, {
            pageNumber: 0,
            pageSize: 10,
            currencyNeeded: 'NGN',
            currencyAvailable: 'NGN',
            minimumExchangeAmount: 0,
            useCurrencyFilter: false
        });
        const { items, ...rest } = res.data.data;
        console.log(res);

        dispatch({
            type: SET_LISTINGS,
            payload: { listings: items, ...rest }
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const addListing = (listing) => async (dispatch) => {
    try {
        await reIssueToken();
        const res = await axios.post(`${URL}/AddListing`, listing);
        return dispatch({
            type: ADDED_LISTING,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};