import { GET_ERRORS } from '../actions/types';
import { NETWORK_ERROR } from './constants';

const handleError =  (err, dispatch) => {
    console.error(err);
    const { msg, ...rest } = err?.response?.data.errors;

    if (err?.message === NETWORK_ERROR) {
        return dispatch({
            type: GET_ERRORS,
            payload: { msg: NETWORK_ERROR }
        });     
    }

    console.log(err.response);
    return dispatch({
        type: GET_ERRORS,
        payload: { ...rest }
    });
};

export default handleError;