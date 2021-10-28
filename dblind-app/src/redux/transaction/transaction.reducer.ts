import TransactionActionTypes from './transaction.types';

const INITIAL_STATE = {
  transactions: null,
  isFetching: false,
  errorMessage: undefined
};

const TransactionReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case TransactionActionTypes.FETCH_TRANSACTIONS_START:
      return {
        ...state,
        isFetching: true
      };
    case TransactionActionTypes.FETCH_TRANSACTION_SUCCESS:
      return {
        ...state,
        transactions: action.payload,
        isFetching: false
      };
    case TransactionActionTypes.FETCH_TRANSACTION_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.payload
      };
    default:
      return state;
  }
};

export default TransactionReducer;
