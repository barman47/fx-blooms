import { combineReducers } from 'redux';

import accountReducer from './account';
import adminReducer from './admin';
import chatsReducer from './chat';
import countriesReducer from './countries';
import currencyReducer from './currencies';
import customerReducer from './customer';
import customersReducer from './customers';
import documentsReducer from './documents';
import listingsReducer from './listings';
import errorsReducer from './errors';
import subscriptionReducer from './subscription';
import twoFactorReducer from './twoFactor';

const rootReducer = combineReducers({
    account: accountReducer,
    admin: adminReducer,
    countries: countriesReducer,
    chat: chatsReducer,
    customer: customerReducer,
    customers: customersReducer,
    currencies: currencyReducer,
    documents: documentsReducer,
    listings: listingsReducer,
    errors: errorsReducer,
    subscription: subscriptionReducer,
    twoFactor: twoFactorReducer
});

export default rootReducer;