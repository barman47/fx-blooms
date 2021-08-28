import numbro from 'numbro';

const formatNumber = (number, mantissa = 0) => numbro(number).format({ thousandSeparated: true, mantissa });

export default formatNumber;