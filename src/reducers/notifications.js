
import { 
    ADD_NOTIFICATION,
    SET_NOTIFICATIONS, 
    PAYMENT_NOTIFICATION_BUYER_PAID,
    PAYMENT_NOTIFICATION_BUYER_CONFIRMED,
    PAYMENT_NOTIFICATION_SELLER_PAID,
    PAYMENT_NOTIFICATION_SELLER_CONFIRMED,
    ADD_UNREAD_NOTIFICATIONS,
    SUBTRACT_UNREAD_NOTIFICATIONS,
    // SET_TRANSACTION_TERMS,
    CUSTOMER_CANCELED,
    SET_SOCKET_CONNECTION_STATUS,
    UPDATE_NOTIFICATION
} from '../actions/types';

const initialState = {
    notifications: [],
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

        case ADD_NOTIFICATION:
            return {
                ...state,
                notifications: [ action.payload, ...state.notifications ],
                unreadNotifications: state.unreadNotifications + 1
            };

        case UPDATE_NOTIFICATION:
            notification = action.payload;
            notifications = state.notifications;
            notificationIndex = notifications.findIndex(item => item.id === notification.id);
            notifications[notificationIndex] = notification;

            return {
                ...state,
                notifications
            };

        case SET_SOCKET_CONNECTION_STATUS:
            return {
                ...state,
                connectionStatus: action.payload
            };

        case PAYMENT_NOTIFICATION_BUYER_PAID:
             return {
                 ...state,
                 notifications: [action.payload.notification, ...state.notifications],
                 unreadNotifications: action.payload.customerId === action.payload.notification.seller.customerId ? state.unreadNotifications + 1 : state.unreadNotifications
             };

        case PAYMENT_NOTIFICATION_BUYER_CONFIRMED:
            return {
                ...state,
                notifications: state.notifications.filter(notification => notification.id !== action.payload.id),
                unreadNotifications: state.unreadNotifications - 1
            };

        case PAYMENT_NOTIFICATION_SELLER_PAID:
            notificationIndex = state.notifications.findIndex(item => item.id === action.payload.id);
            notifications = state.notifications;
            notification = notifications[notificationIndex];
            notification.seller.hasMadePayment = true;
            notifications.splice(notificationIndex, 1, notification);

            return {
                ...state,
                notifications: [...notifications]
            };

        case PAYMENT_NOTIFICATION_SELLER_CONFIRMED:
            notificationIndex = state.notifications.findIndex(item => item.id === action.payload.id);
            notifications = state.notifications;
            notification = notifications[notificationIndex];
            notification.seller.hasReceivedPayment = true;
            notifications.splice(notificationIndex, 1, notification);

            return {
                ...state,
                notifications: [...notifications]
            }            

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

        case ADD_UNREAD_NOTIFICATIONS:
            unreadCount = state.unreadNotifications + action.payload;
            return {
                ...state,
                unreadNotifications: unreadCount
            }

        case SUBTRACT_UNREAD_NOTIFICATIONS:
            unreadCount = state.unreadNotifications - action.payload;
            return {
                ...state,
                unreadNotifications: unreadCount < 0 ? 0 : unreadCount
            }

        default:
            return state;
    }
};

export default notificationsReducer;