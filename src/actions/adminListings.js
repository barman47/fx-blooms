import axios from 'axios';
import handleError from '../utils/handleError';
import { SET_LISTINGS } from './types';
import reIssueAdminToken from '../utils/reIssueAdminToken';


const API = `${process.env.REACT_APP_BACKEND_API}`;
const URL = `${API}/Listing`;

export const getAllListings = (query) => async (dispatch) => {
    try {
        await reIssueAdminToken();
        const res = await axios.post(`${URL}/GetAllListings`, query);
        const { items, ...rest } = res.data.data;

        dispatch({
            type: SET_LISTINGS,
            payload: { listings: items, ...rest }
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getListingByStatus = (status) => async (dispatch) => {
    try {
        await reIssueAdminToken();
        const res = await axios.get(`${URL}/GetListingByStatus`);
        return dispatch({
            type: SET_LISTINGS,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
}