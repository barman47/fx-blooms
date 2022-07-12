import {
    SET_REQUIRED_CURRENCY,
    GET_LISTING,
    ADDED_BID,
    ADDED_LISTING,
    DELETED_LISTING,
    SET_BID,
    SET_BIDS,
    SET_LISTINGS,
    SET_DELETED_LISTINGS,
    SET_FINALISED_LISTINGS,
    SET_INPROGRESS_LISTINGS,
    SET_ACTIVE_LISTINGS,
    SET_MORE_LISTINGS,
    SET_LISTING,
    CANCELED_NEGOTIATION,
    SET_AS_ACCEPTED,
    SET_LISTING_MSG,
    HIDE_NEGOTIATION_LISTINGS,
    TOGGLE_BID_STATUS,
    SET_RECOMMENDED_RATE,
    LISTING_SEARCH_RESULT,
    REMOVE_EXPIRED_LISTING,
    MAKE_LISTING_OPEN,
    UPDATED_LISTING,
    CREDIT_LISTING,
    VIEW_LISTING,
    SET_BUY,
    SET_SELL
} from '../actions/types';

import { BID_STATUS, LISTING_STATUS } from "../utils/constants";

const initialState = {
    availableCurrency: 'NGN',
    requiredCurrency: 'EUR',
    buy: true,
    sell: false,
    addedListing: false,
    editedListing: false,
    addedBid: false,
    bid: {},
    bids: [],
    updatedListing: false,
    listing: {},
    listings: [],
    activeListings: [],
    finalisedListings: [],
    inProgressListings: [],
    deletedListings: [],
    loading: false,
    listingSearches: [],
    msg: null,
    recommendedRate: null,
    credit: null,
    listingSearchResult: [],
};

const listingsReducer = (state = initialState, action) => {
    let listingId;
    let listingIndex;
    let listingsList = [];
    let listing = {};
    let updatedListing = {};

    switch (action.type) {
        case SET_REQUIRED_CURRENCY:
            return {
                ...state,
                availableCurrency: action.payload.availableCurrency,
                requiredCurrency: action.payload.requiredCurrency,
            };

        case SET_BUY:
            return {
                ...state,
                buy: true,
                sell: false
            };

        case SET_SELL:
            return {
                ...state,
                buy: false,
                sell: true
            };

        case ADDED_BID:
            listingId = action.payload.listing.id;
            listingIndex = state.listings.findIndex(
                (listing) => listing.id === listingId
            );
            listingsList = [...state.listings];
            listing = {
                ...action.payload.listing,
                status: LISTING_STATUS.negotiation,
                bids: [...action.payload.listing.bids, action.payload.bid],
            };
            listingsList.splice(listingIndex, 1, listing);
            return {
                ...state,
                bid: action.payload.bid,
                addedBid: action.payload.addedBid,
                listing,
                listings: listingsList,
            };

        case SET_BID:
            return {
                ...state,
                bid: action.payload,
            };

        case SET_BIDS:
            return {
                ...state,
                bids: action.payload
            };

        case SET_AS_ACCEPTED:
            listingId = action.payload;
            listingIndex = state.listings.findIndex(
                (listing) => listing.id === listingId
            );
            listingsList = [...state.listings];
            listing = {
                ...state.listings[listingIndex],
                status: LISTING_STATUS.negotiation,
            };
            listingsList.splice(listingIndex, 1, listing);
            return {
                ...state,
                listings: [...listingsList],
            };

        case TOGGLE_BID_STATUS:
            return {
                ...state,
                addedBid: !state.addedBid,
            };

        case ADDED_LISTING:
            return action.payload
                ? {
                      ...state,
                      listings: [action.payload.listing, ...state.listings],
                      addedListing: !state.addedListing,
                      msg: action.payload.msg ? action.payload.msg : null,
                  }
                : {
                      ...state,
                      addedListing: !state.addedListing,
                      msg: null,
                  };

        case UPDATED_LISTING:
            return action.payload
                ? {
                      ...state,
                      editedListing: !state.editedListing,
                      msg: action.payload.msg ? action.payload.msg : null,
                  }
                : {
                      ...state,
                      editedListing: !state.editedListing,
                      msg: null,
                  };

        case DELETED_LISTING:
            listingId = action.payload.id;
            listingIndex = state.listings.findIndex(
                (listing) => listing.id === listingId
            );
            listingsList = [...state.listings];
            listingsList.splice(listingIndex, 1);
            return {
                ...state,
                listings: [...listingsList],
            };
        case VIEW_LISTING:
            const WF = "BUY";
            return {
                ...state,
                listing: {
                    ...action.payload,
                    workFlow:
                        action.payload.amountAvailable.currencyType === "EUR"
                            ? `${WF} ${action.payload.amountAvailable.currencyType}`
                            : `${WF} ${action.payload.amountAvailable.currencyType}`,
                },
            };

        case SET_LISTING:
            return {
                ...state,
                listing: action.payload,
            };

        case SET_LISTINGS:
            const { listings, ...rest } = action.payload;
            return {
                ...state,
                listings,
                ...rest,
            };

        case LISTING_SEARCH_RESULT:
            // const { listings: searchListings } = action.payload;
            console.log(action.payload);
            return {
                ...state,
                listingSearchResult: action.payload.listings,
                ...action.payload.rest,
            };

        case SET_ACTIVE_LISTINGS:
            return {
                ...state,
                activeListings: action.payload,
            };

        case SET_INPROGRESS_LISTINGS:
            return {
                ...state,
                inProgressListings: action.payload,
            };

        case SET_FINALISED_LISTINGS:
            return {
                ...state,
                finalisedListings: action.payload,
            };

        case SET_DELETED_LISTINGS:
            return {
                ...state,
                deletedListings: action.payload,
            };
        
        case GET_LISTING:
            return {
                ...state,
                listing: state.listings.find(
                    (listing) => listing.id === action.payload
                ),
            };

        case HIDE_NEGOTIATION_LISTINGS:
            return {
                ...state,
                listings: state.listings.filter(
                    (listing) => listing.status === LISTING_STATUS.open
                ),
            };

        case SET_MORE_LISTINGS:
            const {
                currentPageNumber,
                currentPageSize,
                hasNext,
                totalItemCount,
                totalPageCount,
            } = action.payload;

            return {
                ...state,
                listings: [...state.listings, ...action.payload.listings],
                currentPageNumber,
                currentPageSize,
                hasNext,
                totalItemCount,
                totalPageCount,
            };

        case CANCELED_NEGOTIATION:
            listingsList = [...state.listings];
            listing = { ...action.payload.listing };
            listingId = listing.id;
            listingIndex = listingsList.findIndex(
                (item) => item.id === listingId
            );
            updatedListing = { ...listing };
            listingsList.splice(listingIndex, 1, updatedListing);

            return {
                ...state,
                listing: {},
                listings: [...listingsList],
                updatedListing: !state.addedListing,
                msg: action.payload.msg,
            };

        case SET_LISTING_MSG:
            return {
                ...state,
                msg: action.payload,
            };

        case CREDIT_LISTING:
            return {
                ...state,
                credit: action.payload,
            };

        case REMOVE_EXPIRED_LISTING:
            return {
                ...state,
                listings: state.listings.filter(
                    (listing) => listing.id !== action.payload
                ),
            };

        case SET_RECOMMENDED_RATE:
            return {
                ...state,
                recommendedRate: action.payload,
            };

        case MAKE_LISTING_OPEN:
            listingId = action.payload;
            listingIndex = state.listings.findIndex(
                (listing) => listing.id === listingId
            );
            listingsList = [...state.listings];
            listing = listingsList[listingIndex];
            const { status, bids, ...others } = listing;
            const listingBids = bids.map((bid) => ({
                ...bid,
                status: BID_STATUS.CANCELED,
            }));
            listingsList.splice(listingIndex, 1, {
                ...others,
                bids: listingBids,
                status: LISTING_STATUS.open,
            });
            return {
                ...state,
                listings: [...listingsList],
            };

        default:
            return state;
    }
};

export default listingsReducer;
