import Validator from 'validator';
import isEmpty from '../../isEmpty';

const priceFilter = (data) => {
    let errors = {};
    data.AvailableCurrency = !isEmpty(data.AvailableCurrency) ?  data.AvailableCurrency.toString() : '';
    data.RequiredCurrency = !isEmpty(data.RequiredCurrency) ?  data.RequiredCurrency.toString() : '';
    data.Amount = !isEmpty(data.Amount) ?  data.Amount.toString() : '';

    if (Validator.isEmpty(data.AvailableCurrency)) {
        errors.AvailableCurrency = 'Please select a currency!';
    }

    if (Validator.isEmpty(data.RequiredCurrency)) {
        errors.RequiredCurrency = 'Please select a currency!';
    }

    if (!Validator.isNumeric(data.Amount) || data.Amount <= 0) {
        errors.Amount = 'Invalid amount!';
    }
    if (Validator.isEmpty(data.Amount)) {
        errors.Amount = 'Amount is required!';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};

export default priceFilter;