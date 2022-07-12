import Validator from 'validator';
import isEmpty from '../../isEmpty';

const addListing = (data) => {
    let errors = {};
    data.AvailableCurrency = !isEmpty(data.AvailableCurrency) ?  data.AvailableCurrency.toString() : '';
    data.ExchangeAmount = !isEmpty(data.ExchangeAmount) ?  data.ExchangeAmount.toString() : '';
    data.RequiredCurrency = !isEmpty(data.RequiredCurrency) ?  data.RequiredCurrency.toString() : '';
    data.ExchangeRate = !isEmpty(data.ExchangeRate) ?  data.ExchangeRate.toString() : '';

    if (Validator.isEmpty(data.AvailableCurrency)) {
        errors.AvailableCurrency = 'Please select a currency!';
    }

    if (!Validator.isNumeric(data.ExchangeAmount) || data.ExchangeAmount <= 0) {
        errors.ExchangeAmount = 'Invalid amount!';
    }
    if (Validator.isEmpty(data.ExchangeAmount)) {
        errors.ExchangeAmount = 'Exchange amount is required!';
    }

    if (Validator.isEmpty(data.RequiredCurrency)) {
        errors.RequiredCurrency = 'Please select a currency!';
    }

    // if (data.AvailableCurrency === data.RequiredCurrency) {
    //     errors.AvailableCurrency = 'Not allowed!';
    //     errors.RequiredCurrency = 'Not allowed!';
    // }

    if (!Validator.isNumeric(data.ExchangeRate) || data.ExchangeRate <= 0) {
        errors.ExchangeRate = 'Invalid amount!';
    }
    if (Validator.isEmpty(data.ExchangeRate)) {
        errors.ExchangeRate = 'Exchange rate is required!';
    }
   
    return {
        errors,
        isValid: isEmpty(errors)
    };
};

export default addListing;