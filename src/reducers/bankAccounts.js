import { ADDED_ACCOUNT, EDITED_ACCOUNT, DELETED_ACCOUNT, SET_ACCOUNT, SET_ACCOUNTS, SET_ACCOUNT_MSG } from '../actions/types';

const initialState = {
    account: {},
    accounts: [],
    msg: null
};

const bankAccountsReducer = (state = initialState, action) => {
    let accounts = [];
    let accountIndex;
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
                    accounts: action.payload
                };
            }
            return {
                ...state,
                accounts: action.payload
            };

        case ADDED_ACCOUNT: {
            return {
                ...state,
                msg: action.payload.msg,
                accounts: [action.payload.account, ...state.accounts]
            };
        }

        case EDITED_ACCOUNT: 
            accounts = state.accounts;
            accountIndex = accounts.findIndex(account => account.accountID === action.payload.account.accountID);
            accounts[accountIndex] = action.payload.account;
            
            return {
                ...state,
                accounts: [...accounts],
                msg: action.payload.msg,
            };

        case DELETED_ACCOUNT:
            accounts = state.accounts.filter(account => account.accountID !== action.payload);
            return {
                ...state,
                accounts
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