import { getStorageItem, updateStorageItem } from 'common/utils';
import { userIdSelector } from 'controllers/user';
import {
  PREDEFINED_FILTER_STATE_STORAGE_KEY,
  PREDEFINED_FILTER_STATE_QUERY_KEY,
} from './constants';

const getUserSettingsFromStorage = (userId) => getStorageItem(`${userId}_settings`) || {};

export const getPredefinedFilterStateFromStorage = (userId) =>
  (getUserSettingsFromStorage(userId)[PREDEFINED_FILTER_STATE_STORAGE_KEY] || '').toString() ||
  undefined;

export const setPredefinedFilterStateToStorage = (userId, predefinedFilterCollapsed) => {
  const currentUserSettings = getUserSettingsFromStorage(userId);
  updateStorageItem(`${userId}_settings`, {
    ...currentUserSettings,
    [PREDEFINED_FILTER_STATE_STORAGE_KEY]: predefinedFilterCollapsed,
  });
};

export const getQueryConditionsFromStore = (state) => {
  const userId = userIdSelector(state);
  return {
    [PREDEFINED_FILTER_STATE_QUERY_KEY]: getPredefinedFilterStateFromStorage(userId),
  };
};
