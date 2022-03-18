import {
    ACTIVATE_EUR_WALLET,
    ACTIVATE_NGN_WALLET,
    ACTIVATE_USD_WALLET,
    ACTIVATE_GPB_WALLET
} from '../actions/types';

const initialState = {
    wallets: [],
    eurActive: true,
    ngnActive: false,
    usdActive: false,
    gbpActive: false
};

const walletsReducer = (state = initialState, action) => {
    switch (action.type) {  
        case ACTIVATE_EUR_WALLET:  
            if (!state.eurActive) {
                return {
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