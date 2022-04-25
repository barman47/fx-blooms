import Validator from 'validator';
import isEmpty from '../../isEmpty';

const updateCustomerProfile = (data) => {
    console.log('hello', data)
    let errors = {};
    data.phoneNumber = !isEmpty(data.phoneNumber) ?  data.phoneNumber : '';
    data.address = !isEmpty(data.address) ?  data.address : '';
    data.country = !isEmpty(data.country) ?  data.country : '';
    data.postalCode = !isEmpty(data.postalCode) ?  data.postalCode : '';

    if (Validator.isEmpty(data.phoneNumber)) {
        errors.phoneNumber = 'Customer Phone Number is required!';
    }

    if (Validator.isEmpty(data.address)) {
        errors.address = 'Customer Address is required!';
    }

    if (Validator.isEmpty(data.country)) {
        errors.country = 'Customer\'s Country is required!';
    }

    if (!Validator.isEmpty(data.postalCode)) {
        if (!Validator.isPostalCode(data.postalCode, 'any')) {
            errors.postalCode = 'Invalid Postal Code!';
        }
    }   

   
    return {
        errors,
        isValid: isEmpty(errors)
    };
};

export default updateCustomerProfile;