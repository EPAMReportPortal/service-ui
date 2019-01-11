import {
  FETCH_FILTERS,
  FETCH_FILTERS_CONCAT,
  CHANGE_ACTIVE_FILTER,
  UPDATE_FILTER_CONDITIONS,
  UPDATE_FILTER,
  UPDATE_FILTER_SUCCESS,
  ADD_FILTER,
  CREATE_FILTER,
  SAVE_NEW_FILTER,
  RESET_FILTER,
  REMOVE_FILTER,
  FETCH_USER_FILTERS_SUCCESS,
  REMOVE_LAUNCHES_FILTER,
} from './constants';

export const fetchFiltersAction = (params) => ({
  type: FETCH_FILTERS,
  payload: params,
});

export const fetchFiltersConcatAction = (params) => ({
  type: FETCH_FILTERS_CONCAT,
  payload: params,
});

export const fetchUserFiltersSuccessAction = (filters) => ({
  type: FETCH_USER_FILTERS_SUCCESS,
  payload: filters,
});

export const changeActiveFilterAction = (filterId) => ({
  type: CHANGE_ACTIVE_FILTER,
  payload: filterId,
});

export const updateFilterConditionsAction = (filterId, conditions) => ({
  type: UPDATE_FILTER_CONDITIONS,
  payload: {
    filterId,
    conditions,
  },
});

export const updateFilterAction = (filter) => ({
  type: UPDATE_FILTER,
  payload: filter,
});

export const resetFilterAction = (filterId) => ({
  type: RESET_FILTER,
  payload: filterId,
});

export const createFilterAction = (filter) => ({
  type: CREATE_FILTER,
  payload: filter,
});

export const removeFilterAction = (filterId) => ({
  type: REMOVE_FILTER,
  payload: filterId,
});

export const removeLaunchesFilterAction = (filterId) => ({
  type: REMOVE_LAUNCHES_FILTER,
  payload: filterId,
});

export const addFilterAction = (filter) => ({
  type: ADD_FILTER,
  payload: filter,
});

export const saveNewFilterAction = (filter) => ({
  type: SAVE_NEW_FILTER,
  payload: filter,
});

export const updateFilterSuccessAction = (filter, oldId) => ({
  type: UPDATE_FILTER_SUCCESS,
  payload: filter,
  meta: {
    oldId,
  },
});
