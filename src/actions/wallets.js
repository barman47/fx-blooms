import axios from 'axios';
import handleError from '../utils/handleError';
import reIssueCustomerToken from '../utils/reIssueCustomerToken';

const API = `${process.env.REACT_APP_WALLET_API}`;
const api = `${API}/wallet-management`;

export const getWallets = (customerId) => async (dispatch)  => {
    try {
        await reIssueCustomerToken();
        const res = await axios.get(`${api}/customers/${customerId}/wallets`);
        console.log('wallets ', res);
    } catch (err) {
        return handleError(err, dispatch);
    }
};