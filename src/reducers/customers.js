import { 
    CLEAR_CUSTOMER_STATUS_MSG,
    SET_CUSTOMER, 
    SET_CUSTOMERS, 
    SET_CUSTOMER_STATUS, 
    SET_NEW_CUSTOMERS,
    SET_CONFIRMED_CUSTOMERS,
    SET_REJECTED_CUSTOMERS,
    SET_ALL_CUSTOMERS,
    CLEAR_ALL_CUSTOMERS
} from '../actions/types';

import { CONFIRMED, PENDING, REJECTED } from '../utils/constants';

const initialState = {
    customer: {},
    customers: [],
    confirmed: [],
    pending: [],
    rejected: [],
    msg: null,
    currentPageNumber: 0,
    currentPageSize: 0,
    hasNext: false,
    hasPrevious: false,
    count: 0,
    totalPageCount: 0
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
                customer: {...action.payload}
            };

        case SET_NEW_CUSTOMERS:
            return {
                ...state,
                currentPageNumber: action.payload.currentPageNumber,
                currentPageSize: action.payload.currentPageSize,
                hasNext: action.payload.hasNext,
                hasPrevious: action.payload.hasPrevious,
                totalItemCount: action.payload.totalItemCount,
                totalPageCount: action.payload.totalPageCount,
                pending: action.payload.pending
            };

        case SET_CONFIRMED_CUSTOMERS:
            return {
                ...state,
                currentPageNumber: action.payload.currentPageNumber,
                currentPageSize: action.payload.currentPageSize,
                hasNext: action.payload.hasNext,
                hasPrevious: action.payload.hasPrevious,
                totalItemCount: action.payload.totalItemCount,
                totalPageCount: action.payload.totalPageCount,
                confirmed: action.payload.confirmed
            };

        case SET_REJECTED_CUSTOMERS:
            return {
                ...state,
                currentPageNumber: action.payload.currentPageNumber,
                currentPageSize: action.payload.currentPageSize,
                hasNext: action.payload.hasNext,
                hasPrevious: action.payload.hasPrevious,
                totalItemCount: action.payload.totalItemCount,
                totalPageCount: action.payload.totalPageCount,
                rejected: action.payload.rejected
            };

        case SET_ALL_CUSTOMERS:
            return {
                ...state,
                customers: [...state.pending, ...state.confirmed, ...state.rejected]
            };

        case CLEAR_ALL_CUSTOMERS:
            return {
                ...state,
                customers: []
            };

        case SET_CUSTOMERS:
            const { confirmed, pending, rejected, totalItemCount, ...rest } = action.payload;

            return {
                ...state,
                confirmed: [...confirmed],
                pending: [...pending],
                rejected: [...rejected],
                count: totalItemCount,
                ...rest
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