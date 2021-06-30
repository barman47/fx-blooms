import { SET_CURRENCIES } from '../actions/types';

const initialState = [];

const customerReducer =  (state = initialState, action) => {
    switch (action.type) {
        case SET_CURRENCIES:
            return  [...action.payload];
            
            default:
                return state;
    }
};

export default customerReducer;