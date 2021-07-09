import { 
    CLEAR_CUSTOMER_STATUS_MSG,
    SET_CUSTOMER, 
    SET_CUSTOMERS, 
    SET_CUSTOMER_STATUS 
} from '../actions/types';
import { CONFIRMED, PENDING, REJECTED } from '../utils/constants';

const initialState = {
    customer: {},
    confirmed: [],
    pending: [],
    rejected: [],
    msg: null,
    count: 0
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

        case SET_CUSTOMERS:
            return {
                ...state,
                confirmed: [...action.payload.confirmed],
                pending: [...action.payload.pending],
                rejected: [...action.payload.rejected],
                count: action.payload.count
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