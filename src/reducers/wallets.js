import {
  ACTIVATE_EUR_WALLET,
  ACTIVATE_NGN_WALLET,
  ACTIVATE_USD_WALLET,
  ACTIVATE_GPB_WALLET,
  SET_WALLET,
  SET_WALLETS,
  SET_FUNDING_REQUEST,
  SET_WALLET_MSG,
  SET_WALLET_TRANSACTION,
  SET_WALLET_TRANSACTIONS,
  SET_WALLET_FILTER,
  SET_FUNDING_REQUESTS,
  // SET_BANK_ACCOUNT,
  // SET_BANK_ACCOUNTS,
  SET_BANK_ACCOUNT_MSG,
  SET_WALLET_REQS,
  SET_BATCH_ID,
  SET_INSTITUTION_ID,
  AUTHORIZE_WITHDRAWAL,
  CLEAR_WALLET_MSG,
  SET_WITHDRAWAL_REQUEST,
  CLEAR_WITHDRAWAL_REQUESTS,
} from "../actions/types";

import { WALLET_FILTER } from "../utils/constants";

const initialState = {
  fundingRequest: {},
  fundingRequests: [],
  wallet: {},
  wallets: [],
  filter: WALLET_FILTER.HISTORY,
  eurActive: true,
  ngnActive: false,
  usdActive: false,
  gbpActive: false,
  msg: null,
  transactions: [],
  transaction: {},
  // bankAccount: {},
  // bankAccounts: [],
  withdrawalRequests: null,
  batchId: null,
  institutionId: null,
  authorizeRequests: null,
  withdrawalSuccess: null,
};

const walletsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_WALLET:
      return {
        ...state,
        wallet: state.wallets.find(
          (wallet) => wallet.currency.value === action.payload.currency
        ),
      };

    case SET_WALLETS:
      return {
        ...state,
        wallets: action.payload,
      };

    case ACTIVATE_EUR_WALLET:
      if (!state.eurActive) {
        return {
          ...state,
          eurActive: true,
          ngnActive: false,
          usdActive: false,
          gbpActive: false,
        };
      }

      return state;

    case ACTIVATE_NGN_WALLET:
      if (!state.ngnActive) {
        return {
          ...state,
          eurActive: false,
          ngnActive: true,
          usdActive: false,
          gbpActive: false,
        };
      }

      return state;

    case ACTIVATE_USD_WALLET:
      if (!state.usdActive) {
        return {
          ...state,
          eurActive: false,
          ngnActive: false,
          usdActive: true,
          gbpActive: false,
        };
      }

      return state;

    case ACTIVATE_GPB_WALLET:
      if (!state.gbpActive) {
        return {
          ...state,
          eurActive: false,
          ngnActive: false,
          usdActive: false,
          gbpActive: true,
        };
      }

      return state;

    case SET_FUNDING_REQUEST:
      return {
        ...state,
        fundingRequest: action.payload,
      };

    case SET_WALLET_MSG:
      return {
        ...state,
        msg: action.payload,
      };

    case SET_WALLET_TRANSACTION:
      return {
        ...state,
        transaction: action.payload,
      };

    case SET_WALLET_TRANSACTIONS:
      return {
        ...state,
        transactions: action.payload ? action.payload : [],
      };

    case SET_WALLET_FILTER:
      return {
        ...state,
        filter: action.payload,
      };

    case SET_FUNDING_REQUESTS:
      return {
        ...state,
        fundingRequests: action.payload,
      };
    // case SET_BANK_ACCOUNTS:
    //     return {
    //         ...state,
    //         bankAccounts: action.payload,
    //     };
    // case SET_BANK_ACCOUNT:
    //     return {
    //         ...state,
    //         bankAccount: action.payload,
    //     };
    case SET_BANK_ACCOUNT_MSG:
      return {
        ...state,
        msg: action.payload,
      };
    case SET_WALLET_REQS:
      return {
        ...state,
        withdrawalRequests: action.payload,
      };
    case SET_BATCH_ID:
      return {
        ...state,
        batchId: action.payload,
      };
    case SET_INSTITUTION_ID:
      return {
        ...state,
        institutionId: action.payload,
      };
    case AUTHORIZE_WITHDRAWAL:
      return {
        ...state,
        authorizeRequests: action.payload,
      };
    case SET_WITHDRAWAL_REQUEST:
      return {
        ...state,
        withdrawalSuccess: action.payload,
      };
    case CLEAR_WITHDRAWAL_REQUESTS:
      return {
        ...state,
        batchId: null,
        institutionId: null,
        authorizeRequests: null,
        withdrawalSuccess: null,
        withdrawalRequests: null,
      };
    case CLEAR_WALLET_MSG:
      return {
        ...state,
        msg: null,
      };
    default:
      return state;
  }
};

export default walletsReducer;
