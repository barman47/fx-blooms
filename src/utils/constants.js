export const COLORS = {
    primary: "#1e6262",
    black: "#000000",
    borderColor: "rgb(224, 224, 224)",
    offBlack: "#333333",
    grey: "#969bab",
    darkGrey: "#a9a9a9",
    lightGrey: "#e2e2e2",
    white: "#ffffff",
    offWhite: "#f8f8f8",
    darkTeal: "#091d1d",
    lightTeal: "#f6fafa",
    red: "#EB5757",
    darkRed: "#f21c1c",
    orange: "#ffa500",
};

export const DRAWER_WIDTH = 235;
// export const DRAWER_WIDTH = 240;

export const SETUP_2FA = "SETUP_2FA";
export const EMAIL_VERIFICATION = "EMAIL_VERIFICATION";
export const PROCEED_TO_LOGIN = "PROCEED_TO_LOGIN";
export const FILL_FORM1 = "FILL_FORM1";
export const FILL_FORM2 = "FILL_FORM2";
export const PROCEED_TO_DASHBOARD = "PROCEED_TO_DASHBOARD";

export const SHADOW = "0px 4px 14px rgba(0, 0, 0, 0.05)";
export const TRANSITION = "0.3s linear all";

export const LOGOUT = "logout";

export const RECEIVE_NOTIFICATION = "ReceiveNotification";
export const SEND_MESSAGE = "SendMessage";

export const ID_FIELDS = {
    DATE_OF_BIRTH: "Date of birth",
    FIRST_NAME: "First name",
    LAST_NAME: "Last name",
    EXPIRY_DATE: "Date of expiry",
    ISSUE_DATE: "Date of issue",
    DOCUMENT_NUMBER: "Document number",
    DOCUMENT_TYPE: "Document type",
    ISSUE_COUNTRY: "Issue country",
};

export const ADMIN_FILTERS = {
    TWENTY_FOUR_HOURS: "Past 24 Hours",
    SEVEN_DAYS: "Past 7 Days",
    THIRTY_DAYS: "Past 30 Days",
    THREE_MONTHS: "Past 3 Months",
    ALL: "All",
};

export const CHAT_CONNECTION_STATUS = {
    CONNECTED: "CONNECTED",
    RECONNECTING: "RECONNECTING",
    RECONNECTED: "RECONNECTED",
    DISCONNECTED: "DISCONNECTED",
};

export const CUSTOMER_CATEGORY = {
    CONFIRMED: "CONFIRMED",
    PENDING: "PENDING",
    NO_PROFILE: "NO PROFILE",
    REJECTED: "REJECTED",
    SUSPENDED: "SUSPENDED",
    ALL_CUSTOMERS: "ALL CUSTOMERS",
};

export const USER_DETAILS = {
    PERSONAL_DETAILS: "Personal Details",
    ID_DETAILS: "ID Details",
    AUTHENTICATION: "AUTHENTICATION",
    TRANSACTION_DETAILS: "Transaction Details",
};

export const LISTING_DETAILS = {
    ALL_LISTINGS: "ALL LISTINGS",
    ALL_OPEN: "ALL OPEN",
    ALL_NEGOTIATIONS: "ALL NEGOTIATIONS",
    ALL_DELETED: "ALL DELETED",
    ALL_COMPLETED: "ALL COMPLETED",
};

export const TRANSACTION_DETAILS = {
    ALL_TRANSACTIONS: "ALL TRANSACTIONS",
};

export const ID_STATUS = {
    APPROVED: "APPROVED",
    NOT_SUBMITTED: "NOT_SUBMITTED",
};

export const NOTIFICATION_TYPES = {
    ACCOUNT_SETUP: "AccountSetup",
    BUYER_CONFIRMED_PAYMENT: "BuyerConfirmedPayment",
    BUYER_MADE_PAYMENT: "BuyerPaymentMade",
    SELLER_MADE_PAYMENT: "SellerPaymentMade",
    SELLER_CONFIRMED_PAYMENT: "SellerConfirmedPayment",
    OFFER_MADE: "OfferMade",
    CANCEL_NEGOTIATION: "CancelNegotiation",
};

export const NETWORK_ERROR = "Network Error";
export const AUTH_TOKEN = "FXBloomsAuthToken";
export const ADMIN_AUTH_TOKEN = "FXBloomsAdminAuthToken";
export const ADMIN_INFO = "FXBloomsAdminInfo";

export const ONE_UPPERCASE_LETTER = new RegExp(/(?=.*?[A-Z])/);
export const ONE_LOWERCASE_LETTER = new RegExp(/(?=.*?[a-z])/);
export const ONE_DIGIT = new RegExp(/(?=.*?[0-9])/);
export const ONE_SPECIAL_CHARACTER = new RegExp(/(?=.*?[#?!@$%^&*-])/);
export const EIGHT_CHARACTERS = new RegExp(/.{8,}/);

export const UPLOAD_LIMIT = 1000000; // 1 Megabyte
export const ATTACHMENT_LIMIT = 3000000; // 3 Megabytes

export const SESSION_LIFE = 270000; // 4.5minutes in milliseconds
export const SESSION_TIME = 'sessionTime'

export const BID_STATUS = {
    IN_PROGRES: "IN_PROGRESS",
    CANCELED: "CANCELED",
    COMPLETED: "COMPLETED",
};

export const LISTING_STATUS = {
    open: "OPEN",
    removed: "REMOVED",
    negotiation: "NEGOTIATION",
    finalized: "FINALIZED",
};

export const HAS_SEEN_ESCROW_MESSAGE = 'hasSeenEscrowMessage';

export const PAYMENT_METHODS = [
    "N26",
    "TransferWise",
    "Revolut",
    "Other Banks (with instant)",
    "Other Banks (without instant)",
];

export const olimpicMedals = [
    {
        country: "USA",
        gold: 36,
        silver: 38,
        bronze: 36,
    },
    {
        country: "China",
        gold: 51,
        silver: 21,
        bronze: 28,
    },
    {
        country: "Russia",
        gold: 23,
        silver: 21,
        bronze: 28,
    },
    {
        country: "Britain",
        gold: 19,
        silver: 13,
        bronze: 15,
    },
    {
        country: "Australia",
        gold: 14,
        silver: 15,
        bronze: 17,
    },
    {
        country: "Germany",
        gold: 16,
        silver: 10,
        bronze: 15,
    },
];

export const energyConsumption = [
    {
        country: "USA",
        hydro: 59.8,
        oil: 937.6,
        gas: 582,
        coal: 564.3,
        nuclear: 187.9,
    },
    {
        country: "China",
        hydro: 74.2,
        oil: 308.6,
        gas: 35.1,
        coal: 956.9,
        nuclear: 11.3,
    },
    {
        country: "Russia",
        hydro: 40,
        oil: 128.5,
        gas: 361.8,
        coal: 105,
        nuclear: 32.4,
    },
    {
        country: "Japan",
        hydro: 22.6,
        oil: 241.5,
        gas: 64.9,
        coal: 120.8,
        nuclear: 64.8,
    },
    {
        country: "India",
        hydro: 19,
        oil: 119.3,
        gas: 28.9,
        coal: 204.8,
        nuclear: 3.8,
    },
    {
        country: "Germany",
        hydro: 6.1,
        oil: 123.6,
        gas: 77.3,
        coal: 85.7,
        nuclear: 37.8,
    },
];

export const USER_COLUMNS = {
    1: "firstName",
    2: "lastName",
    3: "email",
    4: "username",
    5: "customerStatus",
    6: "",
    7: "riskProfile",
};

export const LISTING_COLUMNS = {
    1: "id",
    2: "listedBy",
    3: "amountNeeded",
    4: "exchangeRate",
    5: "status",
    6: "dateCreated",
    8: "amountAvailable",
};

export const TRANSACTION_COLUMNS = {
    0: "buyer",
    1: "seller",
    2: "id",
    3: "isClosed",
    4: "dateCreated",
};

export const VERIFF_HOST = "https://stationapi.veriff.com";
export const CALLBACK = "https://fxblooms.com/dashboard/home";

export const ID_STATUS_CATEGORY = {
    DECLINED: "declined",
    ACCEPTED: "approved",
};

export const LISTING_CATEGORY = {
    OPEN: "OPEN",
    CANCELED: "CANCELED",
    REMOVED: "REMOVED",
    NEGOTIATION: "NEGOTIATION",
};

export const FUNDING_STATUS = {
    PENDING: "PENDING",
    COMPLETED: "COMPLETED",
};

export const WALLET_FILTER = {
    HISTORY: "HISTORY",
    FUNDING: "FUNDING",
    WITHDRAWAL: "WITHDRAWAL",
};

export const PAYMENT_STATUS = {
    PENDING: "PENDING",
    COMPLETED: "COMPLETED",
    FAILED: "FAILED",
    IN_PROGRESS: "IN PROGRESS",
};

export const PAYMENT_TYPE = {
    FUND: "FUND",
    WITHDRAWAL: "WITHDRAWAL",
};

// export const DEPOSIT_COLUMNS = {
//   0: 'customerFullName',
//   1: 'account',
//   2: 'amount',
//   3: 'paymentStatus',
//   4: 'paymentType',
//   5: 'dateCreated',
// }

// export const _COLUMNS = {
//   0: 'customerFullName',
//   1: 'account',
//   2: 'amount',
//   3: 'paymentStatus',
//   4: 'paymentType',
//   5: 'dateCreated',
// }
