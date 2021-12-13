
import { 
    ADD_NOTIFICATION,
    SET_NOTIFICATIONS, 
    PAYMENT_NOTIFICATION,
    SUBTRACT_UNREAD_NOTIFICATIONS,
    // SET_TRANSACTION_TERMS,
    CUSTOMER_CANCELED,
    SET_SOCKET_CONNECTION_STATUS,
    UPDATE_NOTIFICATION
} from '../actions/types';

import { NOTIFICATION_TYPES } from '../utils/constants';

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

        case PAYMENT_NOTIFICATION: 
            console.log('payment notification ', action.payload);
            notificationIndex = state.notifications.findIndex(item => item.id === action.payload.id);
            notifications = state.notifications;
            notification = notifications[notificationIndex];

            const { BUYER_MADE_PAYMENT, BUYER_CONFIRMED_PAYMENT, SELLER_MADE_PAYMENT, SELLER_CONFIRMED_PAYMENT } = NOTIFICATION_TYPES;

            switch (action.payload.type) {
                case BUYER_MADE_PAYMENT:
                    // If notification exists, update it, else create a new one
                    let newNotification;
                    newNotification = state.notifications.find(item => item.id === action.payload.notification.id);
                    if (newNotification) {
                        return {
                            ...state,
                            notifications: [newNotification, ...notifications],
                            unreadNotifications: action.payload.customerId === newNotification.seller.customerId ? state.unreadNotifications + 1 : state.unreadNotifications
                        };
                    }

                    notificationIndex = state.notifications.findIndex(item => item.id === action.payload.notification.id);
                    notification = notifications[notificationIndex];
                    return {
                        ...state,
                        notifications: [...notifications],
                        unreadNotifications: action.payload.customerId === newNotification.seller.customerId ? state.unreadNotifications + 1 : state.unreadNotifications
                    };
                    
                    // notification.buyer.hasMadePayment = true;
                    // notifications[notificationIndex] = notification;
                    // console.log('updating notifications');
                    // debugger;

                    // return {
                    //     ...state,
                    //     notifications: [...notifications]
                    // };

                    // End transaction because buyer has confirmed seller's payment
                case BUYER_CONFIRMED_PAYMENT:
                    notifications.splice(notificationIndex, 1);

                    return {
                        ...state,
                        notifications: [...notifications],
                        unreadNotifications: state.unreadNotifications - 1
                    };

                case SELLER_MADE_PAYMENT:
                    notification.seller.hasMadePayment = true;
                    notifications[notificationIndex] = notification;

                    return {
                        ...state,
                        notifications: [...notifications]
                    };
                    
                case SELLER_CONFIRMED_PAYMENT:
                    notification.seller.hasReceivedPayment = true;
                    notifications[notificationIndex] = notification;

                    return {
                        ...state,
                        notifications: [...notifications]
                    };
                    
                default:
                    break;
            }
           break;

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
            }

        default:
            return state;
    }
};

export default notificationsReducer;