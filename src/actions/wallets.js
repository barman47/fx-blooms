import axios from 'axios';
import { FUND_CONFIRMATION } from '../routes';
import handleError from '../utils/handleError';
import reIssueCustomerToken from '../utils/reIssueCustomerToken';

import { SET_FUNDING_DETAILS, SET_WALLETS } from './types';

const API = `${process.env.REACT_APP_WALLET_API}`;
const WALLETS_API = `${API}/wallet-management`;
const YAPILY_API = `${API}/YAPILY`;

export const getWallets = (customerId) => async (dispatch)  => {
    try {
        await reIssueCustomerToken();
        const res = await axios.get(`${WALLETS_API}/customers/${customerId}/wallets`);
        dispatch({
            type: SET_WALLETS,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const fundWallet = (data, navigate) => async (dispatch)  => {
    try {
        await reIssueCustomerToken();
        const res = await axios.post(`${YAPILY_API}/fund`, data);
        console.log(res);
        const {
            authorisationUrl,
            institutionId,
            qrCodeUrl,
            status
        } = res.data.data.data;
        
        const fundindDetails = {
            fundingMethod: 'Open Banking',
            customer: data.fullName,
            amount: data.amount,
            walletId: data.walletId,
            accountId: data.accountId,
            reference: data.reference,
            authorisationUrl,
            institutionId,
            qrCodeUrl,
            status
        };
        dispatch({
            type: SET_FUNDING_DETAILS,
            payload: fundindDetails
        });
        return navigate(FUND_CONFIRMATION);
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const withdraw = (data) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.post(`${YAPILY_API}/withdraw`, data);
        console.log(res);
    } catch (err) {
        return handleError(err, dispatch);
    }
};