import axios from "axios";
import { batch } from "react-redux";
import { FUNDING_REQUEST_STATUS, FUND_CONFIRMATION } from "../routes";
import handleError from "../utils/handleError";
import reIssueCustomerToken from "../utils/reIssueCustomerToken";
import reIssueAdminToken from "../utils/reIssueAdminToken";

import {
    SET_CUSTOMER_MSG,
    SET_FUNDING_REQUEST,
    SET_WALLETS,
    SET_ONE_WALLET,
    SET_WALLET_MSG,
    SET_WALLET_TRANSACTIONS,
    SET_WITHDRAWAL_DETAILS,
    SET_FUNDING_REQUESTS,
    SET_WALLET,
    // UPDATE_FUNDING_REQUEST,
    SET_BANK_ACCOUNT_MSG,
    COMPLETE_WITHDRAWAL_REQ,
    SET_WALLET_REQS,
    SET_BATCH_ID,
    SET_ACCOUNT,
    AUTHORIZE_WITHDRAWAL,
    SET_WITHDRAWAL_REQUEST,
    CREDIT_LISTING,
    GET_ERRORS,
} from "./types";
const API = `${process.env.REACT_APP_WALLET_API}`;
const WALLETS_API = `${API}/wallet-management`;
const YAPILY_API = `${API}/Yapily`;
const PAYMENT_REQ = `${API}/PaymentRequest`;
const WALLET_HISTORY = `${API}/TransactionHistory`;
const ACCOUNT_API = `${API}/account-management`;

export const createWallet = (data) => async (dispatch) => {
    try {
        await Promise.all([
            reIssueCustomerToken(),
            await axios.post(`${WALLETS_API}/wallets/create`, data),
        ]);
        return dispatch({
            type: SET_WALLET_MSG,
            payload: "Wallet created successfully",
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

export const getWallets = (customerId, tokenType = "") =>
    async (dispatch) => {
        try {
            if (!!tokenType) {
                await reIssueAdminToken();
            } else {
                await reIssueCustomerToken();
            }
            const res = await axios.get(
                `${WALLETS_API}/customers/${customerId}/wallets`
            );
            dispatch({
                type: SET_WALLETS,
                payload: res.data.data,
            });
        } catch (err) {
            return handleError(err, dispatch);
        }
    };

export const getWalletTransactions = ({ pageNumber, pageSize, walletId }) => async (dispatch) => {
        try {
            await reIssueCustomerToken();
            const res = await axios.get(`${WALLETS_API}/wallets/${walletId}/transactions?pageNumber=${pageNumber}&pageSize=${pageSize}`);
            return dispatch({
                type: SET_WALLET_TRANSACTIONS,
                payload: res.data.data,
            });
        } catch (err) {
            return handleError(err, dispatch);
        }
    };

export const requestWalletFunding = (data, navigate) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.post(`${YAPILY_API}/fund`, data);
        const { authorisationUrl, institutionId, qrCodeUrl, status } = res.data.data.data;

        const fundindDetails = {
            fundingMethod: "Open Banking",
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
            status,
        };
        dispatch({
            type: SET_FUNDING_REQUEST,
            payload: fundindDetails,
        });
        return navigate(FUND_CONFIRMATION);
    } catch (err) {
        if (parseInt(err.response.data.responseCode) === 99) {
            return dispatch({
                type: GET_ERRORS,
                payload: { msg: err.response.data.message,  notSupported: true }
            });
        }
        return handleError(err, dispatch);
    }
};

export const requestWithdrawal = ({ first, second, third, fourth, ...rest}) => async (dispatch) => {
    try {
        await Promise.all([
            await reIssueCustomerToken(),
            axios.post(`${YAPILY_API}/withdraw`, { pin: `${first}${second}${third}${fourth}`, ...rest })
        ]);
        dispatch({
            type: SET_CUSTOMER_MSG,
            payload: 'Your withdrawal request is successful, you should receive the money in your account within 2 working days'
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const payment = ({ paymentRequestId, consentToken, type }, navigate) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.post(`${YAPILY_API}/payment?type=${type}&consentToken=${consentToken}&paymentRequestId=${paymentRequestId}`);
        batch(() => {
            dispatch({
                type: SET_CUSTOMER_MSG,
                payload: "Funding request created successfully",
            });
            dispatch({
                type: SET_FUNDING_REQUEST,
                payload: res.data.data,
            });
        });
        return navigate(FUNDING_REQUEST_STATUS);
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getWithdrawalDetails = (paymentId, paymentRequestId) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.get(`${YAPILY_API}/debit/${paymentId}/details?paymentid=${paymentId}&paymentrequestid=${paymentRequestId}`);
        dispatch({
            type: SET_WITHDRAWAL_DETAILS,
            payload: res.data.data,
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getFundingRequests = (walletId) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.get(`${YAPILY_API}/creditrequests?walletId=${walletId}`);
        // console.log(res);
        return dispatch({
            type: SET_FUNDING_REQUESTS,
            payload: res.data.data,
        });
    } catch (err) {

    }
};

export const getFundingDetails = (paymentId, paymentRequestId) => async (dispatch) => {
    try {
        await reIssueCustomerToken();
        const res = await axios.get(`${YAPILY_API}/credit/${paymentId}/details?paymentid=${paymentId}&paymentrequestid=${paymentRequestId}`);
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
        dispatch({
            type: SET_FUNDING_REQUEST,
            payload: fundingRequest
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getAllDeposits = (query) => async (dispatch) => {
    try {
        await reIssueAdminToken();
        const res = await axios.post(`${PAYMENT_REQ}/GetAllDeposits`, query);
        dispatch({
            type: SET_FUNDING_REQUESTS,
            payload: res.data,
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const viewAllWalletRequests = (query) => async (dispatch) => {
    try {
        await reIssueAdminToken();
        const res = await axios.post(`${WALLET_HISTORY}/ViewAllWalletTransactions`, query);

        return dispatch({
            type: SET_WALLET_TRANSACTIONS,
            payload: res.data.data,
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getAllWithdrawalReqs = (query) => async (dispatch) => {
    try {
        await reIssueAdminToken();
        const res = await axios.post(`${PAYMENT_REQ}/GetAllWithdrawals`, query);
        dispatch({
            type: SET_WALLET_TRANSACTIONS,
            payload: res.data,
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const addAdminBankAccount = (query) => async (dispatch) => {
    try {
        await Promise.all([
            reIssueAdminToken(),
            axios.post(`${ACCOUNT_API}/accounts/add-admin-bank-account`, query),
        ]);

        return dispatch({
            type: SET_BANK_ACCOUNT_MSG,
            payload: "Bank account create successfully",
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const deleteAdminBankAccount = (id) => async (dispatch) => {
    try {
        await Promise.all([
            reIssueAdminToken(),
            axios.post(`${ACCOUNT_API}/accounts/${id}/deleteAdminBankAccount`),
        ]);

        return dispatch({
            type: SET_BANK_ACCOUNT_MSG,
            payload: "Bank account deleted successfully",
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getAllFXBAccounts = () => async (dispatch) => {
    try {
        await reIssueAdminToken();
        const res = await axios.get(
            `${ACCOUNT_API}/accounts/get-all-fxblooms-bank-account`
        );

        return dispatch({
            type: SET_ACCOUNT,
            payload: res.data.data,
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const autoBatch =
    (query, reqBody = []) =>
    async (dispatch) => {
        try {
            await reIssueAdminToken();
            const res = await axios.post(
                `${YAPILY_API}/batch?take=${+query}`,
                reqBody
            );

            dispatch({
                type: SET_BATCH_ID,
                payload: res.data.data.id,
            });
        } catch (err) {
            return handleError(err, dispatch);
        }
    };

export const getBatchById = (id) => async (dispatch) => {
    try {
        await reIssueAdminToken();
        console.log("bat", id);
        const res = await axios.get(`${YAPILY_API}/batch/${id}`);

        dispatch({
            type: SET_WALLET_REQS,
            payload: res.data,
        });
    } catch (err) {
        console.log("bat");
        return handleError(err, dispatch);
    }
};

export const authorizeWithdrawal = (query) => async (dispatch) => {
    try {
        await reIssueAdminToken();
        const res = await axios.post(
            `${YAPILY_API}/authorize-withdrawal`,
            query
        );

        dispatch({
            type: AUTHORIZE_WITHDRAWAL,
            payload: res.data.data.data,
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const makeWithdrawalPayment =
    ({ request, consent, type }) =>
    async (dispatch) => {
        try {
            await reIssueAdminToken();
            const res = await axios.post(
                `${YAPILY_API}/payment?type=${type}&consentToken=${consent}&paymentRequestId=${request}`
            );
            console.log(res.data);
            batch(() => {
                dispatch({
                    type: SET_WALLET_MSG,
                    payload: "Withdrawal successfully",
                });
                dispatch({
                    type: SET_WITHDRAWAL_REQUEST,
                    payload: res.data,
                });
            });
        } catch (err) {
            return handleError(err, dispatch);
        }
    };

export const creditListing = (walletId, query) => async (dispatch) => {
    try {
        // console.log(walletId);
        // console.log(query);
        await Promise.all([
            reIssueAdminToken(),
            axios.post(`${WALLETS_API}/wallets/${walletId}/credit`, query),
        ]);

        dispatch({
            type: CREDIT_LISTING,
            payload: "Wallet credit successful",
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const getOneWallet = (walletId) => async (dispatch) => {
    try {
        await reIssueAdminToken();
        const res = await axios.get(`${WALLETS_API}/wallets/${walletId}`);
        // console.log(res.data.data);

        dispatch({
            type: SET_ONE_WALLET,
            payload: res.data.data,
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};

export const completeWithdrawalRequest = (query, token) => async (dispatch) => {
    try {
        await reIssueAdminToken();
        console.log(query, token);
        const res = await axios.post(
            `${PAYMENT_REQ}/CompleteWithdrawalRequest`,
            query
        );

        dispatch({
            type: COMPLETE_WITHDRAWAL_REQ,
            payload: res.data.data,
        });
    } catch (err) {
        return handleError(err, dispatch);
    }
};
