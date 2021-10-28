import { createSelector } from 'reselect';

const selectAuthentication = (state) => state.authentication;

export const selectAccount = createSelector([selectAuthentication], (authentication) => authentication.account);

export const selectUserId = createSelector([selectAccount], (account) => (account ? account.id : null));

export const selectIsSignIn = createSelector([selectAuthentication], (authentication) => authentication.isSignIn);

export const selectIsInvalid = createSelector([selectAuthentication], (authentication) => authentication.isInvalid);

export const selectError = createSelector([selectAuthentication], (authentication) => authentication.errorMessage);
