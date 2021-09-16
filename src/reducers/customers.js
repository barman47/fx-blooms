import { 
    CLEAR_CUSTOMER_STATUS_MSG,
    SET_CUSTOMER, 
    SET_CUSTOMERS, 
    SET_MORE_CUSTOMERS, 
    SET_CUSTOMER_STATUS, 
    SET_NEW_CUSTOMERS,
    SET_MORE_NEW_CUSTOMERS,
    SET_CONFIRMED_CUSTOMERS,
    SET_MORE_CONFIRMED_CUSTOMERS,
    SET_REJECTED_CUSTOMERS,
    SET_MORE_REJECTED_CUSTOMERS,
    SET_ALL_CUSTOMERS,
    CLEAR_ALL_CUSTOMERS,
    SET_ID_CHECK_DATA,
    SET_PROFILE_CHECK_DATA
} from '../actions/types';

import { CONFIRMED, PENDING, REJECTED } from '../utils/constants';

const initialState = {
    customer: {},
    idCheckData: null,
    profileCheckData: null,
    customers: {},
    confirmed: {},
    pending: {},
    rejected: {},
    msg: null
};

const customersReducer = (state = initialState, action) => {
    let customers = [];
    let customerId;
    let customerIndex;
    let status;
    let updatedCustomer = {};

    switch (action.type) {
        case SET_CUSTOMER:
            return {
                ...state,
                customer: action.payload
            };

        case SET_NEW_CUSTOMERS:
            return {
                ...state,
                pending: {
                    items: action.payload.items,
                    totalItemCount: action.payload.totalItemCount,
                    totalPageCount: action.payload.totalPageCount,
                    currentPageSize: action.payload.currentPageSize,
                    currentPageNumber: action.payload.currentPageNumber,
                    hasNext: action.payload.hasNext,
                    hasPrevious: action.payload.hasPrevious,
                }
            };

        case SET_MORE_NEW_CUSTOMERS:
            return {
                ...state,
                pending: {
                    items: [...state.pending.items, ...action.payload.items],
                    totalItemCount: action.payload.totalItemCount,
                    totalPageCount: action.payload.totalPageCount,
                    currentPageSize: action.payload.currentPageSize,
                    currentPageNumber: action.payload.currentPageNumber,
                    hasNext: action.payload.hasNext,
                    hasPrevious: action.payload.hasPrevious,
                }
            };

        case SET_CONFIRMED_CUSTOMERS:
            return {
                ...state,
                confirmed: {
                    items: action.payload.items,
                    totalItemCount: action.payload.totalItemCount,
                    totalPageCount: action.payload.totalPageCount,
                    currentPageSize: action.payload.currentPageSize,
                    currentPageNumber: action.payload.currentPageNumber,
                    hasNext: action.payload.hasNext,
                    hasPrevious: action.payload.hasPrevious,
                }
            };

        case SET_MORE_CONFIRMED_CUSTOMERS:
            return {
                ...state,
                confirmed: {
                    items: [...state.confirmed.items, ...action.payload.items],
                    totalItemCount: action.payload.totalItemCount,
                    totalPageCount: action.payload.totalPageCount,
                    currentPageSize: action.payload.currentPageSize,
                    currentPageNumber: action.payload.currentPageNumber,
                    hasNext: action.payload.hasNext,
                    hasPrevious: action.payload.hasPrevious,
                }
            };

        case SET_REJECTED_CUSTOMERS:
            return {
                ...state,
                rejected: {
                    items: action.payload.items,
                    totalItemCount: action.payload.totalItemCount,
                    totalPageCount: action.payload.totalPageCount,
                    currentPageSize: action.payload.currentPageSize,
                    currentPageNumber: action.payload.currentPageNumber,
                    hasNext: action.payload.hasNext,
                    hasPrevious: action.payload.hasPrevious,
                }
            };

        case SET_MORE_REJECTED_CUSTOMERS:
            return {
                ...state,
                rejected: {
                    items: [...state.rejected.items, ...action.payload.items],
                    totalItemCount: action.payload.totalItemCount,
                    totalPageCount: action.payload.totalPageCount,
                    currentPageSize: action.payload.currentPageSize,
                    currentPageNumber: action.payload.currentPageNumber,
                    hasNext: action.payload.hasNext,
                    hasPrevious: action.payload.hasPrevious,
                }
            };

        case SET_ALL_CUSTOMERS:
            return {
                ...state,
                customers: [...state.pending.items, ...state.confirmed.items, ...state.rejected.items]
            };

        case CLEAR_ALL_CUSTOMERS:
            return {
                ...state,
                customers: {}
            };

        case SET_CUSTOMERS:
            return {
                ...state,
                customers: {
                    items: action.payload.items,
                    totalItemCount: action.payload.totalItemCount,
                    totalPageCount: action.payload.totalPageCount,
                    currentPageSize: action.payload.currentPageSize,
                    currentPageNumber: action.payload.currentPageNumber,
                    hasNext: action.payload.hasNext,
                    hasPrevious: action.payload.hasPrevious,
                }
            };

        case SET_MORE_CUSTOMERS:
            return {
                ...state,
                customers: {
                    items: [...state.confirmed.items, ...action.payload.items],
                    totalItemCount: action.payload.totalItemCount,
                    totalPageCount: action.payload.totalPageCount,
                    currentPageSize: action.payload.currentPageSize,
                    currentPageNumber: action.payload.currentPageNumber,
                    hasNext: action.payload.hasNext,
                    hasPrevious: action.payload.hasPrevious,
                }
            };

        case SET_ID_CHECK_DATA:
            return {
                ...state,
                idCheckData: action.payload
            };

        case SET_PROFILE_CHECK_DATA:
            return {
                ...state,
                profileCheckData: action.payload
            };

        case SET_CUSTOMER_STATUS:
            switch (action.payload.currentStatus) {
                case CONFIRMED:
                    customers = [...state.confirmed];
                    status = action.payload.status;
                    customerId = action.payload.customerID;
                    customerIndex = customers.findIndex(customer => customer.id === customerId);
                    updatedCustomer = { ...state.customer, customerStatus: status };
                    customers.splice(customerIndex, 1, updatedCustomer);
                    
                    return {
                        ...state,
                        customer: { ...updatedCustomer },
                        confirmed: customers,
                        msg: action.payload.msg
                    };

                case PENDING:
                    customers = [...state.pending];
                    status = action.payload.status;
                    customerId = action.payload.customerID;
                    customerIndex = customers.findIndex(customer => customer.id === customerId);
                    updatedCustomer = { ...state.customer, customerStatus: status };
                    customers.splice(customerIndex, 1, updatedCustomer);
                    
                    return {
                        ...state,
                        customer: { ...updatedCustomer },
                        pending: customers,
                        msg: action.payload.msg
                    };

                case REJECTED:
                    customers = [...state.rejected];
                    status = action.payload.status;
                    customerId = action.payload.customerID;
                    customerIndex = customers.findIndex(customer => customer.id === customerId);
                    updatedCustomer = { ...state.customer, customerStatus: status };
                    customers.splice(customerIndex, 1, updatedCustomer);
                    
                    return {
                        ...state,
                        customer: { ...updatedCustomer },
                        rejected: customers,
                        msg: action.payload.msg
                    };

                default:
                    break;
            }

        break;

        case CLEAR_CUSTOMER_STATUS_MSG:
            return {
                ...state,
                msg: null
            };

        default:
            return state;
    }
};

export default customersReducer;