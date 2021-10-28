import { takeLatest, call, put, all } from 'redux-saga/effects';
import { fetchBlocksSuccess, fetchBlocksFailure } from './home.actions';
import { fetchBlocks } from './home.services';
import HomeActionTypes from './home.types';

export function* fetchBlocksAsync() {
  try {
    const blocks = yield fetchBlocks();
    yield put(fetchBlocksSuccess(blocks));
  } catch (err) {
    yield put(fetchBlocksFailure(err));
  }
}

export function* fetchBlocksStart() {
  yield takeLatest(HomeActionTypes.FETCH_BLOCKS_START, fetchBlocksAsync);
}

export function* homeSagas() {
  yield all([call(fetchBlocksStart)]);
}
