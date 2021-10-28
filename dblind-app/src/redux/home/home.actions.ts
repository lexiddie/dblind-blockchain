import HomeActionTypes from './home.types';

export const fetchBlocksStart = () => ({
  type: HomeActionTypes.FETCH_BLOCKS_START
});

export const fetchBlocksSuccess = (blocks: any) => ({
  type: HomeActionTypes.FETCH_BLOCKS_SUCCESS,
  payload: blocks
});

export const fetchBlocksFailure = (errorMessage: any) => ({
  type: HomeActionTypes.FETCH_BLOCKS_FAILURE,
  payload: errorMessage
});
