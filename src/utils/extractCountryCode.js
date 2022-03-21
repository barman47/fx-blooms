import { countries } from './countries'; 

const extractCountryCode = (phoneNumber) => {
    const phoneNo = phoneNumber.startsWith('+') ? phoneNumber.substring(1) : phoneNumber;
    const countryCodes = countries.map(country => country.phone);
    let countryCode = null;
    let number = null;

    countryCodes.forEach(code => {
        if (phoneNo.startsWith(code)) {
            countryCode = `+${code}`;
            number = phoneNo.slice(code.length);
        }
        if (phoneNo.startsWith(`+${code}` )) {
            countryCode = `+${code}`;
            number = phoneNo.slice(`+${code.length}`);
        }
    });
    
    return {
        code: countryCode,
        number: number.startsWith('0') ? number.replace('0', '') : number
    }
};

export default extractCountryCode;