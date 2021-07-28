import Validator from 'validator';
import isEmpty from '../../isEmpty';

const priceFilter = (data) => {
    let errors = {};
    data.AvailableCurrency = !isEmpty(data.AvailableCurrency) ?  data.AvailableCurrency.toString() : '';
    data.RequiredCurrency = !isEmpty(data.RequiredCurrency) ?  data.RequiredCurrency.toString() : '';
    data.MinExchangeAmount = !isEmpty(data.MinExchangeAmount) ?  data.MinExchangeAmount.toString() : '';

    if (Validator.isEmpty(data.AvailableCurrency)) {
        errors.AvailableCurrency = 'Please select a currency!';
    }

    if (Validator.isEmpty(data.RequiredCurrency)) {
        errors.RequiredCurrency = 'Please select a currency!';
    }

    if (!Validator.isNumeric(data.MinExchangeAmount) || data.MinExchangeAmount <= 0) {
        errors.MinExchangeAmount = 'Invalid amount!';
    }
    if (Validator.isEmpty(data.MinExchangeAmount)) {
        errors.MinExchangeAmount = 'Amount is required!';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};

export default priceFilter;