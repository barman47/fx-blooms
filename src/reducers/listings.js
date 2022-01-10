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
    SET_LISTING_MSG
} from '../actions/types';

const initialState = {
    addedListing: false,
    bid: {},
    updatedListing: false,
    listing: {},
    listings: [],
    loading: false,
    msg: null
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
                bid: action.payload
            };

        case REMOVE_BID:
            return {
                ...state,
                bid: {}
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
                listings,
                ...rest
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

        default:
            return state;
    }
};

export default listingsReducer;