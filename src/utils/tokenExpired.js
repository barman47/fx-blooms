import { store } from '../store';

const tokenExpired = () => {
    const generated = new Date(store.getState().customer.timeGenerated).getTime();
    const now = new Date().getTime();
    const time = now - generated;
    const minutes = (time) / (60) / 1000;

    if (time > 300000) {
        console.log('expired ', Math.floor(minutes) + ' minutes');
        // Token expired, Get New Token
        return true;
    } else {
        console.log('not expired ', Math.floor(minutes) + ' minutes');
        // Token not expired
        return false;
    }
};

export default tokenExpired;