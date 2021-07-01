import { ADDED_LISTING, SET_LISTINGS, SET_LISTING } from '../actions/types';

const initialState = {
    addedListing: false,
    listing: {},
    listings: []
};

const errorsReducer = (state = initialState, action) => {
    switch (action.type) {   
        case ADDED_LISTING:
            return {
                ...state,
                addedListing: !state.addedListing,
                msg: action.payload
            };
        
        case SET_LISTING:
            return {
                ...state,
                listing: { ...action.payload }
            };
        
        case SET_LISTINGS: 
            const { listings, ...rest } = action.payload;
            return {
                listings: action.payload.listings,
                ...rest
            };

        default:
            return state;
    }
};

export default errorsReducer;