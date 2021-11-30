import { SET_ACCOUNTS, SET_ACCOUNT_MSG } from "../actions/types";

const initialState = {
    accounts: [],
    msg: null
};

const bankAccountsReducer = (state = initialState, action) => {
    switch (action.type) {      
        case SET_ACCOUNTS:
            if (action.payload.msg) {
                return {
                    ...state,
                    msg: action.payload.msg ? action.payload.msg : state.msg,
                    accounts: [...state.accounts, action.payload.account]
                };
            }
            return {
                ...state,
                accounts: action.payload
            };
            

        case SET_ACCOUNT_MSG:
            return {
                ...state,
                msg: action.payload
            };

        default:
            return state;
    }
};

export default bankAccountsReducer;