import Validator from 'validator';
import isEmpty from '../../isEmpty';

const setPin = (data) => {
    let errors = {};
    data.first = !isEmpty(data.first) ?  data.first : '';
    data.second = !isEmpty(data.second) ?  data.second : '';
    data.thrid = !isEmpty(data.thrid) ?  data.thrid : '';
    data.fourth = !isEmpty(data.fourth) ?  data.fourth : '';
    data.fifth = !isEmpty(data.fifth) ?  data.fifth : '';
    data.sixth = !isEmpty(data.sixth) ?  data.sixth : '';
    data.seventh = !isEmpty(data.seventh) ?  data.seventh : '';
    data.eight = !isEmpty(data.eight) ?  data.eight : '';

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

    if (Validator.isEmpty(data.fifth)) {
        errors.fifth = 'Pin is required!';
    }

    if (Validator.isEmpty(data.sixth)) {
        errors.sixth = 'Pin is required!';
    }

    if (Validator.isEmpty(data.seventh)) {
        errors.seventh = 'Pin is required!';
    }

    if (Validator.isEmpty(data.eighth)) {
        errors.eighth = 'Pin is required!';
    }

    const pin = `${data.first}${data.second}${data.third}${data.fourth}`;
    const confirmPin = `${data.fifth}${data.sixth}${data.seventh}${data.eighth}`;

    if ((pin || confirmPin) && (pin !== confirmPin)) {
        errors.msg = 'PIN and Confirm PIN do not match!';
    }

    if (!pin && !confirmPin) {
        errors.msg = 'Please enter a PIN';
    }
   
    return {
        errors,
        isValid: isEmpty(errors)
    };
};

export default setPin;