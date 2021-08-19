import Validator from 'validator';
import isEmpty from '../../isEmpty';

const createProfile = (data) => {
    console.log(data);
    let errors = {};
    data.FirstName = !isEmpty(data.FirstName) ?  data.FirstName : '';
    data.LastName = !isEmpty(data.LastName) ?  data.LastName : '';
    data.CountryCode = !isEmpty(data.CountryCode) ?  data.CountryCode : '';
    data.PhoneNo = !isEmpty(data.PhoneNo) ?  data.PhoneNo : '';
    data.Address = !isEmpty(data.Address) ?  data.Address : '';
    data.Country = !isEmpty(data.Country) ?  data.Country : '';
    data.PostalCode = !isEmpty(data.PostalCode) ?  data.PostalCode : '';

    if (Validator.isEmpty(data.FirstName)) {
        errors.FirstName = 'Your First Name is required!';
    }

    if (Validator.isEmpty(data.LastName)) {
        errors.LastName = 'Your Last Name is required!';
    }

    if (Validator.isEmpty(data.CountryCode)) {
        errors.CountryCode = 'Your Country Code is required!';
    }
    if (!Validator.isMobilePhone(data.PhoneNo)) {
        errors.PhoneNo = 'Invalid Phone Number!';
    }
    if (Validator.isEmpty(data.PhoneNo)) {
        errors.PhoneNo = 'Phone Number is required!';
    }

    if (Validator.isEmpty(data.Address)) {
        errors.Address = 'Your Address is required!';
    }

    if (Validator.isEmpty(data.Country)) {
        errors.Country = 'Your Country is required!';
    }

    if (!Validator.isEmpty(data.PostalCode)) {
        if (!Validator.isPostalCode(data.PostalCode, 'any')) {
            errors.PostalCode = 'Invalid Postal Code!';
        }
    }   

   
    return {
        errors,
        isValid: isEmpty(errors)
    };
};

export default createProfile;