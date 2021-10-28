import { createSelector } from 'reselect';

const selectHome = (state: any) => state.home;

export const selectBlocks = createSelector([selectHome], (home) => (home.blocks ? home.blocks : []));
