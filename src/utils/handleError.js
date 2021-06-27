import { GET_ERRORS } from '../actions/types';
import { NETWORK_ERROR } from './constants';

const handleError =  (err, dispatch) => {
    // console.error(err);
    console.log(err.response);
    
    if (err?.message === NETWORK_ERROR) {
        return dispatch({
            type: GET_ERRORS,
            payload: { msg: NETWORK_ERROR }
        });     
    }

    const { msg, ...rest } = err?.response?.data.errors;
    
    return dispatch({
        type: GET_ERRORS,
        payload: { ...rest }
    });
};

export default handleError;