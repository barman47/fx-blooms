import { 
    ADD_NOTIFICATION,
    SET_NOTIFICATIONS, 
    PAYMENT_NOTIFICATION_BUYER_PAID,
    PAYMENT_NOTIFICATION_BUYER_CONFIRMED,
    PAYMENT_NOTIFICATION_SELLER_PAID,
    PAYMENT_NOTIFICATION_SELLER_CONFIRMED,
    PAYMENT_NOTIFICATION_OFFER_MADE,
    ADD_UNREAD_NOTIFICATIONS,
    SUBTRACT_UNREAD_NOTIFICATIONS,
    SET_SOCKET_CONNECTION_STATUS,
    UPDATE_NOTIFICATION,
    REMOVE_NOTIFICATION,
    SET_NOTIFICATION_COUNT,
    SET_NOTIFICATION_MSG
} from '../actions/types';

const initialState = {
    notifications: [],
    notification: {},
    unreadNotifications: 0,
    connectionStatus: null,
    msg: null
};

const notificationsReducer = (state = initialState, action) => {
    let notification = {};
    let notifications = [];
    let notificationIndex;
    let unreadCount;
    let endTransaction;

    switch (action.type) {    
        case SET_NOTIFICATIONS:
            return {
                ...state,
                notifications: action.payload
            }; 

        case ADD_NOTIFICATION:
            return {
                ...state,
                notifications: action.payload ? [ action.payload, ...state.notifications ] : [ ...state.notifications ]
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

        case REMOVE_NOTIFICATION:
            return {
                ...state,
                notifications: state.notifications.filter(notification => notification.notificationId !== action.payload),
                unreadNotifications: state.unreadNotifications - 1,
            };

        case SET_SOCKET_CONNECTION_STATUS:
            return {
                ...state,
                connectionStatus: action.payload
            };

        case PAYMENT_NOTIFICATION_BUYER_PAID:
            return {
                ...state,
                notifications: [action.payload, ...state.notifications]
            };

        case PAYMENT_NOTIFICATION_BUYER_CONFIRMED:
            endTransaction = action.payload.endTransaction;
            if (endTransaction) {
                return {
                    ...state,
                    notifications: state.notifications.filter(notification => notification.notificationId !== action.payload.notification.notificationId)
                };
            }
            return {
                ...state,
                notifications: [action.payload.notification, ...state.notifications],
            };
            

        case PAYMENT_NOTIFICATION_SELLER_PAID:
            return {
                ...state,
                notifications: [action.payload, ...state.notifications]
            };

        case PAYMENT_NOTIFICATION_SELLER_CONFIRMED:
            endTransaction = action.payload.endTransaction;
            if (endTransaction) {
                return {
                    ...state,
                    notifications: state.notifications.filter(notification => notification.notificationId !== action.payload.notification.notificationId)
                };
            }
            return {
                ...state,
                notifications: [action.payload.notification, ...state.notifications]
            };

        case PAYMENT_NOTIFICATION_OFFER_MADE:
            return {
                ...state,
                notifications: [action.payload, ...state.notifications]
            };

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

        case SET_NOTIFICATION_COUNT:
            return {
                ...state,
                unreadNotifications: action.payload
            };

        case SET_NOTIFICATION_MSG:
            return {
                ...state,
                msg: action.payload
            };

        default:
            return state;
    }
};

export default notificationsReducer;