
import { 
    UPDATE_ACTIVE_CHAT, 
    SET_CHAT, 
    SET_CHATS, 
    SENT_MESSAGE,
    PAYMENT_NOTIFICATION,
    REMOVE_CHAT,
    GET_UNREAD_MESSAGES,
    SET_UNREAD_MESSAGES,
    SUBTRACT_UNREAD_MESSAGES,
    CLEAR_UNREAD_MESSAGES,
    SET_TRANSACTION_TERMS,
    CUSTOMER_CANCELED
} from '../actions/types';

import { NOTIFICATION_TYPES } from '../utils/constants';

const initialState = {
    chat: null,
    chats: [],
    sessionId: null,
    unreadMessages: 0,
    customerCanceled: null
};

const chatsReducer = (state = initialState, action) => {
    let messageList = [];
    let chat = {};
    let chats = [];
    let unreadCount;
    let chatIndex;

    switch (action.type) {    
        case SET_CHATS:
            return {
                ...state,
                chats: [...action.payload]
            }; 
            
        case UPDATE_ACTIVE_CHAT:
            if (state.chat) {
                chats = state.chats;
                chat = state.chat;
                chatIndex = chats.findIndex(item => item.id === chat.id);
                chats.splice(chatIndex, 1, chat);
                return {
                    ...state,
                    chats,
                };

            } else {
                return state;
            }
        
        case SET_CHAT:
            return {
                ...state,
                chat: action.payload,
                sessionId: action.payload.id
            };

        case REMOVE_CHAT:
            return {
                ...state,
                chat: null,
                sessionId: null
            };

        case SENT_MESSAGE: 
            if (state.chat) {
                const { messages, ...rest } = state.chat;
                messageList = [...messages, action.payload.message];
                unreadCount = state.chat.id === action.payload.message.chatId || action.payload.customerId === action.payload.message.sender ? state.unreadMessages : state.unreadMessages + 1;
                
                // if (state.chat.id === action.payload.message.chatId || action.payload.customerId === action.payload.message.sender) {
                //     unreadCount = state.unreadMessages
                // } else {
                //     unreadCount = state.unreadMessages + 1;
                // }

                return {
                    ...state,
                    chat: { ...rest, messages: messageList },
                    unreadMessages: unreadCount
                }

            } else {
                return {
                    ...state,
                    unreadMessages: state.unreadMessages + 1
                }
            }
            
            

        case PAYMENT_NOTIFICATION: 
            chat = state.chat;
            chat.buyerHasMadePayment = action.payload.buyerHasMadePayment;
            chat.buyerHasRecievedPayment = action.payload.buyerHasRecievedPayment;
            chat.sellerHasMadePayment = action.payload.sellerHasMadePayment;
            chat.sellerHasRecievedPayment = action.payload.sellerHasRecievedPayment;
            chat.isDeleted = action.payload.isDeleted;

            unreadCount = state.chat.id === action.payload.chatId || action.payload.customerId === action.payload.senderId ? state.unreadMessages : state.unreadMessages + 1;

            return {
                ...state,
                chat: {...state.chat, ...action.payload},
                unreadMessages: action.payload === NOTIFICATION_TYPES.TRANSFER_CONFIRMATION ? state.unreadMessages : unreadCount
            };

        case CUSTOMER_CANCELED:
            return {
                ...state,
                customerCanceled: action.payload
            };

        case SET_TRANSACTION_TERMS:
            chat = state.chat;
            const { buyerAcceptedTransactionTerms, sellerAcceptedTransactionTerms } = action.payload;
            chat.buyerAcceptedTransactionTerms = buyerAcceptedTransactionTerms;
            chat.sellerAcceptedTransactionTerms = sellerAcceptedTransactionTerms;

            return {
                ...state,
                chat
            };

        case GET_UNREAD_MESSAGES:
            return {
                ...state,
                unreadMessages: action.payload
            };

        case SET_UNREAD_MESSAGES:
            return {
                ...state,
                unreadMessages: state.unreadMessages + action.payload
            };

        case SUBTRACT_UNREAD_MESSAGES:
            unreadCount = state.unreadMessages - action.payload;
            return {
                ...state,
                unreadMessages: unreadCount < 0 ? 0 : unreadCount
            };

        case CLEAR_UNREAD_MESSAGES:
            return {
                ...state,
                unreadMessages: 0
            };

        default:
            return state;
    }
};

export default chatsReducer;