export const COLORS = {
    primary: '#1e6262',
    black: '#000000',
    borderColor: 'rgb(224, 224, 224)',
    offBlack: '#333333',
    grey: '#969bab',
    darkGrey: '#a9a9a9',
    lightGrey: '#e2e2e2',
    white: '#ffffff',
    offWhite: '#f8f8f8',
    lightTeal: '#f6fafa',
    red: '#ff0000'
};

export const CONFIRMED = 'CONFIRMED';
export const PENDING = 'PENDING';
export const REJECTED = 'REJECTED';
export const ALL_CUSTOMERS = 'ALL_CUSTOMERS';
export const APPROVED =  'APPROVED';
export const NOT_SUBMITTED = 'NOT_SUBMITTED';

export const SETUP_2FA = 'SETUP_2FA';
export const EMAIL_VERIFICATION = 'EMAIL_VERIFICATION';
export const PROCEED_TO_LOGIN = 'PROCEED_TO_LOGIN';
export const FILL_FORM1 = 'FILL_FORM1';
export const FILL_FORM2 = 'FILL_FORM2';
export const PROCEED_TO_DASHBOARD = 'PROCEED_TO_DASHBOARD'

export const SHADOW = '0px 4px 14px rgba(0, 0, 0, 0.05)';

export const API = 'https://api.fxblooms.com/api'; // Testing branch
export const HUB_URL = 'https://api.fxblooms.com/notificationhub'; // Testing branch

// export const HUB_URL = 'https://fifth-mechanism-322509.ey.r.appspot.com/notificationhub'; // Production branch
// export const API = 'https://fifth-mechanism-322509.ey.r.appspot.com/api'; // Production Branch

export const NETWORK_ERROR = 'Network Error';
export const AUTH_TOKEN = 'FXBloomsAuthToken'

export const ONE_UPPERCASE_LETTER = new RegExp(/(?=.*?[A-Z])/);
export const ONE_LOWERCASE_LETTER = new RegExp(/(?=.*?[a-z])/);
export const ONE_DIGIT = new RegExp(/(?=.*?[0-9])/);
export const ONE_SPECIAL_CHARACTER = new RegExp(/(?=.*?[#?!@$%^&*-])/);
export const EIGHT_CHARACTERS = new RegExp(/.{8,}/);

export const UPLOAD_LIMIT = 1000000; // 1 Megabyte
export const ATTACHMENT_LIMIT = 15000000; // 15 Megabytes

export const LISTING_STATUS = {
    open: 'OPEN',
    removed: 'REMOVED',
    negotiation: 'NEGOTIATION',
    finalized: 'FINALIZED'
};