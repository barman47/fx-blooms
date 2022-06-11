import Validator from 'validator';
import isEmpty from '../../isEmpty';

const setPin = (data, hasSetPin) => {
    let errors = {};
    data.first = !isEmpty(data.first) ?  data.first : '';
    data.second = !isEmpty(data.second) ?  data.second : '';
    data.third = !isEmpty(data.third) ?  data.third : '';
    data.fourth = !isEmpty(data.fourth) ?  data.fourth : '';

    data.fifth = !isEmpty(data.fifth) ?  data.fifth : '';
    data.sixth = !isEmpty(data.sixth) ?  data.sixth : '';
    data.seventh = !isEmpty(data.seventh) ?  data.seventh : '';
    data.eight = !isEmpty(data.eight) ?  data.eight : '';

    if (hasSetPin) {
        // Placing 9th to 12th validation first for a reason. I don't have strength to explain it. To understand why, alter the code and see.
        if (Validator.isEmpty(data.fifth)) {
            errors.fifth = 'OTP is required!';
        }
        if (Validator.isEmpty(data.sixth)) {
            errors.sixth = 'OTP is required!';
        }
        if (Validator.isEmpty(data.seventh)) {
            errors.seventh = 'OTP is required!';
        }
        if (Validator.isEmpty(data.eighth)) {
            errors.eighth = 'OTP is required!';
        }
    }

    if (Validator.isEmpty(data.first)) {
        errors.first = 'Pin is required!';
    }

    if (Validator.isEmpty(data.second)) {
        errors.second = 'Pin is required!';
    }

    if (Validator.isEmpty(data.third)) {
        errors.third = 'Pin is required!';
    }

    if (Validator.isEmpty(data.fourth)) {
        errors.fourth = 'Pin is required!';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};

export default setPin;