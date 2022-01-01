import Validator from 'validator';
import isEmpty from '../../isEmpty';

const sendEmail = (data) => {
    let errors = {};
    data.EmailAddress = !isEmpty(data.EmailAddress) ?  data.EmailAddress : '';
    data.FullName = !isEmpty(data.FullName) ?  data.FullName : '';
    data.Subject = !isEmpty(data.Subject) ?  data.Subject : '';
    data.Message = !isEmpty(data.Message) ?  data.Message : '';

    if (!Validator.isEmail(data.EmailAddress)) {
        errors.EmailAddress = 'Invalid Email address!';
    }
    if (Validator.isEmpty(data.EmailAddress)) {
        errors.EmailAddress = 'Email address is required!';
    }
   

    if (Validator.isEmpty(data.FullName)) {
        errors.FullName = 'Your full name is required!';
    }

    if (Validator.isEmpty(data.Subject)) {
        errors.Subject = 'Message subject is required!';
    }

    if (Validator.isEmpty(data.Message)) {
        errors.Message = 'Message is required!';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};

export default sendEmail;