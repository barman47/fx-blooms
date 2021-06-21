import { CLEAR_ERRORS, GET_ERRORS } from '../actions/types';

const initialState = {
    error: {},
    empty: true
};

const errorsReducer = (state = initialState, action) => {
    switch (action.type) {
        case CLEAR_ERRORS:
            return {
                error: {},
                empty: true
            };
            
        case GET_ERRORS:
            return {
                error: action.payload,
                empty: false
            };

        default:
            return state;
    }
};

export default errorsReducer;