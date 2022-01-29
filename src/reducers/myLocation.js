import { SET_MY_IP } from '../actions/types';

const initialState = {
    ip: null
};

const errorsReducer = (state = initialState, action) => {
    switch (action.type) {      
        case SET_MY_IP:
            return {
                ...state,
                ip: action.payload
            };

        default:
            return state;
    }
};

export default errorsReducer;