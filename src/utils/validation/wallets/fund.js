import Validator from 'validator';
import isEmpty from '../../isEmpty';

const fundWallet = (data) => {
    console.log(data);
    let errors = {};
    data.institutionId = !isEmpty(data.institutionId) ?  data.institutionId : '';
    data.amount = !isEmpty(data.amount) ?  data.amount : '';
    data.accountId = !isEmpty(data.accountId) ?  data.accountId : '';

    if (Validator.isEmpty(data.institutionId)) {
        errors.institution = 'Financial institution is required!';
    }

    if (Validator.isEmpty(data.amount.toString())) {
        errors.amount = 'Please provide an amount!';
    }

    if (Validator.isEmpty(data.accountId)) {
        errors.sourceAccount = 'Please select a source account!';
    }
   
    return {
        errors,
        isValid: isEmpty(errors)
    };
};

export default fundWallet;