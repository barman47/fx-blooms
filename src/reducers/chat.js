import { SET_CHAT, SET_CHATS, SENT_MESSAGE } from '../actions/types';

const initialState = {
    chat: null,
    chats: [],
    sessionId: null
};

const chatsReducer = (state = initialState, action) => {
    let messageList = [];
    let chat = {};
    switch (action.type) {    
        case SET_CHATS:
            return {
                ...state,
                chats: [...action.payload]
            };  

        case SET_CHAT:
            return {
                ...state,
                chat: { ...action.payload.chat },
                sessionId: action.payload.sessionId || action.payload.chat.id
            };

        case SENT_MESSAGE: 
            messageList = [...state.chat.messages, action.payload];
            const { messages, ...rest } = chat;
            return {
                ...state,
                // chat: { ...state.chat, messages: state.chat.messages ? [...state.chat.messages, action.payload] : [action.payload] }
                chat: { ...rest, messages: [...messageList] }
            }

        default:
            return state;
    }
};

export default chatsReducer;