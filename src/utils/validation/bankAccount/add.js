import Validator from 'validator';
import isEmpty from '../../isEmpty';

const addBankAccount = (data) => {
    let errors = {};
    data.AccountName = !isEmpty(data.AccountName) ?  data.AccountName : '';
    data.AccountNumber = !isEmpty(data.AccountNumber) ?  data.AccountNumber : '';
    data.BankName = !isEmpty(data.BankName) ?  data.BankName : '';

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