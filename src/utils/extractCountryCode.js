import { countries } from './countries'; 

const extractCountryCode = (phoneNumber) => {
    const countryCodes = countries.map(country => country.phone);
    let countryCode = null;
    countryCodes.forEach(code => {
        if (phoneNumber.startsWith(code)) {
            countryCode = `+${code}`;
        }
        if (phoneNumber.startsWith(`+${code}` )) {
            countryCode = `+${code}`;
        }
    });
    
    const number = phoneNumber.slice(countryCode.length);
    
    return {
        code: countryCode,
        number: number.startsWith('0') ? number.replace('0', '') : number
    }
};

export default extractCountryCode;