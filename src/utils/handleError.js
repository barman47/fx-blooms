import { GET_ERRORS } from '../actions/types';
import { NETWORK_ERROR } from './constants';

const handleError =  (err, dispatch) => {
    dispatch({
        type: GET_ERRORS,
        payload: {}
    });

    console.log(err.response);
    console.log(err.message);
    
    if (err?.message === NETWORK_ERROR) {
        console.log('network error');
        return dispatch({
            type: GET_ERRORS,
            payload: { msg: NETWORK_ERROR }
        });     
    }

    const errors = err?.response?.data?.errors;
    const title = err?.response?.data?.title;

    if (errors) {       
        let errorObject = {}; 
        Object.entries(errors).forEach(([error, value]) => {
            errorObject[`${error}`] = value[0];
        });
        errorObject.msg = title;

        console.log(errorObject)
        return dispatch({
            type: GET_ERRORS,
            payload: { ...errorObject }
        });
    }

    const message = err?.response?.data?.message;

    if (message) {
        return dispatch({
            type: GET_ERRORS,
            payload: { msg: message, message }
        });
    }

    if (err?.response?.status === 500) {
        return dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        }); 
    }
    
    // return dispatch({
    //     type: GET_ERRORS,
    //     payload: { ...rest }
    // });
};

export default handleError;