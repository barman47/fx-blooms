import { SET_BARCODE, SET_2FA_MSG } from '../actions/types';

const initialState = {
    msg: null
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

        default:
            return state;
    }
};

export default twoFactorReducer;