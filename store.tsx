import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { applyMiddleware, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import { middleWareDispatch } from './redux-store/middleware';
import { rootReducer } from './redux-store/reducers/index';

export const history = createBrowserHistory();

const persistConfig = {
  key: 'wa-user',
  storage,
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer(connectRouter(history)));

export const store = createStore(
  persistedReducer,
  applyMiddleware(thunk, middleWareDispatch, routerMiddleware(history))
);
// history.listen(() => {
//     document.getElementById('db-content-right')?.scrollTo(0,0);
// })
export const persistor = persistStore(store);
export default store;
