import Validator from 'validator';
import isEmpty from '../../isEmpty';

const signUp = (data) => {
    let errors = {};
    data.email = !isEmpty(data.email) ?  data.email : '';
    data.username = !isEmpty(data.username) ?  data.username : '';
    data.password = !isEmpty(data.password) ?  data.password : '';
    data.confirmPassword = !isEmpty(data.confirmPassword) ?  data.confirmPassword : '';

    if (!Validator.isEmail(data.email)) {
        errors.email = 'Invalid email address!';
    }
    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email address is required!';
    }

    if (Validator.isEmpty(data.username)) {
        errors.username = 'Username is required!';
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password is required!';
    }

    if (!Validator.isLength(data.password, { min: 8 })) {
        errors.password = 'Password should be at least 8 characters long!';
    }

    if (!Validator.equals(data.password, data.confirmPassword)) {
        errors.confirmPassword = 'Passwords do not match!';
    }

    if (Validator.isEmpty(data.confirmPassword)) {
        errors.confirmPassword = 'Please confirm your password!';
    }
   
    return {
        errors,
        isValid: isEmpty(errors)
    };
};

export default signUp;