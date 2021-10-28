import { takeLatest, call, put, all } from 'redux-saga/effects';
import { fetchActivitiesSuccess, fetchActivitiesFailure } from './activity.actions';
import ActivityActionTypes from './activity.types';
import { fetchActivities } from './activity.services';

export function* fetchActivitiesAsync() {
  try {
    const activities = yield fetchActivities();
    yield put(fetchActivitiesSuccess(activities));
  } catch (err) {
    yield put(fetchActivitiesFailure(err));
  }
}

export function* fetchActivitiesStart() {
  yield takeLatest(ActivityActionTypes.FETCH_ACTIVITIES_START, fetchActivitiesAsync);
}

export function* activitySagas() {
  yield all([call(fetchActivitiesStart)]);
}
