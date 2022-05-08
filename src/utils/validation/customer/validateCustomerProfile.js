import Validator from 'validator';
import isEmpty from '../../isEmpty';

const validateCustomerProfile = (data) => {
    let updateErrors = {};
    data.phoneNumber = !isEmpty(data.phoneNumber) ?  data.phoneNumber : '';
    data.address = !isEmpty(data.address) ?  data.address : '';
    data.country = !isEmpty(data.country) ?  data.country : '';
    data.postalCode = !isEmpty(data.postalCode) ?  data.postalCode : '';

    if (Validator.isEmpty(data.phoneNumber)) {
        updateErrors.phoneNumber = 'Customer Phone Number is required!';
    }

    if (Validator.isEmpty(data.address)) {
        updateErrors.address = 'Customer Address is required!';
    }

    if (Validator.isEmpty(data.country)) {
        updateErrors.country = 'Customer\'s Country is required!';
    }

    if (!Validator.isEmpty(data.postalCode)) {
        if (!Validator.isPostalCode(data.postalCode, 'any')) {
            updateErrors.postalCode = 'Invalid Postal Code!';
        }
    }   

    return {
        updateErrors,
        isValid: isEmpty(updateErrors)
    };
};

export default validateCustomerProfile;