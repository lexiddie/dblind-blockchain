import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authenticationReducer from './authentication/authentication.reducer';
import homeReducer from './home/home.reducer';
import transactionReducer from './transaction/transaction.reducer';
import activityReducer from './activity/activity.reducer';

const persistConfig = {
  key: 'root',
  storage,
  whileList: ['authentication']
};

const rootReducer = combineReducers({
  authentication: authenticationReducer,
  home: homeReducer,
  transaction: transactionReducer,
  activity: activityReducer
});

export default persistReducer(persistConfig, rootReducer);
