import ActivityActionTypes from './activity.types';

export const fetchActivitiesStart = () => ({
  type: ActivityActionTypes.FETCH_ACTIVITIES_START
});

export const fetchActivitiesSuccess = (data: any) => ({
  type: ActivityActionTypes.FETCH_ACTIVITIES_SUCCESS,
  payload: data
});

export const fetchActivitiesFailure = (error: any) => ({
  type: ActivityActionTypes.FETCH_ACTIVITIES_FAILURE,
  payload: error
});
