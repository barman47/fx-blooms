import axios from "axios";
import handleError from "../utils/handleError";
import {
    SET_LISTINGS,
    SET_DELETED_LISTINGS,
    SET_FINALISED_LISTINGS,
    SET_INPROGRESS_LISTINGS,
    SET_ACTIVE_LISTINGS,
    DELETE_OPEN_LISTING,
} from "./types";
import reIssueAdminToken from "../utils/reIssueAdminToken";

const API = `${process.env.REACT_APP_BACKEND_API}`;
const URL = `${API}/Listing`;
const api = `${API}/Admin`;

export const getAllListings =
    (query, start = null, end = null) =>
    async (dispatch) => {
        try {
            await reIssueAdminToken();
            let res;
            if (!!start && !!end) {
                res = await axios.post(
                    `${URL}/GetAllListingsWithDateFilter?start=${start}&end=${end}`,
                    query
                );
            } else {
                res = await axios.post(`${URL}/GetAllListings`, query);
            }
            const { items, ...rest } = res.data.data;
            // console.log(items)

            dispatch({
                type: SET_LISTINGS,
                payload: { listings: items, ...rest },
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
            payload: res.data.data,
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getActiveListings =
    (query, start = null, end = null) =>
    async (dispatch) => {
        try {
            await reIssueAdminToken();
            let res;
            if (!!start && !!end) {
                res = await axios.post(
                    `${api}/GetActiveListingsWithDateFilter?start=${start}&end=${end}`,
                    query
                );
            } else {
                res = await axios.post(`${api}/GetActiveListings`, query);
            }
            return dispatch({
                type: SET_ACTIVE_LISTINGS,
                payload: res.data.data,
            });
        } catch (err) {
            return handleError(err, dispatch);
        }
    };

export const getListingsInProgress =
    (query, start = null, end = null) =>
    async (dispatch) => {
        try {
            await reIssueAdminToken();
            let res;
            if (!!start && !!end) {
                res = await axios.post(
                    `${api}/GetistingsInProgressWithDateFilter?start=${start}&end=${end}`,
                    query
                );
            } else {
                res = await axios.post(`${api}/GetistingsInProgress`, query);
            }
            return dispatch({
                type: SET_INPROGRESS_LISTINGS,
                payload: res.data.data,
            });
        } catch (err) {
            return handleError(err, dispatch);
        }
    };

export const getFinalisedListings =
    (query, start = null, end = null) =>
    async (dispatch) => {
        try {
            await reIssueAdminToken();
            let res;
            if (!!start && !!end) {
                res = await axios.post(
                    `${api}/GetCompletedListingsWithDateFilter?start=${start}&end=${end}`,
                    query
                );
            } else {
                res = await axios.post(`${api}/GetCompletedListings`, query);
            }
            return dispatch({
                type: SET_FINALISED_LISTINGS,
                payload: res.data.data,
            });
        } catch (err) {
            return handleError(err, dispatch);
        }
    };

export const getDeletedListings =
    (query, start = null, end = null) =>
    async (dispatch) => {
        try {
            await reIssueAdminToken();
            let res;
            if (!!start && !!end) {
                res = await axios.post(
                    `${api}/GetRemovedListingsWithDateFilter?start=${start}&end=${end}`,
                    query
                );
            } else {
                res = await axios.post(`${api}/GetRemovedListings`, query);
            }
            // console.log(res);
            return dispatch({
                type: SET_DELETED_LISTINGS,
                payload: res.data.data,
            });
        } catch (err) {
            return handleError(err, dispatch);
        }
    };

export const deleteLisings = () => async (dispatch) => {
    try {
        await reIssueAdminToken();
        // const res = await axios.post(`${api}/DeleteListings`);

        return dispatch({
            type: DELETE_OPEN_LISTING,
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};
