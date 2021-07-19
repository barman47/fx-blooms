import { 
    ADDED_LISTING, 
    HIDE_NEGOTIATION_LISTINGS, 
    SET_LISTINGS, 
    SET_LISTING,
    UPDATED_LISTING 
} from '../actions/types';
import { LISTING_STATUS } from '../utils/constants';

const initialState = {
    addedListing: false,
    updatedListing: false,
    listing: {},
    listings: []
};

const listingsReducer = (state = initialState, action) => {
    switch (action.type) {   
        case ADDED_LISTING:
            return {
                ...state,
                listings: [...state.listings, action.payload],
                addedListing: !state.addedListing,
                msg: action.payload
            };
        
        case SET_LISTING:
            console.log(action.payload);
            return {
                ...state,
                listing: action.payload
            };
        
        case SET_LISTINGS: 
            const { listings, ...rest } = action.payload;
            return {
                listings: action.payload.listings,
                ...rest
            };

        case UPDATED_LISTING: 
            return {
                ...state,
                updatedListing: !state.addedListing,
                msg: action.payload.msg
            }; 

        case HIDE_NEGOTIATION_LISTINGS: 
            return {
                listings: state.listings.filter(listing => listing.status !== LISTING_STATUS.negotiation)
            };

        default:
            return state;
    }
};

export default listingsReducer;