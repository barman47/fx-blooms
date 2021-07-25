import Validator from 'validator';
import isEmpty from '../../isEmpty';

const residencePermit = (data) => {
    let errors = {};
    data.idNumber = !isEmpty(data.idNumber) ?  data.idNumber : '';
    data.documentType = !isEmpty(data.documentType) ?  data.documentType : '';
    data.img = !isEmpty(data.img) ?  data.img : '';
    data.backImg = !isEmpty(data.backImg) ?  data.backImg : '';

    if (Validator.isEmpty(data.idNumber)) {
        errors.idNumber = 'Document number is required!';
    }

    if (Validator.isEmpty(data.documentType)) {
        errors.documentType = 'Document type is required';
    }

    if (Validator.isEmpty(data.img)) {
        errors.img = 'Front image is required';
    }

    if (Validator.isEmpty(data.backImg)) {
        errors.backImg = 'Back image is required';
    }
   
    return {
        errors,
        isValid: isEmpty(errors)
    };
};

export default residencePermit;