import Validator from 'validator';
import isEmpty from '../../isEmpty';

const login = (data) => {
    let errors = {};
    data.Username = !isEmpty(data.Username) ?  data.Username : '';
    data.Password = !isEmpty(data.Password) ?  data.Password : '';

    if (Validator.isEmpty(data.Username)) {
        errors.Username = 'Username is required!';
    }

    if (Validator.isEmpty(data.Password)) {
        errors.Password = 'Password is required';
    }
   
    return {
        errors,
        isValid: isEmpty(errors)
    };
};

export default login;