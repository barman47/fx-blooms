import { SET_STATS } from '../actions/types';

const initialState = {};

const statsREducer = (state = initialState, action) => {
    switch (action.type) {      
        case SET_STATS:
            return action.payload;

        default:
            return state;
    }
};

export default statsREducer;