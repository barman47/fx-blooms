import {
    CLEAR_CUSTOMER_STATUS_MSG,
    CLEAR_CUSTOMER,
    SET_CUSTOMER,
    SET_CUSTOMERS,
    SET_CUSTOMER_STATUS,
    SET_NEW_CUSTOMERS,
    SET_CONFIRMED_CUSTOMERS,
    SET_REJECTED_CUSTOMERS,
    SET_SUSPENDED_CUSTOMERS,
    SET_CUSTOMERS_WITHOUT_PROFILE,
    SET_ALL_CUSTOMERS,
    CLEAR_ALL_CUSTOMERS,
    SET_ID_CHECK_DATA,
    SET_PROFILE_CHECK_DATA,
    ACCEPTED_CUSTOMER_ID,
    ACCEPTED_CUSTOMER_RESIDENCE_PERMIT,
    SET_PAGE_NUMBER,
    SET_PAGE_SIZE,
    CUSTOMER_SEARCH_RESULT,
    SET_BUYER,
    SET_CATEGORY,
    UPDATED_CUSTOMER,
    FETCHING_STOP,
    FETCHING_START,
    FETCHING_ID_STOP,
    FETCHING_ID_START,
    CLEAR_PROFILE_DATA,
    CLEAR_IDCHECK_DATA,
} from "../actions/types";

import { CUSTOMER_CATEGORY } from "../utils/constants";

const { CONFIRMED, PENDING, REJECTED, NO_PROFILE, SUSPENDED, ALL_CUSTOMERS } =
    CUSTOMER_CATEGORY;

const initialState = {
    pageNumber: 0, // to match the default value on the pagination
    pageSize: 10, // to match the default value on the pagination
    category: null,
    customer: {},
    idCheckData: null,
    profileCheckData: null,
    customers: {},
    confirmed: {},
    noProfile: {},
    pending: {},
    rejected: {},
    suspended: {},
    buyer: {},
    msg: null,
    customersSearchResult: {},
    isLoading: false,
    isLoadingIdData: false,
    isLoadingApproveId: false,
};

const customersReducer = (state = initialState, action) => {
    let customers = [];
    let customerId;
    let customerIndex;
    let updatedCustomer = {};

    switch (action.type) {
        case SET_CUSTOMER:
            return {
                ...state,
                customer: action.payload,
            };
        case FETCHING_START:
            return {
                ...state,
                isLoading: true,
            };

        case FETCHING_STOP:
            return {
                ...state,
                isLoading: false,
            };
        case FETCHING_ID_START:
            return {
                ...state,
                isLoadingIdData: true,
            };

        case FETCHING_ID_STOP:
            return {
                ...state,
                isLoadingIdData: false,
            };

        case SET_BUYER:
            return {
                ...state,
                buyer: action.payload,
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
                },
                isLoading: false,
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
                },
                isLoading: false,
            };

        case SET_CUSTOMERS_WITHOUT_PROFILE:
            return {
                ...state,
                noProfile: {
                    items: action.payload.items,
                    totalItemCount: action.payload.totalItemCount,
                    totalPageCount: action.payload.totalPageCount,
                    currentPageSize: action.payload.currentPageSize,
                    currentPageNumber: action.payload.currentPageNumber,
                    hasNext: action.payload.hasNext,
                    hasPrevious: action.payload.hasPrevious,
                },
                isLoading: false,
            };

        case SET_SUSPENDED_CUSTOMERS:
            return {
                ...state,
                suspended: {
                    items: action.payload.items,
                    totalItemCount: action.payload.totalItemCount,
                    totalPageCount: action.payload.totalPageCount,
                    currentPageSize: action.payload.currentPageSize,
                    currentPageNumber: action.payload.currentPageNumber,
                    hasNext: action.payload.hasNext,
                    hasPrevious: action.payload.hasPrevious,
                },
                isLoading: false,
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
                },
                isLoading: false,
            };

        case SET_ALL_CUSTOMERS:
            return {
                ...state,
                customers: [
                    ...state.pending.items,
                    ...state.confirmed.items,
                    ...state.rejected.items,
                ],
                isLoading: false,
            };

        case CLEAR_ALL_CUSTOMERS:
            return {
                ...state,
                customers: {},
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
                },
                isLoading: false,
            };

        case CUSTOMER_SEARCH_RESULT:
            return {
                ...state,
                customersSearchResult: {
                    items: action.payload.items,
                    totalItemCount: action.payload.totalItemCount,
                    totalPageCount: action.payload.totalPageCount,
                    currentPageSize: action.payload.currentPageSize,
                    currentPageNumber: action.payload.currentPageNumber,
                    hasNext: action.payload.hasNext,
                    hasPrevious: action.payload.hasPrevious,
                },
            };

        case SET_ID_CHECK_DATA:
            return {
                ...state,
                idCheckData: action.payload,
            };

        case SET_PROFILE_CHECK_DATA:
            return {
                ...state,
                profileCheckData: action.payload,
            };
        case CLEAR_PROFILE_DATA:
            return {
                ...state,
                profileCheckData: null,
            };
        case CLEAR_IDCHECK_DATA:
            return {
                ...state,
                idCheckData: null,
            };

        case SET_CUSTOMER_STATUS:
            const { customerID, newStatus, currentStatus, isPersonal } =
                action.payload;

            switch (currentStatus) {
                case CONFIRMED:
                    if (!isPersonal) {
                        customers = [...state.confirmed.items];
                        customerIndex = customers.findIndex(
                            (customer) => customer.id === customerID
                        );
                        customers.splice(customerIndex, 1); // remove the customer from verified list
                    }
                    updatedCustomer = {
                        ...state.customer,
                        customerStatus: newStatus,
                    };

                    return {
                        ...state,
                        customer: updatedCustomer,
                        confirmed: { ...state.confirmed, items: customers },
                        msg: action.payload.msg,
                    };

                case PENDING:
                    customers = [...state.pending.items];
                    customerIndex = customers.findIndex(
                        (customer) => customer.id === customerID
                    );
                    updatedCustomer = {
                        ...state.customer,
                        customerStatus: newStatus,
                    };
                    customers.splice(customerIndex, 1); // remove customer from pending list

                    return {
                        ...state,
                        customer: updatedCustomer,
                        pending: { ...state.pending, items: customers },
                        msg: action.payload.msg,
                    };

                case NO_PROFILE:
                    customers = [...state.noProfile.items];
                    customerIndex = customers.findIndex(
                        (customer) => customer.id === customerID
                    );
                    updatedCustomer = {
                        ...state.customer,
                        customerStatus: newStatus,
                    };
                    customers.splice(customerIndex, 1); // remove customer from no-profile list

                    return {
                        ...state,
                        customer: updatedCustomer,
                        noProfile: { ...state.noProfile, items: customers },
                        msg: action.payload.msg,
                    };

                case REJECTED:
                    customers = [...state.rejected.items];
                    customerIndex = customers.findIndex(
                        (customer) => customer.id === customerID
                    );
                    updatedCustomer = {
                        ...state.customer,
                        customerStatus: newStatus,
                    };
                    customers.splice(customerIndex, 1); // remove customer from rejected list

                    return {
                        ...state,
                        customer: updatedCustomer,
                        rejected: { ...state.rejected, items: customers },
                        msg: action.payload.msg,
                    };
                case SUSPENDED:
                    if (!isPersonal) {
                        customers = [...state.suspended.items];
                        customerIndex = customers.findIndex(
                            (customer) => customer.id === customerID
                        );
                        customers.splice(customerIndex, 1); // remove customer from suspended list
                    }
                    updatedCustomer = {
                        ...state.customer,
                        customerStatus: newStatus,
                    };

                    return {
                        ...state,
                        customer: updatedCustomer,
                        suspended: { ...state.suspended, items: customers },
                        msg: action.payload.msg,
                    };

                case ALL_CUSTOMERS:
                    customers = [...state.customers.items];
                    customerIndex = customers.findIndex(
                        (customer) => customer.id === customerID
                    );
                    updatedCustomer = {
                        ...state.customer,
                        customerStatus: newStatus,
                    };
                    customers.splice(customerIndex, 1, updatedCustomer); // Update all customers array

                    return {
                        ...state,
                        customer: updatedCustomer,
                        customers: { ...state.customers, items: customers },
                        msg: action.payload.msg,
                    };

                default:
                    break;
            }
            break;

        case ACCEPTED_CUSTOMER_ID:
            console.log(action.payload);
            return {
                ...state,
                msg: "Customer ID card has been verified",
            };

        case ACCEPTED_CUSTOMER_RESIDENCE_PERMIT:
            return {
                ...state,
                msg: "Customer residencen permit has been verified",
            };

        case UPDATED_CUSTOMER:
            updatedCustomer = action.payload;
            customerId = updatedCustomer.id;

            switch (updatedCustomer.customerStatus) {
                case CONFIRMED:
                    customers = [...state.confirmed.items];
                    customerIndex = customers.findIndex(
                        (customer) => customer.id === customerId
                    );
                    customers.splice(customerIndex, 1, updatedCustomer);

                    return {
                        ...state,
                        confirmed: { ...state.confirmed, items: customers },
                        customer: { ...updatedCustomer },
                        msg: "Customer profile updated successfully",
                    };

                case PENDING:
                    customers = [...state.pending.items];
                    customerIndex = customers.findIndex(
                        (customer) => customer.id === customerId
                    );
                    customers.splice(customerIndex, 1, updatedCustomer);

                    return {
                        ...state,
                        pending: { ...state.pending, items: customers },
                        customer: { ...updatedCustomer },
                        msg: "Customer profile updated successfully",
                    };

                case REJECTED:
                    customers = [...state.rejected.items];
                    customerIndex = customers.findIndex(
                        (customer) => customer.id === customerId
                    );
                    customers.splice(customerIndex, 1, updatedCustomer);

                    return {
                        ...state,
                        rejected: { ...state.rejected, items: customers },
                        customer: { ...updatedCustomer },
                        msg: "Customer profile updated successfully",
                    };

                case NO_PROFILE:
                    customers = [...state.noProfile.items];
                    customerIndex = customers.findIndex(
                        (customer) => customer.id === customerId
                    );
                    customers.splice(customerIndex, 1, updatedCustomer);

                    return {
                        ...state,
                        noProfile: { ...state.noProfile, items: customers },
                        customer: { ...updatedCustomer },
                        msg: "Customer profile updated successfully",
                    };

                case SUSPENDED:
                    customers = [...state.suspended.items];
                    customerIndex = customers.findIndex(
                        (customer) => customer.id === customerId
                    );
                    customers.splice(customerIndex, 1, updatedCustomer);

                    return {
                        ...state,
                        suspended: { ...state.suspended, items: customers },
                        customer: { ...updatedCustomer },
                        msg: "Customer profile updated successfully",
                    };

                case ALL_CUSTOMERS:
                    customers = [...state.customers.items];
                    customerIndex = customers.findIndex(
                        (customer) => customer.id === customerId
                    );
                    customers.splice(customerIndex, 1, updatedCustomer);

                    return {
                        ...state,
                        customers: { ...state.customers, items: customers },
                        customer: { ...updatedCustomer },
                        msg: "Customer profile updated successfully",
                    };

                default:
                    return state;
            }

        case SET_PAGE_NUMBER:
            return {
                ...state,
                pageNumber: action.payload,
            };

        case SET_PAGE_SIZE:
            return {
                ...state,
                pageSize: action.payload,
            };

        case SET_CATEGORY:
            return {
                ...state,
                category: action.payload,
            };

        case CLEAR_CUSTOMER_STATUS_MSG:
            return {
                ...state,
                msg: null,
            };

        case CLEAR_CUSTOMER:
            return {
                ...state,
                customer: {},
            };

        default:
            return state;
    }
};

export default customersReducer;
