import axios from 'axios';
import { DASHBOARD, DASHBOARD_HOME, MESSAGES } from '../routes';

import { API } from '../utils/constants';
import handleError from '../utils/handleError';
import { ADDED_LISTING, CANCELED_NEGOTIATION, SET_CHAT, SET_LISTINGS, SET_MORE_LISTINGS, UPDATED_LISTING } from './types';
import reIssueToken from '../utils/reIssueToken';

const URL = `${API}/Listing`;

export const getAllListings = () => async (dispatch) => {
    try {
        // console.log('reIssuing token');
        await reIssueToken();
        // console.log('reIssued token');
        const res = await axios.post(`${URL}/GetAllListings`, {
            pageNumber: 0,
            pageSize: 15,
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
        console.log(res);
        return dispatch({
            type: ADDED_LISTING,
            payload: { listing: res.data.data, msg: 'Your listing has been posted successfully' }
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const updateListing = (listing) => async (dispatch) => {
    try {
        await reIssueToken();
        console.log('Editing listing ', listing);
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
        await reIssueToken();
        const res = await axios.post(`${URL}/GetListingsOpenForBid`, query);
        console.log(res);
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
        await reIssueToken();
        console.log('getting more ', query);
        const res = await axios.post(`${URL}/GetListingsOpenForBid`, query);
        console.log(res);
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
        await reIssueToken();
        console.log('adding bid');
        const res = await axios.post(`${URL}/AddBid`, bid);
        console.log(res);
        dispatch({
            type: SET_CHAT,
            payload: {
                sessionId: res.data.data
            }
        });
        history.push(`${DASHBOARD}${MESSAGES}`)
        // const { items, ...rest } = res.data.data;
        // return dispatch({
        //     type: SET_LISTINGS,
        //     payload: { listings: items, ...rest }
        // });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const cancelNegotiation = (chatSessionId, history) => async (dispatch) => {
    try {
        await reIssueToken();
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

export const completeTransaction = (data, history) => async (dispatch) => {
    try {
        await reIssueToken();
        const res = await axios.post(`${URL}/CompleteTransaction`, data);
        console.log(res);
        history.push(`${DASHBOARD}${DASHBOARD_HOME}`);
    } catch (err) {
        return handleError(err, dispatch);
    }
};