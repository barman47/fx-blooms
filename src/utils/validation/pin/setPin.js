import Validator from 'validator';
import isEmpty from '../../isEmpty';

const setPin = (data) => {
    let errors = {};
    data.first = !isEmpty(data.first) ?  data.first : '';
    data.second = !isEmpty(data.second) ?  data.second : '';
    data.third = !isEmpty(data.third) ?  data.third : '';
    data.fourth = !isEmpty(data.fourth) ?  data.fourth : '';

    data.fifth = !isEmpty(data.fifth) ?  data.fifth : '';
    data.sixth = !isEmpty(data.sixth) ?  data.sixth : '';
    data.seventh = !isEmpty(data.seventh) ?  data.seventh : '';
    data.eight = !isEmpty(data.eight) ?  data.eight : '';
    
    data.ninth = !isEmpty(data.ninth) ?  data.ninth : '';
    data.tenth = !isEmpty(data.tenth) ?  data.tenth : '';
    data.eleventh = !isEmpty(data.eleventh) ?  data.eleventh : '';
    data.twelveth = !isEmpty(data.twelveth) ?  data.twelveth : '';

    console.log(data);

    // Placing 9th to 12th validation first for a reason. I don't have strength to explain it. To understand why, alter the code and see.
    if (Validator.isEmpty(data.ninth)) {
        errors.ninth = 'OTP is required!';
    }
    if (Validator.isEmpty(data.tenth)) {
        errors.tenth = 'OTP is required!';
    }
    if (Validator.isEmpty(data.eleventh)) {
        errors.eleventh = 'OTP is required!';
    }
    if (Validator.isEmpty(data.twelveth)) {
        errors.twelveth = 'OTP is required!';
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