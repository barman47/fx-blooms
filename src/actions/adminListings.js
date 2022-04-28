import axios from 'axios';
import handleError from '../utils/handleError';
import { SET_LISTINGS } from './types';
import reIssueAdminToken from '../utils/reIssueAdminToken';


const API = `${process.env.REACT_APP_BACKEND_API}`;
const URL = `${API}/Listing`;

export const getAllListings = () => async (dispatch) => {
    try {
        await reIssueAdminToken();
        const res = await axios.post(`${URL}/GetAllListings`, {
            pageNumber: 0,
            pageSize: 15,
            currencyNeeded: 'NGN',
            currencyAvailable: 'NGN',
            minimumExchangeAmount: 0,
            useCurrencyFilter: false
        });
        const { items, ...rest } = res.data.data;

        dispatch({
            type: SET_LISTINGS,
            payload: { listings: items, ...rest }
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};