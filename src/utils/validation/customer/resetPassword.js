import Validator from 'validator';
import isEmpty from '../../isEmpty';

const resetPassword = (data) => {
    let errors = {};
    data.Password = !isEmpty(data.Password) ?  data.Password : '';
    data.ConfirmPassword = !isEmpty(data.ConfirmPassword) ?  data.ConfirmPassword : '';

    if (Validator.isEmpty(data.Password)) {
        errors.Password = 'Password is required!';
    }

    if (!Validator.isLength(data.Password, { min: 8 })) {
        errors.Password = 'Password should be at least 8 characters long!';
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

export default resetPassword;