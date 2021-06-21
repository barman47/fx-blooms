import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
// import { persistStore } from 'redux-persist';
// import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { batchedSubscribe } from 'redux-batched-subscribe';
import rootReducer from './reducers';

const initialState = {};

const middleware = [thunk];
const enhancer = composeWithDevTools(
    applyMiddleware(...middleware),
    batchedSubscribe(notify => {
        notify()
    })
);

// Redux persist
// const persistConfig = {
//     key: 'root',
//     storage
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(rootReducer, initialState, enhancer);
// export const persistor = persistStore(store);