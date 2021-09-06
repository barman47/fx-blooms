import { applyMiddleware, createStore } from 'redux';
import { persistStore, persistReducer }  from 'redux-persist';
import storage from 'redux-persist/lib/storage/session';
import { batchedSubscribe } from 'redux-batched-subscribe';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';

const persistConfig = {
    key: 'root',
    storage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const composeEnhancers = composeWithDevTools({ trace: true, traceLimit: 25 });  // ENable tracing in devtools

const initialState = {};

const middleware = [thunk];

export const store = createStore(
    // rootReducer,
    persistedReducer,
    initialState, 
    composeEnhancers(applyMiddleware(...middleware),
        batchedSubscribe((notify) => {
            notify();
        })
    )
);

export const persistor = persistStore(store);