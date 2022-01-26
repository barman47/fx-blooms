import { SET_MY_LOCATION } from '../actions/types';

const initialState = null;

const errorsReducer = (state = initialState, action) => {
    switch (action.type) {      
        case SET_MY_LOCATION:
            return action.payload;

        default:
            return state;
    }
};

export default errorsReducer;