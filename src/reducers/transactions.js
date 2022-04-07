import { 
    CUSTOMER_CANCELED,
    SET_TRANSACTION,
    SET_TRANSACTIONS,
    SET_ALL_TRANSACTIONS,
    SET_EUR_TRANSACTIONS,
    SET_NGN_TRANSACTIONS,
} from '../actions/types';

const initialState = {
    transactions: [],
    eurTransactions: [],
    ngnTransactions: [],
    transaction: {},
    customerCanceled: null,
    connectionStatus: null,
    msg: null
};

const transactionsReducer = (state = initialState, action) => {
    let transactions = [];

    switch (action.type) {    
        case CUSTOMER_CANCELED:
            return {
                ...state,
                customerCanceled: action.payload
            };

        case SET_TRANSACTION:
            return {
                ...state,
                transaction: action.payload
            };

        case SET_TRANSACTIONS:
            return {
                ...state,
                transactions: action.payload
            };

        case SET_ALL_TRANSACTIONS:
            return {
                ...state,
                eurTransactions: [],
                ngnTransactions: [],
            };

        case SET_EUR_TRANSACTIONS:
            state.transactions.forEach(transaction => {
                if (transaction.buyer.customerId === action.payload && transaction.buyer.currency === 'EUR') {
                    transactions.push(transaction);
                }
                if (transaction.seller.customerId === action.payload && transaction.seller.currency === 'EUR') {
                    transactions.push(transaction);
                }
            });

            return {
                ...state,
                ngnTransactions: [],
                eurTransactions: transactions
            };

        case SET_NGN_TRANSACTIONS:
            state.transactions.forEach(transaction => {
                if (transaction.buyer.customerId === action.payload && transaction.buyer.currency === 'NGN') {
                    transactions.push(transaction);
                }
                if (transaction.seller.customerId === action.payload && transaction.seller.currency === 'NGN') {
                    transactions.push(transaction);
                }
            });

            return {
                ...state,
                eurTransactions: [],
                ngnTransactions: transactions
            };

        default:
            return state;
    }
};

export default transactionsReducer;