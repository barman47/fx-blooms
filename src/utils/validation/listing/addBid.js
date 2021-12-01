import Validator from 'validator';
import isEmpty from '../../isEmpty';

const addBid = (data) => {
    let errors = {};
    data.Amount = !isEmpty(data.Amount) ?  data.Amount.toString() : '';
    data.receivingAccount = !isEmpty(data.receivingAccount) ?  data.receivingAccount.toString() : '';

    if (Validator.isEmpty(data.Amount)) {
        errors.Amount = 'Amount is required!';
    }

    if (Validator.isEmpty(data.receivingAccount)) {
        errors.receivingAccount = 'Your receiving account is required!';
    }
   
    return {
        errors,
        isValid: isEmpty(errors)
    };
};

export default addBid;