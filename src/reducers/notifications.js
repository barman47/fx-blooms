
import { 
    ADD_BID,
    ADD_NOTIFICATION,
    SET_BIDS,
    SET_NOTIFICATIONS, 
    CUSTOMER_MADE_PAYMENT,
    PAYMENT_NOTIFICATION,
    REMOVE_CHAT,
    SUBTRACT_UNREAD_NOTIFICATIONS,
    CLEAR_UNREAD_NOTIFICATIONS,
    // SET_TRANSACTION_TERMS,
    CUSTOMER_CANCELED,
    SET_CHAT_CONNECTION_STATUS
} from '../actions/types';

// import { NOTIFICATION_TYPES } from '../utils/constants';

const initialState = {
    notifications: [],
    bids: [],
    unreadNotifications: 0,
    customerCanceled: null,
    connectionStatus: null
};

const notificationsReducer = (state = initialState, action) => {
    let notification = {};
    let notifications = [];
    let notificationIndex;
    let unreadCount;

    switch (action.type) {    
        case SET_NOTIFICATIONS:
            return {
                ...state,
                notifications: action.payload,
                unreadNotifications: action.payload.length
            }; 

        case SET_BIDS:
            return {
                ...state,
                bids: action.payload
            };

        case ADD_BID:
            return {
                ...state,
                bids: [ action.payload, ...state.bids ]
            };

        case ADD_NOTIFICATION:
            return {
                ...state,
                notifications: [ action.payload, ...state.notifications ],
                unreadNotifications: state.unreadNotifications + 1
            };

        case SET_CHAT_CONNECTION_STATUS:
            return {
                ...state,
                connectionStatus: action.payload
            };

        case REMOVE_CHAT:
            return {
                ...state,
                chat: null
            };
            
        case CUSTOMER_MADE_PAYMENT:
            return {
                ...state,
                chat: { ...state.chat, ...action.payload }
            };

        case PAYMENT_NOTIFICATION: 
            notificationIndex = state.notifications.findIndex(item => item.id === action.payload.id);
            notification = state.notifications[notificationIndex];
            notification.buyerHasMadePayment = action.payload.buyerHasMadePayment;
            notification.buyerHasRecievedPayment = action.payload.buyerHasRecievedPayment;
            notification.sellerHasMadePayment = action.payload.sellerHasMadePayment;
            notification.sellerHasRecievedPayment = action.payload.sellerHasRecievedPayment;
            notification.isDeleted = action.payload.isDeleted;

            notifications = state.notifications;
            notifications[notificationIndex] = notification;

            return {
                ...state,
                notifications: [...notifications]
            };

        case CUSTOMER_CANCELED:
            return {
                ...state,
                customerCanceled: action.payload
            };

        // case SET_TRANSACTION_TERMS:
        //     chat = state.chat;
        //     const { buyerAcceptedTransactionTerms, sellerAcceptedTransactionTerms } = action.payload;
        //     chat.buyerAcceptedTransactionTerms = buyerAcceptedTransactionTerms;
        //     chat.sellerAcceptedTransactionTerms = sellerAcceptedTransactionTerms;

        //     return {
        //         ...state,
        //         chat
        //     };

        case SUBTRACT_UNREAD_NOTIFICATIONS:
            unreadCount = state.unreadNotifications - action.payload;
            return {
                ...state,
                unreadNotifications: unreadCount < 0 ? 0 : unreadCount
            };

        case CLEAR_UNREAD_NOTIFICATIONS:
            return {
                ...state,
                unreadNotifications: 0
            };

        default:
            return state;
    }
};

export default notificationsReducer;