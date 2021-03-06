import Validator from 'validator';
import isEmpty from '../../isEmpty';

const createAccount = (data) => {
    let errors = {};
    data.Email = !isEmpty(data.Email) ?  data.Email : '';
    data.Username = !isEmpty(data.Username) ?  data.Username : '';
    data.Password = !isEmpty(data.Password) ?  data.Password : '';
    data.ConfirmPassword = !isEmpty(data.ConfirmPassword) ?  data.ConfirmPassword : '';

    if (!Validator.isEmail(data.Email.trim())) {
        errors.Email = 'Invalid Email address!';
    }
    if (Validator.isEmpty(data.Email)) {
        errors.Email = 'Email address is required!';
    }

    if (Validator.isEmpty(data.Username)) {
        errors.Username = 'Username is required!';
    }

    if (!Validator.isLength(data.Password, { min: 8 })) {
        errors.Password = 'Password should be at least 8 characters long!';
    }

    if (Validator.isEmpty(data.Password)) {
        errors.Password = 'Password is required!';
    }

    if (!Validator.equals(data.Password, data.ConfirmPassword)) {
        errors.ConfirmPassword = 'Passwords do not match!';
    }

    if (Validator.isEmpty(data.ConfirmPassword)) {
        errors.ConfirmPassword = 'Please confirm your Password!';
    }
   
    return {
        errors,
        isValid: isEmpty(errors)
    };
};

export default createAccount;