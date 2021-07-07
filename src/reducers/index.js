import { combineReducers } from 'redux';

import accountReducer from './account';
import adminReducer from './admin';
import countriesReducer from './countries';
import currencyReducer from './currencies';
import customerReducer from './customer';
import documentsReducer from './documents';
import listingsReducer from './listings';
import errorsReducer from './errors';
import subscriptionReducer from './subscription';

const rootReducer = combineReducers({
    account: accountReducer,
    admin: adminReducer,
    countries: countriesReducer,
    customer: customerReducer,
    currencies: currencyReducer,
    documents: documentsReducer,
    listings: listingsReducer,
    errors: errorsReducer,
    subscription: subscriptionReducer
});

export default rootReducer;