import Validator from 'validator';
import isEmpty from '../../isEmpty';

const rateCustomer = (data) => {
    let errors = {};
    data.successfulTransaction = !isEmpty(data.successfulTransaction) ?  data.successfulTransaction : '';
    data.ratingComment = !isEmpty(data.ratingComment) ?  data.ratingComment : '';
    data.sellerRating = !isEmpty(data.sellerRating) ?  data.sellerRating.toString() : '';

    if (Validator.isEmpty(data.successfulTransaction)) {
        errors.successfulTransaction = 'Was this transaction successful?';
    }

    if (Validator.isEmpty(data.ratingComment)) {
        errors.ratingComment = 'Your feedback is required!';
    }

    if (Validator.isEmpty(data.sellerRating)) {
        errors.sellerRating = 'Please rate this seller!';
    }
   
    return {
        errors,
        isValid: isEmpty(errors)
    };
};

export default rateCustomer;