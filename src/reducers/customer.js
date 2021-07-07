import { SET_CURRENT_CUSTOMER, SET_CUSTOMER_PROFILE } from '../actions/types';

const initialState = {
    profile: {}
};

const customerReducer =  (state = initialState, action) => {
    switch (action.type) {
        case SET_CURRENT_CUSTOMER:
            return { ...state, ...action.payload };
        
        case SET_CUSTOMER_PROFILE:
            return {
                ...state,
                profile: { ...action.payload }
            };
            
            default:
                return state;
    }
};

export default customerReducer;