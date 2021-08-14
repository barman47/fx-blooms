import { 
    ENABLED_2FA,
    CLEAR_CURRENT_CUSTOMER,
    SET_AUTH_TOKEN,
    SET_CURRENT_CUSTOMER, 
    SET_CUSTOMER_PROFILE,
    SET_CUSTOMER_MSG,
    HIDE_PHONE_NUMBER,
    SHOW_PHONE_NUMBER,
    SET_RESIDENCE_PERMIT,
    SET_PERMIT_URL
} from '../actions/types';

const initialState = {
    msg: null,
    profile: {}
};

const customerReducer =  (state = initialState, action) => {
    let profile = {};
    switch (action.type) {
        case SET_CURRENT_CUSTOMER:
            return { ...state, ...action.payload };

        case CLEAR_CURRENT_CUSTOMER:
            return {
                msg: null,
                profile: {}
            };

        case SET_CUSTOMER_PROFILE:
            return {
                ...state,
                profile: { ...action.payload }
            };

        case SET_AUTH_TOKEN:
            return {
                ...state,
                token: action.payload
            };

        case ENABLED_2FA:
            const { twoFactorEnable, ...rest } = state.customer;
            return {
                ...state,
                customer: { ...rest, twoFactorEnabled: true }
            };

        case SET_CUSTOMER_MSG:
            return {
                ...state,
                msg: action.payload
            };

        case HIDE_PHONE_NUMBER:
            profile = state.profile;
            profile.showPhoneNumber = false;
            
            return {
                ...state,
                profile
            };
            
        case SHOW_PHONE_NUMBER:
            profile = state.profile;
            profile.showPhoneNumber = true;

            return {
                ...state,
                profile
            };

        case SET_RESIDENCE_PERMIT:
            return {
                ...state,
                hasProvidedResidencePermit: true
            };

        case SET_PERMIT_URL:
            return {
                ...state,
                residencePermitUrl: action.payload
            };
            
            default:
                return state;
    }
};

export default customerReducer;