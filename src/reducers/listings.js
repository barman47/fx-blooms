import { 
    ADDED_BID,
    REMOVE_BID,
    ADDED_LISTING, 
    DELETED_LISTING,
    SET_LISTINGS, 
    SET_MORE_LISTINGS,
    SET_LISTING,
    CANCELED_NEGOTIATION,
    SET_LOADING_LISTINGS,
    SET_LISTING_MSG,
    HIDE_NEGOTIATION_LISTINGS,
    TOGGLE_BID_STATUS,
    SET_RECOMMENDED_RATE,
    REMOVE_EXPIRED_LISTING
} from '../actions/types';

import { LISTING_STATUS } from '../utils/constants';

const initialState = {
    addedListing: false,
    addedBid: false,
    bid: {},
    updatedListing: false,
    listing: {},
    listings: [],
    loading: false,
    msg: null,
    recommendedRate: null
};

const listingsReducer = (state = initialState, action) => {
    let listingId;
    let listingIndex;
    let listingsList = [];
    let listing = {};
    let updatedListing = {};

    switch (action.type) {   
        case ADDED_BID:
            return {
                ...state,
                bid: action.payload.bid,
                addedBid: action.payload.addedBid
            };

        case REMOVE_BID:
            return {
                ...state,
                bid: {}
            };

        case TOGGLE_BID_STATUS:
            return {
                ...state,
                addedBid: !state.addedBid
            };

        case ADDED_LISTING:
            return action.payload ? {
                ...state,
                listings: [action.payload.listing, ...state.listings],
                addedListing: !state.addedListing,
                msg: action.payload.msg ? action.payload.msg : null
            } : {
                ...state,
                addedListing: !state.addedListing,
                msg: null
            };
        
        case DELETED_LISTING:
            listingId = action.payload.id;
            listingIndex = state.listings.findIndex(listing => listing.id === listingId);
            listingsList = [...state.listings];
            listingsList.splice(listingIndex, 1);
            return {
                ...state,
                listings: [...listingsList]
            };
        
        case SET_LISTING:
            return {
                ...state,
                listing: action.payload
            };
        
        case SET_LISTINGS: 
            const { listings, ...rest } = action.payload;
            return {
                ...state,
                listings,
                ...rest
            };

        case HIDE_NEGOTIATION_LISTINGS:
            return {
                ...state,
                listings: state.listings.filter(listing => listing.status !== LISTING_STATUS.negotiation)
            };

        case SET_MORE_LISTINGS: 
            const {
                currentPageNumber,
                currentPageSize,
                hasNext,
                totalItemCount,
                totalPageCount
            } = action.payload;
            
            return {
                ...state,
                listings: [...state.listings, ...action.payload.listings],
                currentPageNumber,
                currentPageSize,
                hasNext,
                totalItemCount,
                totalPageCount
            };

        case CANCELED_NEGOTIATION:
            listingsList = [...state.listings];
            listing = {...action.payload.listing};
            listingId = listing.id;
            listingIndex = listingsList.findIndex(item => item.id === listingId);
            updatedListing = { ...listing };
            listingsList.splice(listingIndex, 1, updatedListing);

            return {
                ...state,
                listing: {},
                listings: [...listingsList],
                updatedListing: !state.addedListing,
                msg: action.payload.msg
            };

        case SET_LOADING_LISTINGS:
            return {
                ...state,
                loading: action.payload
            };

        case SET_LISTING_MSG:
            return {
                ...state,
                msg: action.payload
            };

        case REMOVE_EXPIRED_LISTING:
            return {
                ...state,
                listings: state.listings.filter(listing => listing.id !== action.payload)
            };

        case SET_RECOMMENDED_RATE:
            return {
                ...state,
                recommendedRate: action.payload
            };

        default:
            return state;
    }
};

export default listingsReducer;