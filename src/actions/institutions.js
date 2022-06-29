import axios from "axios";
import handleError from "../utils/handleError";
import reIssueCustomerToken from "../utils/reIssueCustomerToken";
import reIssueAdminToken from "../utils/reIssueAdminToken";
import { SET_INSTITUTIONS } from "./types";

const API = `${process.env.REACT_APP_WALLET_API}`;
const api = `${API}/Yapily`;

export const getInstitutions =
    (admin = "") =>
    async (dispatch) => {
        try {
            if (!!admin) {
                await reIssueAdminToken();
            } else {
                await reIssueCustomerToken();
            }
            const res = await axios.get(`${api}/institutions`);
            return dispatch({
                type: SET_INSTITUTIONS,
                payload: !!admin ? res.data.data : res.data.data.data,
            });
        } catch (err) {
            return handleError(err, dispatch);
        }
    };
