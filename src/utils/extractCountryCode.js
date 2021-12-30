import { countries } from './countries'; 

const extractCountryCode = (phoneNumber) => {
    const countryCodes = countries.map(country => country.phone);
    let countryCode = null;
    countryCodes.forEach(code => {
        if (phoneNumber.startsWith(code)) {
            console.log(`+${code}`);
            debugger
            countryCode = `+${code}`;
        }
        if (phoneNumber.startsWith(`+${code}` )) {
            console.log(`+${code}`);
            debugger
            countryCode = `+${code}`;
        }
    });
    
    const number = phoneNumber.replace(countryCode, '');
    
    return {
        code: countryCode,
        number
    }
};

export default extractCountryCode;