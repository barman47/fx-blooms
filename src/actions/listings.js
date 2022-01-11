import axios from 'axios';
import { DASHBOARD, DASHBOARD_HOME } from '../routes';

import { API } from '../utils/constants';
import handleError from '../utils/handleError';
import { ADDED_BID, ADDED_LISTING, CANCELED_NEGOTIATION, DELETED_LISTING, SET_LISTINGS, SET_LOADING_LISTINGS, SET_MORE_LISTINGS } from './types';
import reIssueCustomerToken from '../utils/reIssueCustomerToken';
import { batch } from 'react-redux';

const URL = `${API}/Listing`;

export const getAllListings = () => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.post(`${URL}/GetAllListings`, {
            pageNumber: 0,
            pageSize: 15,
            currencyNeeded: 'NGN',
            currencyAvailable: 'NGN',
            minimumExchangeAmount: 0,
            useCurrencyFilter: false
        });
        const { items, ...rest } = res.data.data;

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
        await reIssueCustomerToken();
        const res = await axios.post(`${URL}/AddListing`, listing);
        return dispatch({
            type: ADDED_LISTING,
            payload: { listing: res.data.data, msg: 'Your listing has been posted successfully' }
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const deleteListing = (listingId) => async (dispatch) => {
    try {
        await Promise.all([
            reIssueCustomerToken(),
            axios.post(`${URL}/DeleteListing/${listingId}`)
        ]);

        return dispatch({
            type: DELETED_LISTING,
            payload: { id: listingId }
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getListingsOpenForBid = (query) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.post(`${URL}/GetListingsOpenForBid`, query);
        const { items, ...rest } = res.data.data;
        batch(() => {
            dispatch({
                type: SET_LISTINGS,
                payload: { listings: items, ...rest }
            });
            dispatch({
                type: SET_LOADING_LISTINGS,
                payload: false
            });
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getMoreListings = (query) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.post(`${URL}/GetListingsOpenForBid`, query);
        const { items, currentPageNumber, currentPageSize, hasNext, totalItemCount, totalPageCount } = res.data.data;
        return dispatch({
            type: SET_MORE_LISTINGS,
            payload: { 
                listings: items,
                currentPageNumber,
                currentPageSize,
                hasNext,
                totalItemCount,
                totalPageCount
            }
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const addBid = (bid) => async (dispatch) => {
    try {
        await reIssueCustomerToken()
        const res = await axios.post(`${URL}/AddBid`, bid);
        return dispatch({
            type: ADDED_BID,
            payload: {
                bid: res.data.data,
                addedBid: true
            }
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const madePayment = (data) => async (dispatch) => {
    try {
        await Promise.all([reIssueCustomerToken(), axios.post(`${URL}/MadePayment`, data)]);
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const cancelNegotiation = (chatSessionId, history) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.post(`${URL}/CancelNegotiation?chatSessioId=${chatSessionId}`);
        dispatch({
            type: CANCELED_NEGOTIATION,
            payload: res.data.data
        });
        history.push(`${DASHBOARD}${DASHBOARD_HOME}`);
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const completeTransaction = (data) => async (dispatch) => {
    try {
        await Promise.all([
            reIssueCustomerToken(),
            axios.post(`${URL}/CompleteTransaction`, data)
        ]);
    } catch (err) {
        return handleError(err, dispatch);
    }
};