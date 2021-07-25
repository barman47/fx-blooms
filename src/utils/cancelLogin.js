import { batch } from 'react-redux';
import { store } from '../store';
import { LOGIN } from '../routes';
import { CLEAR_CURRENT_CUSTOMER, SET_BARCODE } from '../actions/types';

const cancelLogin = (history) => {
    batch(() => {
        store.dispatch({ type: CLEAR_CURRENT_CUSTOMER });
        
        store.dispatch({
            type: SET_BARCODE,
            payload: {}
        });
    });
    return history.push(`${LOGIN}`);
};

export default cancelLogin;