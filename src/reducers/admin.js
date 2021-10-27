import { RESET_ADMIN_SESSION, SET_CURRENT_ADMIN } from '../actions/types';

const initialState = {
    profile: {},
    isAuthenticated: false,
    resetSession: false
};

const customerReducer =  (state = initialState, action) => {
    switch (action.type) {
        case SET_CURRENT_ADMIN:
            return { ...state, ...action.payload };

        case RESET_ADMIN_SESSION:
            return {
                ...state,
                resetSession: action.payload
            };
            
            default:
                return state;
    }
};

export default customerReducer;