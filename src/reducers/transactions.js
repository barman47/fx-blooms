import { 
    CLEAR_TRANSACTIONS,
    CUSTOMER_CANCELED,
    SET_TRANSACTION,
    SET_TRANSACTIONS,
    SET_ALL_TRANSACTIONS,
    SET_EUR_TRANSACTIONS,
    SET_NGN_TRANSACTIONS,
    SET_TRANSACTION_TYPE,
    SET_PENDING_TRANSACTION_COUNT,
    REMOVE_TRANSACTION,
    SET_TRANSACTION_MSG
} from '../actions/types';

const initialState = {
    transactions: [],
    eurTransactions: [],
    ngnTransactions: [],
    transaction: {},
    customerCanceled: null,
    connectionStatus: null,
    sent: true,
    received: false,
    msg: null,
    pendingTransactions: 0
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

        case SET_TRANSACTION_TYPE:
            return {
                ...state,
                sent: action.payload.sent,
                received: action.payload.received  
            };

        case CLEAR_TRANSACTIONS:
            return {
                ...state,
                transaction: {},
                transactions: [],
                eurTransactions: [],
                ngnTransactions: [],
            };

        case SET_PENDING_TRANSACTION_COUNT:
            return {
                ...state,
                pendingTransactions: action.payload
            };

        case REMOVE_TRANSACTION:
            return {
                ...state,
                transactions: state.transactions.filter(transacton => transacton.id !== action.payload)
            };

        case SET_TRANSACTION_MSG:
            return {
                ...state,
                msg: action.payload
            };

        default:
            return state;
    }
};

export default transactionsReducer;