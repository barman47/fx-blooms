import { SET_BARCODE } from '../actions/types';

const initialState = {};

const twoFactorReducer = (state = initialState, action) => {
    switch (action.type) {      
        case SET_BARCODE:
            return action.payload

        default:
            return state;
    }
};

export default twoFactorReducer;