import { decode } from 'html-entities';
const NGN = 'NGN';
const EUR = 'EUR';

const getCurrencySymbol = (currency) => {
    switch (currency) {
        case NGN:
            return decode('&#8358;');

        case EUR:
            return decode('&#163;');

        default:
            return '';
    }
};

export default getCurrencySymbol;