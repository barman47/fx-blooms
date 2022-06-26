import axios from 'axios';
import { batch } from 'react-redux';
import { DASHBOARD_HOME, EDIT_LISTING } from '../routes';

import getRecommendedRate from '../utils/getRecommendedRate';
import handleError from '../utils/handleError';
import { 
    ADDED_BID, 
    ADDED_LISTING, 
    CANCELED_NEGOTIATION, 
    DELETED_LISTING, 
    GET_ERRORS,
    REMOVE_NOTIFICATION,
    SET_AS_ACCEPTED,
    SET_BID,
    SET_BIDS,
    SET_CUSTOMER_MSG,
    SET_LISTING, 
    SET_LISTINGS, 
    SET_LISTING_MSG,
    SET_LOADING, 
    SET_MORE_LISTINGS,
    SET_RECOMMENDED_RATE,
    SET_REQUIRED_CURRENCY,
    UPDATED_LISTING 
} from './types';
import { markNotificationAsRead } from './notifications';
import reIssueCustomerToken from '../utils/reIssueCustomerToken';

const API = `${process.env.REACT_APP_BACKEND_API}`;
const URL = `${API}/Listing`;

export const getBids = (listingId) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.post(`${URL}/GetAllBidsbyListingId?listingId=${listingId}`, { pageNumber: 1, pageSize: 50 });
        const bids = res.data.data.result.items;
        return dispatch({
            type: SET_BIDS,
            payload: bids
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const addListing = (listing) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.post(`${URL}/AddListing`, listing);
        const msg = listing.AmountAvailable.CurrencyType === 'EUR' ? 'Offer successfully created. The EUR amount is now temporarily unavailabe (escrowed)' : 'Offer successfully created. You will be notified once a buyer accepts your offer';
        return batch(() => {
            dispatch({
                type: ADDED_LISTING,
                payload: { listing: res.data.data, msg }
            });
            dispatch({
                type: SET_REQUIRED_CURRENCY,
                payload: {
                    availableCurrency: listing.currencyNeeded,
                    requiredCurrency: listing.AmountAvailable.CurrencyType  
                }
            });
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getListing = (id) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.get(`${URL}/GetListing/${id}`);
        return dispatch({
            type: SET_LISTING,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const checkListingEditable = (listing, navigate) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.get(`${URL}/Editable/${listing.id}`);
        const editable = res.data.data;
        if (editable) {
            dispatch({
                type: SET_LISTING,
                payload: listing
            });
            return navigate(EDIT_LISTING);
        }
        return dispatch({
            type: GET_ERRORS,
            payload: { msg: 'You can not edit an accepted offer.' }
        });
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

export const getBid = (bidId) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.get(`${URL}/GetBid?id=${bidId}`);
        return dispatch({
            type: SET_BID,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const removeExpiredListings = () => async (dispatch) => {
    try {
        await Promise.all([
            reIssueCustomerToken(),
            axios.post(`${API}/Admin/RemoveExpiredListingsAndBids`)
        ]);
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

export const getListingsOpenForBid = (query, setRecommendedRate) => async (dispatch) => {
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
                type: SET_LOADING,
                payload: false
            });
            if (setRecommendedRate && items.length > 0) {
                dispatch({
                    type: SET_RECOMMENDED_RATE,
                    payload: getRecommendedRate(items)
                });
            }
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

export const acceptOffer = (data, listing) => async (dispatch) => {
    try {
        await reIssueCustomerToken()
        const res = await axios.post(`${URL}/AcceptOffer`, data);
        batch(() => {
            dispatch({
                type: ADDED_BID,
                payload: {
                    bid: res.data.data,
                    listing,
                }
            });
            dispatch({
                type: SET_LISTING_MSG,
                payload: `Offer accepted! ${listing.listedBy} will transfer ${listing.amountNeeded.currencyType}${listing.amountAvailable.amount} within 30 minutes`
            });
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const addBid = (bid, listing) => async (dispatch) => {
    try {
        await reIssueCustomerToken()
        const res = await axios.post(`${URL}/AddBid`, bid);
        dispatch({
            type: ADDED_BID,
            payload: {
                bid: res.data.data,
                listing,
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
        batch(() => {
            dispatch({
                type: SET_AS_ACCEPTED,
                payload: data.listingId
            });
            dispatch({
                type: SET_LISTING_MSG,
                payload: 'Payment made successfully'
            });
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const madePaymentV2 = (data, notificationId) => async (dispatch) => {
    try {
        await Promise.all([reIssueCustomerToken(), axios.post(`${URL}/MadePaymentV2`, data)]);
        dispatch({
            type: REMOVE_NOTIFICATION,
            payload: notificationId
        });
        dispatch({
            type: SET_LISTING_MSG,
            payload: 'Payment made successfully'
        });
        return dispatch(markNotificationAsRead(notificationId));
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const cancelBid = (bidIds) => async (dispatch) => {
    try {
        await Promise.all([reIssueCustomerToken(), axios.post(`${URL}/CancelBid`, { bidIds })]);
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const cancelNegotiation = (chatSessionId, navigate) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.post(`${URL}/CancelNegotiation?chatSessioId=${chatSessionId}`);
        dispatch({
            type: CANCELED_NEGOTIATION,
            payload: res.data.data
        });
        navigate(DASHBOARD_HOME);
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const completeTransaction = (data, notificationId) => async (dispatch) => {
    try {
        await Promise.all([
            reIssueCustomerToken(),
            axios.post(`${URL}/CompleteTransaction`, data)
        ]);
        batch(() => {
            dispatch({
                type: SET_CUSTOMER_MSG,
                payload: 'Payment confirmed successfully'
            });
            dispatch({
                type: REMOVE_NOTIFICATION,
                payload: notificationId
            });
        });
        return dispatch(markNotificationAsRead(notificationId));
    } catch (err) {
        return handleError(err, dispatch);
    }
};