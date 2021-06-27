import { SET_DOCUMENTS } from '../actions/types';

const initialState = []

const documentsReducer =  (state = initialState, action) => {
    switch (action.type) {
        case SET_DOCUMENTS:
            return action.payload;
            
            default:
                return state;
    }
};

export default documentsReducer;