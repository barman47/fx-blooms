import { ADDED_ACCOUNT } from '../actions/types';

const initialState = {};

const accountReducer = (state = initialState, action) => {
    switch (action.type) {      
        case ADDED_ACCOUNT:
            if (action.payload) {
                return { ...state, msg: action.payload };
            }
            let data = { ...state };
            delete data.msg
            return { ...data };

        default:
            return state;
    }
};

export default accountReducer;