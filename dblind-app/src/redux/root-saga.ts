import { all, call } from 'redux-saga/effects';

import { authenticationSagas } from './authentication/authentication.sagas';
import { homeSagas } from './home/home.sagas';
import { transactionSagas } from './transaction/transaction.sagas';
import { activitySagas } from './activity/activity.sagas';

export default function* rootSaga() {
  yield all([call(homeSagas), call(authenticationSagas), call(transactionSagas), call(activitySagas)]);
}
