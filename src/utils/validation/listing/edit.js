import Validator from 'validator';
import isEmpty from '../../isEmpty';

const editListing = (data) => {
    let errors = {};
    data.AvailableCurrency = !isEmpty(data.AvailableCurrency) ?  data.AvailableCurrency.toString() : '';
    data.ExchangeAmount = !isEmpty(data.ExchangeAmount) ?  data.ExchangeAmount.toString() : '';
    data.RequiredCurrency = !isEmpty(data.RequiredCurrency) ?  data.RequiredCurrency.toString() : '';
    data.ExchangeRate = !isEmpty(data.ExchangeRate) ?  data.ExchangeRate.toString() : '';
    data.MinExchangeAmount = !isEmpty(data.MinExchangeAmount) ?  data.MinExchangeAmount.toString() : '';
    data.ReceiptAmount = !isEmpty(data.ReceiptAmount) ?  data.ReceiptAmount.toString() : '';
    data.Bank = !isEmpty(data.Bank) ?  data.Bank.toString() : '';

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

    if (data.MinExchangeAmount) {
        if (!Validator.isNumeric(data.MinExchangeAmount) || data.MinExchangeAmount <= 0) {
            errors.MinExchangeAmount = 'Invalid amount!';
        }
        if (data.MinExchangeAmount && data.ExchangeAmount && Number(data.MinExchangeAmount) > Number(data.ExchangeAmount)) {
            errors.MinExchangeAmount = 'Minimum exchange amount cannot be greater than available amount!';
        }
        if (Validator.isEmpty(data.MinExchangeAmount)) {
            errors.MinExchangeAmount = 'Please fill in the minimum amount you are willing to exchange.';
        }
    }

    if (!Validator.isNumeric(data.ReceiptAmount) || data.ReceiptAmount <= 0) {
        errors.ReceiptAmount = 'Invalid amount!';
    }
    if (Validator.isEmpty(data.ReceiptAmount)) {
        errors.ReceiptAmount = 'Amount is required!';
    }

    if (Validator.isEmpty(data.Bank)) {
        errors.Bank = 'Payment method is required!';
    }
   
    return {
        errors,
        isValid: isEmpty(errors)
    };
};

export default editListing;