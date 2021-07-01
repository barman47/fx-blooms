import { combineReducers } from 'redux';

import accountReducer from './account';
import countriesReducer from './countries';
import currencyReducer from './currencies';
import customerReducer from './customer';
import documentsReducer from './documents';
import listingsReducer from './listings';
import errorsReducer from './errors';
import subscriptionReducer from './subscription';

const rootReducer = combineReducers({
    account: accountReducer,
    countries: countriesReducer,
    customer: customerReducer,
    currencies: currencyReducer,
    documents: documentsReducer,
    listings: listingsReducer,
    errors: errorsReducer,
    subscription: subscriptionReducer
});

export default rootReducer;