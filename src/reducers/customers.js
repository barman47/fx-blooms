import { SET_CUSTOMER, SET_CUSTOMERS } from '../actions/types';

const initialState = {
    customer: {},
    confirmed: [],
    pending: [],
    rejected: [],
    count: 0
};

const customersReducer = (state = initialState, action) => {
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

        default:
        return state;
    }
};

export default customersReducer;