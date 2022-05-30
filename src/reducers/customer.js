import { 
    DISABLED_2FA,
    ENABLED_2FA,
    CLEAR_CURRENT_CUSTOMER,
    SET_AUTH_TOKEN,
    SET_CURRENT_CUSTOMER,
    SET_CUSTOMER_STATS, 
    SET_CUSTOMER_PROFILE,
    SET_CUSTOMER_MSG,
    SET_CUSTOMER,
    HIDE_PHONE_NUMBER,
    SHOW_PHONE_NUMBER,
    SET_RESIDENCE_PERMIT,
    SET_ID_VERIFICATION_LINK,
    SET_PERMIT_URL,
    SET_EMAIL,
    PROFILE_UPDATED,
    VERIFIED_PHONE_NUMBER,
    RESET_CUSTOMER_SESSION,
    SETUP_PIN
} from '../actions/types';

const initialState = {
    isAuthenticated: false,
    msg: null,
    stats: {},
    profile: {},
    resetSession: false
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
            return {
                ...state,
                twoFactorEnabled: true,
                hasSetup2FA: true
            };

        case DISABLED_2FA:
            return {
                ...state,
                twoFactorEnabled: false 
            };

        case SET_EMAIL:
            return {
                ...state,
                email: action.payload
            };

        case SET_CUSTOMER:
            return {
                ...state,
                customer: action.payload
            };

        case SET_CUSTOMER_STATS:
            return {
                ...state,
                stats: action.payload
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
                profile,
                msg: 'Now other users can not see your telephone number'
            };
            
        case SHOW_PHONE_NUMBER:
            profile = state.profile;
            profile.showPhoneNumber = true;

            return {
                ...state,
                profile,
                msg: 'Now other users can see your telephone number'
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

        case SET_ID_VERIFICATION_LINK:
            return {
                ...state,
                idVerificationLink: action.payload
            };

        case PROFILE_UPDATED:
            return {
                ...state,
                profile: { ...state.profile, ...action.payload },
                ...action.payload,
                msg: 'Profile updated successfully'
            };

        case VERIFIED_PHONE_NUMBER:
            return {
                ...state,
                msg: 'Phone number verified successfully',
                phoneNo: action.payload.phoneNumber,
                isPhoneNumberVerified: true

            };

        case SETUP_PIN:
            return {
                ...state,
                hasSetPin: action.payload
            };

        case RESET_CUSTOMER_SESSION:
            return {
                ...state,
                resetSession: action.payload
            };
            
        default:
            return state;
    }
};

export default customerReducer;