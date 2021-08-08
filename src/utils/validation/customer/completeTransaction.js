import Validator from 'validator';
import isEmpty from '../../isEmpty';

const completeTransaction = (data) => {
    let errors = {};
    data.Message = !isEmpty(data.Message) ?  data.Message : '';
    data.Rating = !isEmpty(data.Rating) ?  data.Rating.toString() : '';

    if (Validator.isEmpty(data.Message)) {
        errors.Message = 'Your feedback is required!';
    }

    if (Validator.isEmpty(data.Rating)) {
        errors.Rating = 'Please rate this seller!';
    }
   
    return {
        errors,
        isValid: isEmpty(errors)
    };
};

export default completeTransaction;