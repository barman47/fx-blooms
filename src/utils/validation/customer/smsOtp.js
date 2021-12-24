import Validator from 'validator';
import isEmpty from '../../isEmpty';

const authenticator = (data) => {
    let errors = {};
    data.first = !isEmpty(data.first) ?  data.first : '';
    data.second = !isEmpty(data.second) ?  data.second : '';
    data.thrid = !isEmpty(data.thrid) ?  data.thrid : '';
    data.fourth = !isEmpty(data.fourth) ?  data.fourth : '';
    data.fifth = !isEmpty(data.fifth) ?  data.fifth : '';

    if (Validator.isEmpty(data.first)) {
        errors.first = 'Code is required!';
    }

    if (Validator.isEmpty(data.second)) {
        errors.second = 'Code is required!';
    }

    if (Validator.isEmpty(data.third)) {
        errors.third = 'Code is required!';
    }

    if (Validator.isEmpty(data.fourth)) {
        errors.fourth = 'Code is required!';
    }

    if (Validator.isEmpty(data.fifth)) {
        errors.fifth = 'Code is required!';
    }
   
    return {
        errors,
        isValid: isEmpty(errors)
    };
};

export default authenticator;