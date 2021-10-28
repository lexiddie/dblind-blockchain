import ActivityActionTypes from './activity.types';

const INITIAL_STATE = {
  activities: null,
  isFetching: false,
  errorMessage: undefined
};

const activityReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case ActivityActionTypes.FETCH_ACTIVITIES_START:
      return {
        ...state,
        isFetching: true
      };
    case ActivityActionTypes.FETCH_ACTIVITIES_SUCCESS:
      return {
        ...state,
        activities: action.payload,
        isFetching: false
      };
    case ActivityActionTypes.FETCH_ACTIVITIES_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.payload
      };
    default:
      return state;
  }
};

export default activityReducer;
