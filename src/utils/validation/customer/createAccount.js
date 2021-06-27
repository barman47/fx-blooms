import Validator from 'validator';
import isEmpty from '../../isEmpty';

const createProfile = (data) => {
    let errors = {};
    data.FirstName = !isEmpty(data.FirstName) ?  data.FirstName : '';
    data.LastName = !isEmpty(data.LastName) ?  data.LastName : '';
    data.CountryCode = !isEmpty(data.CountryCode) ?  data.CountryCode : '';
    data.PhoneNo = !isEmpty(data.PhoneNo) ?  data.PhoneNo : '';
    data.Address = !isEmpty(data.Address) ?  data.Address : '';
    data.CountryId = !isEmpty(data.CountryId) ?  data.CountryId : '';
    data.StateId = !isEmpty(data.StateId) ?  data.StateId : '';
    data.PostalCode = !isEmpty(data.PostalCode) ?  data.PostalCode : '';
    data.Img = !isEmpty(data.Img) ?  data.Img : '';
    data.Document.IdNumber = !isEmpty(data.Document.IdNumber) ?  data.Document.IdNumber : '';
    data.Document.DocumentType = !isEmpty(data.Document.DocumentType) ?  data.Document.DocumentType : '';
    data.Document.Img = !isEmpty(data.Document.Img) ?  data.Document.Img : '';

    // Create Account Validation Start
    data.Email = !isEmpty(data.Email) ?  data.Email : '';
    data.Username = !isEmpty(data.Username) ?  data.Username : '';
    data.Password = !isEmpty(data.Password) ?  data.Password : '';

    if (!Validator.isEmail(data.Email)) {
        errors.Email = 'Invalid Email address!';
    }
    if (Validator.isEmpty(data.Email)) {
        errors.Email = 'Email address is required!';
    }

    if (Validator.isEmpty(data.Username)) {
        errors.Username = 'Username is required!';
    }

    if (Validator.isEmpty(data.Password)) {
        errors.Password = 'Password is required!';
    }

    if (!Validator.isLength(data.Password, { min: 8 })) {
        errors.Password = 'Password should be at least 8 characters long!';
    }

    // Create Account Validation End

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

    if (Validator.isEmpty(data.CountryId)) {
        errors.Country = 'Your Country is required!';
    }

    if (Validator.isEmpty(data.StateId)) {
        errors.City = 'Your City or State is required!';
    }

    if (!Validator.isPostalCode(data.PostalCode, 'any')) {
        errors.PostalCode = 'Invalid Postal Code!';
    }
    if (Validator.isEmpty(data.PostalCode)) {
        errors.PostalCode = 'Your Postal Code is required!';
    }

    if (Validator.isEmpty(data.Img)) {
        errors.Photo = 'Your Photo is required!';
    }

    if (Validator.isEmpty(data.Document.DocumentType)) {
        errors.DocumentType = 'Your Document Type is required!';
    }

    // if (!Validator.isIdentityCard(data.Document.IdNumber, 'any')) {
    //     errors.IdNumber = 'Invalid ID Number!';
    // }
    if (Validator.isEmpty(data.Document.IdNumber)) {
        errors.IdNumber = 'Your ID Number is required!';
    }

    if (Validator.isEmpty(data.Document.Img)) {
        errors.IdFront = 'ID Card Front is required!';
    }
   
    return {
        errors,
        isValid: isEmpty(errors)
    };
};

export default createProfile;