import TransactionActionTypes from './transaction.types';

export const fetchTransactionsStart = () => ({
  type: TransactionActionTypes.FETCH_TRANSACTIONS_START
});

export const fetchTransactionsSuccess = (data: any) => ({
  type: TransactionActionTypes.FETCH_TRANSACTION_SUCCESS,
  payload: data
});

export const fetchTransactionsFailure = (error: any) => ({
  type: TransactionActionTypes.FETCH_TRANSACTION_FAILURE,
  payload: error
});
