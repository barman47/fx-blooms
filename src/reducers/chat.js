
import { 
    EXIT_CHAT, 
    SET_CHAT, 
    SET_CHATS, 
    SENT_MESSAGE, 
    SHOW_PAYMENT_NOTIFICATION,
    PAYMENT_MADE
} from '../actions/types';

const initialState = {
    chat: null,
    chats: [],
    sessionId: null,
    paymentNotification: null,
    paymentMade: false
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
            
        case EXIT_CHAT:
            chats = [...state.chats];
            chat = {...state.chat};
            chatIndex = chats.findIndex(item => item.id === chat.id);
            chats.splice(chatIndex, 1, chat);
            return {
                ...state,
                chat: null,
                chats,
            };

        case SET_CHAT:
            return {
                ...state,
                chat: action.payload,
                sessionId: action.payload.sessionId || action.payload.id
            };

        case SENT_MESSAGE: 
            const { messages, ...rest } = state.chat;
            messageList = [...messages, action.payload];
            return {
                ...state,
                chat: { ...rest, messages: messageList }
            }

        case SHOW_PAYMENT_NOTIFICATION:
            return {
                ...state,
                paymentNotification: action.payload
            };

        case PAYMENT_MADE: 
            return {
                ...state,
                paymentMade:true
            };

        default:
            return state;
    }
};

export default chatsReducer;