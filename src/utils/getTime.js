import moment from 'moment-timezone';

const getTime = (date) =>  new Date(new Date(date).toUTCString()).getTime(); // Converting to UTC time

export const convertToLocalTime = (date) => {
    const serverTime = moment.tz(date, 'Africa/Lagos'); // Convert to Africa/Lagos timezone
    const localTime = serverTime.clone().tz(moment.tz.guess()); // Convert to local timezone
    return localTime;
};

export default getTime;