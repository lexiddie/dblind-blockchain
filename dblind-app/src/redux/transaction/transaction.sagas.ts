import { takeLatest, call, put, all } from 'redux-saga/effects';
import { fetchTransactionsSuccess, fetchTransactionsFailure } from './transaction.actions';
import TransactionActionTypes from './transaction.types';
import { fetchTransactions } from './transaction.services';

export function* fetchTransactionsAsync() {
  try {
    const transactions = yield fetchTransactions();
    yield put(fetchTransactionsSuccess(transactions));
  } catch (err) {
    yield put(fetchTransactionsFailure(err));
  }
}

export function* fetchTransactionsStart() {
  yield takeLatest(TransactionActionTypes.FETCH_TRANSACTIONS_START, fetchTransactionsAsync);
}

export function* transactionSagas() {
  yield all([call(fetchTransactionsStart)]);
}
