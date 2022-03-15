import Validator from 'validator';
import isEmpty from '../../isEmpty';

const editBankAccount = (data) => {
    let errors = {};
    data.accountName = !isEmpty(data.accountName) ?  data.accountName : '';
    data.accountNumber = !isEmpty(data.accountNumber) ?  data.accountNumber : '';
    data.bankName = !isEmpty(data.bankName) ?  data.bankName : '';

    if (Validator.isEmpty(data.accountName)) {
        errors.accountName = 'Account name is required!';
    }

    if (Validator.isEmpty(data.accountNumber)) {
        errors.accountNumber = 'Account number is required!';
    }

    if (Validator.isEmpty(data.bankName)) {
        errors.bankName = 'Bank name is required!';
    }
   
    return {
        errors,
        isValid: isEmpty(errors)
    };
};

export default editBankAccount;