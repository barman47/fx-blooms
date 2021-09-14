
import { 
    UPDATE_ACTIVE_CHAT, 
    SET_CHAT, 
    SET_CHATS, 
    SENT_MESSAGE,
    PAYMENT_NOTIFICATION,
    REMOVE_CHAT,
    SET_UNREAD_MESSAGES,
    SUBTRACT_UNREAD_MESSAGES,
    CLEAR_UNREAD_MESSAGES
} from '../actions/types';

const initialState = {
    chat: null,
    chats: [],
    sessionId: null,
    unreadMessages: 0
};

const chatsReducer = (state = initialState, action) => {
    let messageList = [];
    let chat = {};
    let chats = [];
    let chatIndex;

    switch (action.type) {    
        case SET_CHATS:
            return {
                ...state,
                chats: [...action.payload]
            }; 
            
        case UPDATE_ACTIVE_CHAT:
            chats = state.chats;
            chat = state.chat;
            chatIndex = chats.findIndex(item => item.id === chat.id);
            chats.splice(chatIndex, 1, chat);
            return {
                ...state,
                chats,
            };

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
            const { messages, ...rest } = state.chat;
            messageList = [...messages, action.payload];
            return {
                ...state,
                chat: { ...rest, messages: messageList },
                unreadMessages: state.unreadMessages + 1
            }

        case PAYMENT_NOTIFICATION: 
            chat = state.chat;
            chat.buyerHasMadePayment = action.payload.buyerHasMadePayment;
            chat.buyerHasRecievedPayment = action.payload.buyerHasRecievedPayment;
            chat.sellerHasMadePayment = action.payload.sellerHasMadePayment;
            chat.sellerHasRecievedPayment = action.payload.sellerHasRecievedPayment;
            chat.isDeleted = action.payload.isDeleted;

            return {
                ...state,
                chat: {...state.chat, ...action.payload}
            };

        case SET_UNREAD_MESSAGES:
            return {
                ...state,
                unreadMessages: state.unreadMessages + action.payload
            };

        case SUBTRACT_UNREAD_MESSAGES:
            return {
                ...state,
                unreadMessages: state.unreadMessages - action.payload
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