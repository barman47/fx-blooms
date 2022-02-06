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
    darkTeal: '#091d1d',
    lightTeal: '#f6fafa',
    red: '#EB5757',
    darkRed: '#f21c1c'
};

export const SETUP_2FA = 'SETUP_2FA';
export const EMAIL_VERIFICATION = 'EMAIL_VERIFICATION';
export const PROCEED_TO_LOGIN = 'PROCEED_TO_LOGIN';
export const FILL_FORM1 = 'FILL_FORM1';
export const FILL_FORM2 = 'FILL_FORM2';
export const PROCEED_TO_DASHBOARD = 'PROCEED_TO_DASHBOARD'

export const SHADOW = '0px 4px 14px rgba(0, 0, 0, 0.05)';
export const TRANSITION = '0.3s linear all';

export const LOGOUT = 'logout';

export const WALLET_API = 'https://wallet.fxblooms.com/api'; // Testing branch
export const API = 'https://api.fxblooms.com/api'; // Testing branch
export const HUB_URL = 'https://api.fxblooms.com/notificationhub'; // Testing branch

// export const WALLET_API = 'https://electron.fxblooms.com/api'; // Production branch
// export const HUB_URL = 'wss://positron.fxblooms.com/notificationhub'; // Production branch
// export const API = 'https://positron.fxblooms.com/api'; // Production Branch

export const RECEIVE_NOTIFICATION = 'ReceiveNotification';
export const SEND_MESSAGE = 'SendMessage';

export const CHAT_CONNECTION_STATUS = {
    CONNECTED: 'CONNECTED',
    RECONNECTING: 'RECONNECTING',
    RECONNECTED: 'RECONNECTED',
    DISCONNECTED: 'DISCONNECTED'  
};

export const CUSTOMER_CATEGORY = {
    CONFIRMED: 'CONFIRMED',
    PENDING: 'PENDING',
    NO_PROFILE: 'NO PROFILE',
    REJECTED: 'REJECTED',
    SUSPENDED: 'SUSPENDED',
    ALL_CUSTOMERS: 'ALL CUSTOMERS',
};

export const USER_DETAILS = {
    PERSONAL_DETAILS: 'Personal Details',
    ID_DETAILS: 'ID Details',
    AUTHENTICATION: 'AUTHENTICATION',
    TRANSACTION_DETAILS: 'Transaction Details'
};

export const ID_STATUS = {
    APPROVED: 'APPROVED',
    NOT_SUBMITTED:'NOT_SUBMITTED'
};

export const NOTIFICATION_TYPES = {
    ACCOUNT_SETUP: 'AccountSetup',
    BUYER_CONFIRMED_PAYMENT: 'BuyerConfirmedPayment',
    BUYER_MADE_PAYMENT: 'BuyerPaymentMade',
    SELLER_MADE_PAYMENT: 'SellerPaymentMade',
    SELLER_CONFIRMED_PAYMENT: 'SellerConfirmedPayment',
    CANCEL_NEGOTIATION: 'CancelNegotiation'
};

export const NETWORK_ERROR = 'Network Error';
export const AUTH_TOKEN = 'FXBloomsAuthToken'

export const ONE_UPPERCASE_LETTER = new RegExp(/(?=.*?[A-Z])/);
export const ONE_LOWERCASE_LETTER = new RegExp(/(?=.*?[a-z])/);
export const ONE_DIGIT = new RegExp(/(?=.*?[0-9])/);
export const ONE_SPECIAL_CHARACTER = new RegExp(/(?=.*?[#?!@$%^&*-])/);
export const EIGHT_CHARACTERS = new RegExp(/.{8,}/);

export const UPLOAD_LIMIT = 1000000; // 1 Megabyte
export const ATTACHMENT_LIMIT = 3000000; // 3 Megabytes

export const LISTING_STATUS = {
    open: 'OPEN',
    removed: 'REMOVED',
    negotiation: 'NEGOTIATION',
    finalized: 'FINALIZED'
};

export const PAYMENT_METHODS = [
    'N26',
    'TransferWise',
    'Revolut',
    'Other Banks (with instant)',
    'Other Banks (without instant)',
];