import { SET_CUSTOMER_COUNT, SET_LISTING_COUNT, SET_STATS, SET_TRANSACTION_VOLUME, TOGGLE_STATS_CHANGE_STATUS } from '../actions/types';

const initialState = {
    changed: false
};

const statsREducer = (state = initialState, action) => {
    switch (action.type) {      
        case SET_STATS:
            return {
                ...state,
                ...action.payload
            };

        case SET_CUSTOMER_COUNT:
            return {
                ...state,
                customerCount: action.payload,
                changed: true
            };

        case SET_LISTING_COUNT:
            return {
                ...state,
                listingCount: action.payload,
                changed: true
            };

        case SET_TRANSACTION_VOLUME:
            return {
                ...state,
                transactionVolume: action.payload,
                changed: true
            };

        case TOGGLE_STATS_CHANGE_STATUS:
            return {
                ...state,
                changed: !state.changed
            };

        default:
            return state;
    }
};

export default statsREducer;