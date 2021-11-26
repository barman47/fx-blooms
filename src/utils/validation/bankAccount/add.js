import Validator from 'validator';
import isEmpty from '../../isEmpty';

const addBankAccount = (data) => {
    let errors = {};
    data.accountName = !isEmpty(data.accountName) ?  data.accountName : '';
    data.accountNumber = !isEmpty(data.accountNumber) ?  data.accountNumber : '';
    data.bankName = !isEmpty(data.bankName) ?  data.bankName : '';

    if (Validator.isEmpty(data.accountName)) {
        errors.accountName = 'Account name is required!';
    }

    // if (!Validator.isIBAN(data.AccountNumber)) {
    //     errors.AccountNumber = 'Invalid IBAN!';
    // }
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