import { combineReducers } from 'redux';

import customerReducer from './customer';
import errorsReducer from './errors';

const rootReducer = combineReducers({
    customer: customerReducer,
    errors: errorsReducer
});

export default rootReducer;