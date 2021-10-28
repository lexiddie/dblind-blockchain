import HomeActionTypes from './home.types';

const INITIAL_STATE = {
  blocks: null,
  isFetching: false,
  errorMessage: undefined
};

const homeReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case HomeActionTypes.FETCH_BLOCKS_START:
      return {
        ...state,
        isFetching: true
      };
    case HomeActionTypes.FETCH_BLOCKS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        blocks: action.payload
      };
    case HomeActionTypes.FETCH_BLOCKS_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.payload
      };
    default:
      return state;
  }
};

export default homeReducer;
