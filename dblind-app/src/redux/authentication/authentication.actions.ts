import { AuthenticationActionTypes } from './authentication.types';

export const signInStart = (credential: any) => ({
  type: AuthenticationActionTypes.SIGN_IN_START,
  payload: credential
});

export const signInSuccess = (data: any) => ({
  type: AuthenticationActionTypes.SIGN_IN_SUCCESS,
  payload: data
});

export const signInFailure = (data: any) => ({
  type: AuthenticationActionTypes.SIGN_IN_FAILURE,
  payload: data
});

export const setInvalid = () => ({
  type: AuthenticationActionTypes.SET_INVALID
});

export const signOut = () => ({
  type: AuthenticationActionTypes.SIGN_OUT
});
