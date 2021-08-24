import { SET_BARCODE, SET_2FA_MSG, TWO_FACTOR_AUTHORIZED } from '../actions/types';

const initialState = {
    msg: null,
    authorized: false
};

const twoFactorReducer = (state = initialState, action) => {
    switch (action.type) {      
        case SET_BARCODE:
            return action.payload;

        case SET_2FA_MSG: 
            return {
                ...state,
                msg: action.payload
            };

        case TWO_FACTOR_AUTHORIZED:
            return {
                ...state,
                authorized: true
            };

        default:
            return state;
    }
};

export default twoFactorReducer;