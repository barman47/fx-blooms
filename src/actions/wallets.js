import axios from 'axios';
import { batch } from 'react-redux';
import { FUNDING_REQUEST_STATUS, FUND_CONFIRMATION } from '../routes';
import handleError from '../utils/handleError';
import reIssueCustomerToken from '../utils/reIssueCustomerToken';

import { 
    SET_CUSTOMER_MSG,
    SET_FUNDING_REQUEST,
    SET_WALLETS,
    SET_WALLET_MSG,
    SET_WALLET_TRANSACTIONS,
    SET_WITHDRAWAL_DETAILS,
    SET_FUNDING_REQUESTS,
    SET_WALLET,
    UPDATE_FUNDING_REQUEST
} from './types';

const API = `${process.env.REACT_APP_WALLET_API}`;
const WALLETS_API = `${API}/wallet-management`;
const YAPILY_API = `${API}/Yapily`;

export const createWallet = (data) => async (dispatch)  => {
    try {
        await Promise.all([
            reIssueCustomerToken(),
            await axios.post(`${WALLETS_API}/wallets/create`, data)
        ]);
        return dispatch({
            type: SET_WALLET_MSG,
            payload: 'Wallet created successfully'
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getWallet = (walletId) => async (dispatch)  => {
    try {
        await reIssueCustomerToken();
        const res = await axios.get(`${WALLETS_API}/wallets/${walletId}`);
        dispatch({
            type: SET_WALLET,
            payload: res.data.data
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

export const getWalletTransactions = ({ pageNumber, pageSize, walletId }) => async (dispatch)  => {
    try {
        await reIssueCustomerToken();
        const res = await axios.get(`${WALLETS_API}/wallets/${walletId}/transactions?pageNumber=${pageNumber}&pageSize=${pageSize}`);
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
            type: SET_FUNDING_REQUEST,
            payload: fundindDetails
        });
        return navigate(FUND_CONFIRMATION);
    } catch (err) {
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

export const payment = ({ paymentRequestId, consentToken, type }, navigate) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.post(`${YAPILY_API}/payment?type=${type}&consentToken=${consentToken}&paymentRequestId=${paymentRequestId}`);
        const { data } = res.data;
        const fundingRequest = {
            id: data.id,
            paymentRequestId,
            status: data.status,
            currency: data.amountDetails.currency,
            date: data.createdAt,
            amount: data.amountDetails.amount,
            reference: data.reference,
        };
        batch(() => {
            dispatch({
                type: SET_CUSTOMER_MSG,
                payload: 'Funding request created successfully'
            });
            dispatch({
                type: SET_FUNDING_REQUEST,
                payload: fundingRequest
            });
        });
        return navigate(FUNDING_REQUEST_STATUS, { state: { paymentRequestId } });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getFundingDetails = (paymentId, paymentRequestId) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.get(`${YAPILY_API}/credit/${paymentId}/details?paymentid=${paymentId}&paymentRequestId=${paymentRequestId}`);
        const { data } = res.data;
        const fundingRequest = {
            id: data.id,
            paymentRequestId,
            status: data.status,
            currency: data.amountDetails.currency,
            date: data.createdAt,
            amount: data.amountDetails.amount,
            reference: data.reference,
        };
        return dispatch({
            type: UPDATE_FUNDING_REQUEST,
            payload: fundingRequest
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getWithdrawalDetails = (paymentId, paymentRequestId) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.get(`${YAPILY_API}/debit/${paymentId}/details?paymentid=${paymentId}&paymentRequestId=${paymentRequestId}`);
        dispatch({
            type: SET_WITHDRAWAL_DETAILS,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getFundingRequests = (walletId) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.get(`${YAPILY_API}/creditrequests?walletId=${walletId}`);
        dispatch({
            type: SET_FUNDING_REQUESTS,
            payload: res.data.data
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};