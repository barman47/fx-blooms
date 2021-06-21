import { SET_CURRENT_CUSTOMER } from '../actions/types';

const initialState = {
    authenticated: false,
    customer: {}
};

const customerReducer =  (state = initialState, action) => {
    switch (action.type) {
        case SET_CURRENT_CUSTOMER:
            return {
                ...state,
                authenticated: !state.authenticated,
                customer: action.payload
            };
            
            default:
                return state;
    }
};

export default customerReducer;