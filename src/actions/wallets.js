import axios from 'axios';
import { FUND_CONFIRMATION } from '../routes';
import handleError from '../utils/handleError';
import reIssueCustomerToken from '../utils/reIssueCustomerToken';

import { SET_CUSTOMER_MSG, SET_FUNDING_DETAILS, SET_WALLETS, SET_WALLET_MSG, SET_WALLET_TRANSACTIONS } from './types';

const API = `${process.env.REACT_APP_WALLET_API}`;
const WALLETS_API = `${API}/wallet-management`;
const YAPILY_API = `${API}/Yapily`;

export const createWallet = (data) => async (dispatch)  => {
    try {
        await reIssueCustomerToken();
        const res = await axios.post(`${WALLETS_API}/wallets/create`, data);
        console.log(res);
        return dispatch({
            type: SET_WALLET_MSG,
            payload: 'Wallet created successfully'
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

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

export const getWalletTransactions = (walletId) => async (dispatch)  => {
    try {
        await reIssueCustomerToken();
        const res = await axios.get(`${WALLETS_API}/wallets/${walletId}/transactions`);
        return dispatch({
            type: SET_WALLET_TRANSACTIONS,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const requestWalletFunding = (data, navigate) => async (dispatch)  => {
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
            institution: data.institution,
            accountName: data.accountName,
            accountNumber: data.accountNumber,
            qrCodeUrl,
            status
        };
        dispatch({
            type: SET_FUNDING_DETAILS,
            payload: fundindDetails
        });
        return navigate(FUND_CONFIRMATION);
    } catch (err) {
        console.log(err.response);
        console.log(err);
        return handleError(err, dispatch);
    }
};

export const requestWithdrawal = (data) => async (dispatch) => {
    try {
        await Promise.all([
            await reIssueCustomerToken(),
            axios.post(`${YAPILY_API}/withdraw`, data)
        ]);
        dispatch({
            type: SET_CUSTOMER_MSG,
            payload: 'Withdrawal request made successfully. You will receive your funds shortly.'
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const payment = (data) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.post(`${YAPILY_API}/payment`, data);
        console.log(res);
    } catch (err) {
        return handleError(err, dispatch);
    }
};