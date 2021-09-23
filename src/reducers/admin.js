import { SET_CURRENT_ADMIN } from '../actions/types';

const initialState = {
    profile: {},
    isAuthenticated: false
};

const customerReducer =  (state = initialState, action) => {
    switch (action.type) {
        case SET_CURRENT_ADMIN:
            return { ...state, ...action.payload };
            
            default:
                return state;
    }
};

export default customerReducer;