import { SET_CHATS } from '../actions/types';

const initialState = {
    chat: {},
    chats: []
};

const chatsReducer = (state = initialState, action) => {
    switch (action.type) {    
        case SET_CHATS:
            return {
                ...state,
                messages: [...action.payload]
            };  
        default:
            return state;
    }
};

export default chatsReducer;