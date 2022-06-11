import Validator from 'validator';
import isEmpty from '../../isEmpty';

const addBankAccount = (data) => {
    let errors = {};
    data.AccountName = !isEmpty(data.AccountName) ?  data.AccountName : '';
    data.AccountNumber = !isEmpty(data.AccountNumber) ?  data.AccountNumber : '';
    data.BankName = !isEmpty(data.BankName) ?  data.BankName : '';

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

    if (Validator.isEmpty(data.AccountName)) {
        errors.AccountName = 'Account name is required!';
    }

    if (Validator.isEmpty(data.AccountNumber)) {
        errors.AccountNumber = 'Account number is required!';
    }

    if (Validator.isEmpty(data.BankName)) {
        errors.BankName = 'Bank name is required!';
    }
   
    return {
        errors,
        isValid: isEmpty(errors)
    };
};

export default addBankAccount;