import { combineReducers } from 'redux';

import countriesReducer from './countries';
import customerReducer from './customer';
import documentsReducer from './documents';
import errorsReducer from './errors';

const rootReducer = combineReducers({
    countries: countriesReducer,
    customer: customerReducer,
    documents: documentsReducer,
    errors: errorsReducer
});

export default rootReducer;