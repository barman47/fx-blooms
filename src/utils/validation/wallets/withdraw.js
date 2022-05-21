import Validator from 'validator';
import isEmpty from '../../isEmpty';

const withdraw = (data) => {
    let errors = {};
    data.institutionId = !isEmpty(data.institutionId) ?  data.institutionId : '';
    data.amount = !isEmpty(data.amount) ?  data.amount : '';
    data.accountId = !isEmpty(data.accountId) ?  data.accountId : '';

    data.first = !isEmpty(data.first) ?  data.first : '';
    data.second = !isEmpty(data.second) ?  data.second : '';
    data.third = !isEmpty(data.third) ?  data.third : '';
    data.fourth = !isEmpty(data.fourth) ?  data.fourth : '';

    if (Validator.isEmpty(data.first)) {
        errors.first = 'Pin is required!';
    }
    if (Validator.isEmpty(data.second)) {
        errors.second = 'Pin is required!';
    }
    if (Validator.isEmpty(data.third)) {
        errors.third = 'Pin is required!';
    }
    if (Validator.isEmpty(data.fourth)) {
        errors.fourth = 'Pin is required!';
    }

    if (Validator.isEmpty(data.institutionId)) {
        errors.institution = 'Financial institution is required!';
    }

    if (Validator.isEmpty(data.amount.toString())) {
        errors.amount = 'Please provide an amount!';
    }

    if (Validator.isEmpty(data.accountId)) {
        errors.sourceAccount = 'Please select a receiving account!';
    }
   
    return {
        errors,
        isValid: isEmpty(errors)
    };
};

export default withdraw;