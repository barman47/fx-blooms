import { SET_CURRENT_CUSTOMER } from '../actions/types';

const initialState = {};

const customerReducer =  (state = initialState, action) => {
    switch (action.type) {
        case SET_CURRENT_CUSTOMER:
            return { ...action.payload };
            
            default:
                return state;
    }
};

export default customerReducer;