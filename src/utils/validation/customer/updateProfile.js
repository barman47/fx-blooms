import Validator from 'validator';
import isEmpty from '../../isEmpty';

const updateProfile = (data) => {
    let errors = {};
    data.address = !isEmpty(data.address) ?  data.address : '';
    data.country = !isEmpty(data.country) ?  data.country : '';
    data.postalCode = !isEmpty(data.postalCode) ?  data.postalCode : '';

    if (Validator.isEmpty(data.address)) {
        errors.address = 'Your address is required!';
    }

    if (Validator.isEmpty(data.country)) {
        errors.country = 'Your country is required!';
    }

    if (data.country.toLowerCase() !== 'nigeria') {
        if (!Validator.isPostalCode(data.postalCode, 'any')) {
            errors.postalCode = 'Invalid Postal Code!';
        }
        if (Validator.isEmpty(data.postalCode)) {
            errors.postalCode = 'Your postal code is required!';
        }
    }
   
    return {
        errors,
        isValid: isEmpty(errors)
    };
};

export default updateProfile;