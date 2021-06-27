import { SET_COUNTRIES } from '../actions/types';

const initialState = []

const countriesReducer =  (state = initialState, action) => {
    switch (action.type) {
        case SET_COUNTRIES:
            return action.payload;
            
            default:
                return state;
    }
};

export default countriesReducer;