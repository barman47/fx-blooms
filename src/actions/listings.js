import axios from 'axios';
import { DASHBOARD, DASHBOARD_HOME, MESSAGES } from '../routes';

import { API } from '../utils/constants';
import handleError from '../utils/handleError';
import { ADDED_LISTING, CANCELED_NEGOTIATION, SET_CHAT, SET_LISTINGS, SET_MORE_LISTINGS, UPDATED_LISTING } from './types';
import reIssueCustomerToken from '../utils/reIssueCustomerToken';

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
        await reIssueCustomerToken();
        await axios.delete(`${URL}/DeleteListing?listingId=${listingId}`);
        // return dispatch({
        //     type: ADDED_LISTING,
        //     payload: { listing: res.data.data, msg: 'Your listing has been posted successfully' }
        // });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const updateListing = (listing) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.patch(`${URL}/UpdateList`, listing);
        return dispatch({
            type: UPDATED_LISTING,
            payload: { listing: res.data.data, msg: 'Your listing has been updated successfully' }
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
        return dispatch({
            type: SET_LISTINGS,
            payload: { listings: items, ...rest }
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

export const addBid = (bid, history) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.post(`${URL}/AddBid`, bid);
        dispatch({
            type: SET_CHAT,
            payload: res.data.data
        });
        return history.push(`${DASHBOARD}${MESSAGES}`)
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
        await reIssueCustomerToken();
        await axios.post(`${URL}/CompleteTransaction`, data);
    } catch (err) {
        return handleError(err, dispatch);
    }
};