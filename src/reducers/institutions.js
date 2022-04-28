import { SET_INSTITUTIONS } from '../actions/types';


const initialState = []

const insitutionsReducer =  (state = initialState, action) => {
    switch (action.type) {
        case SET_INSTITUTIONS:
            return action.payload;
            
            default:
                return state;
    }
};

export default insitutionsReducer;