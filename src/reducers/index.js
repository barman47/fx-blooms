import { combineReducers } from 'redux';

import { RESET_STORE } from '../actions/types';

import adminReducer from './admin';
import bankAccountsReducer from './bankAccounts';
import notificationsReducer from './notifications';
import countriesReducer from './countries';
import currencyReducer from './currencies';
import customerReducer from './customer';
import customersReducer from './customers';
import documentsReducer from './documents';
import listingsReducer from './listings';
import loadingReducer from './loading';
import errorsReducer from './errors';
import statsReducer from './stats';
import subscriptionReducer from './subscription';
import twoFactorReducer from './twoFactor';
import walletsReducer from './wallets';
import transactionsReducer from './transactions';

const appReducer = combineReducers({
    loading: loadingReducer,
    admin: adminReducer,
    bankAccounts: bankAccountsReducer,
    countries: countriesReducer,
    customer: customerReducer,
    customers: customersReducer,
    currencies: currencyReducer,
    documents: documentsReducer,
    errors: errorsReducer,
    listings: listingsReducer,
    notifications: notificationsReducer,
    stats: statsReducer,
    subscription: subscriptionReducer,
    transactions: transactionsReducer,
    twoFactor: twoFactorReducer,
    wallets: walletsReducer
});

const rootReducer = (state, action) => {
    if (action.type === RESET_STORE) {
        state = undefined;
    }
    return appReducer(state, action);
};

export default rootReducer;