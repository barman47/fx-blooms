import { SET_LOADING } from '../actions/types';

const initialState = false;

const loadingReducer = (state = initialState, action) => {
    switch (action.type) {      
        case SET_LOADING:
            return action.payload;

        default:
            return state;
    }
};

export default loadingReducer;