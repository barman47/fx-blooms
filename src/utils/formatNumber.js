import numbro from 'numbro';

const formatNumber = (number, mantissa = 2) => numbro(number).format({ thousandSeparated: true, mantissa });

export default formatNumber;