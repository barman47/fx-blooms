import { 
    ADDED_LISTING, 
    HIDE_NEGOTIATION_LISTINGS, 
    SET_LISTINGS, 
    SET_MORE_LISTINGS,
    SET_LISTING,
    UPDATED_LISTING, 
    CANCELED_NEGOTIATION
} from '../actions/types';
import { LISTING_STATUS } from '../utils/constants';

const initialState = {
    addedListing: false,
    updatedListing: false,
    listing: {},
    listings: []
};

const listingsReducer = (state = initialState, action) => {
    let listingId;
    let listingIndex;
    let listingsList = [];
    let listing = {};
    let updatedListing = {};

    switch (action.type) {   
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

        case UPDATED_LISTING: 
        // listing update logic here
            listingsList = [...state.listings];
            listing = {...action.payload.listing};
            listingId = listing.id;
            listingIndex = listingsList.findIndex(item => item.id === listingId);
            updatedListing = { ...listing };
            listingsList.splice(listingIndex, 1, updatedListing);

            return {
                ...state,
                listing: { ...updatedListing },
                listings: [...listingsList],
                updatedListing: !state.addedListing,
                msg: action.payload.msg
            }; 

        case HIDE_NEGOTIATION_LISTINGS: 
            return {
                listings: state.listings.filter(listing => listing.status !== LISTING_STATUS.negotiation)
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

        default:
            return state;
    }
};

export default listingsReducer;