import { DELETED_ACCOUNT, SET_ACCOUNT, SET_ACCOUNTS, SET_ACCOUNT_MSG } from "../actions/types";

const initialState = {
    account: {},
    accounts: [],
    msg: null
};

const bankAccountsReducer = (state = initialState, action) => {
    let accounts = []
    switch (action.type) {   
        case SET_ACCOUNT:
            return {
                ...state,
                account: action.payload
            };   
            
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

        case DELETED_ACCOUNT:
            accounts = state.accounts.filter(account => account.id !== action.payload);
            
            return {
                ...state,
                accounts: [...accounts]
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