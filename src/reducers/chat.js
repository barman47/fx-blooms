import { EXIT_CHAT, PAYMENT_MADE, PAYMENT_RECEIVED, SET_CHAT, SET_CHATS, SENT_MESSAGE } from '../actions/types';

const initialState = {
    chat: null,
    chats: [],
    sessionId: null
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

        case PAYMENT_MADE:
            return {
                ...state,
                chat: { ...state.chat, paymentMade: action.payload}
            };

        case PAYMENT_RECEIVED:
            return {
                ...state,
                chat: { ...state.chat, paymentReceived: action.payload}
            };

        default:
            return state;
    }
};

export default chatsReducer;