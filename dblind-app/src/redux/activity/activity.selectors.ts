import { createSelector } from 'reselect';

const selectActivity = (state: any) => state.activity;

export const selectActivities = createSelector([selectActivity], (activity) => (activity.activities ? activity.activities : []));
