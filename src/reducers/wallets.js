import {
    ACTIVATE_EUR_WALLET,
    ACTIVATE_NGN_WALLET,
    ACTIVATE_USD_WALLET,
    ACTIVATE_GPB_WALLET,
    SET_WALLET,
    SET_WALLETS
} from '../actions/types';

const initialState = {
    wallet: {},
    wallets: [],
    eurActive: true,
    ngnActive: false,
    usdActive: false,
    gbpActive: false
};

const walletsReducer = (state = initialState, action) => {
    switch (action.type) {  
        case SET_WALLET:
            return {
                ...state,
                wallet: state.wallets.find(wallet => wallet.currency.value === action.payload.currency)
            };

        case SET_WALLETS:
            return {
                ...state,
                wallets: action.payload
            };

        case ACTIVATE_EUR_WALLET:  
            if (!state.eurActive) {
                return {
                    ...state,
                    eurActive: true,
                    ngnActive: false,
                    usdActive: false,
                    gbpActive: false
                }; 
            }
            
            return state;
            

        case ACTIVATE_NGN_WALLET:  
            if (!state.ngnActive) {
                return {
                    ...state,
                    eurActive: false,
                    ngnActive: true,
                    usdActive: false,
                    gbpActive: false
                };  
            }
            
            return state;

        case ACTIVATE_USD_WALLET:  
            if (!state.usdActive) {
                return {
                    ...state,
                    eurActive: false,
                    ngnActive: false,
                    usdActive: true,
                    gbpActive: false
                };  
            }
            
            return state;

        case ACTIVATE_GPB_WALLET:  
            if (!state.gbpActive) {
                return {
                    ...state,
                    eurActive: false,
                    ngnActive: false,
                    usdActive: false,
                    gbpActive: true
                };  
            }
            
            return state;

        default:
            return state;
    }
};

export default walletsReducer;