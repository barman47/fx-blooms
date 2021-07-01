import { ADDED_SUBSCRIPTION } from '../actions/types';

const initialState = false;

const subscriptionReducer = (state = initialState, action) => {
    switch (action.type) {      
        case ADDED_SUBSCRIPTION:
            return !state;

        default:
            return state;
    }
};

export default subscriptionReducer;