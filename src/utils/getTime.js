import moment from 'moment-timezone';

const getTime = (date = null) =>  {
    if (date) {
        return new Date(new Date(date).toUTCString()).getTime();
    }
    return new Date(new Date().toUTCString()).getTime();
};

export const convertToLocalTime = (date) => {
    const serverTime = moment.tz(date, 'Africa/Lagos'); // Convert to Africa/Lagos timezone
    const localTime = serverTime.clone().tz(moment.tz.guess()); // Convert to local timezone
    return localTime;
};

export default getTime;