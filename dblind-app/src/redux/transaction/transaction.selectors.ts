import { createSelector } from 'reselect';

const selectTransaction = (state: any) => state.transaction;

export const selectTransactions = createSelector([selectTransaction], (transaction) => (transaction.transactions ? transaction.transactions : []));
