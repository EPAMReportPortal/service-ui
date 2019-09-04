import { formatSortingString, SORTING_ASC } from 'controllers/sorting';
import {
  LEVEL_SUITE,
  LEVEL_TEST,
  LEVEL_STORY,
  LEVEL_SCENARIO,
} from 'common/constants/launchLevels';

export const SET_LEVEL = 'setLevel';
export const FETCH_TEST_ITEMS = 'fetchTestItems';
export const FETCH_TEST_ITEMS_LOG_PAGE = 'fetchTestItemsFromLogPage';
export const RESTORE_PATH = 'restorePath';
export const NAMESPACE = 'testItem';
export const PARENT_ITEMS_NAMESPACE = `${NAMESPACE}/parentItems`;
export const SET_PAGE_LOADING = `${NAMESPACE}/setPageLoading`;
export const DEFAULT_SORTING = formatSortingString(['startTime'], SORTING_ASC);
export const LIST_VIEW = 'LIST_VIEW';
export const LOG_VIEW = 'LOG_VIEW';
export const PREDEFINED_FILTER_STATE_STORAGE_KEY = 'predefinedFilterCollapsed';
export const PREDEFINED_FILTER_STATE_QUERY_KEY = 'predefinedFilter.collapsed';

export const TEST_ITEM_TYPES_MAP = {
  [LEVEL_SUITE]: LEVEL_SUITE,
  [LEVEL_STORY]: LEVEL_SUITE,
  [LEVEL_TEST]: LEVEL_TEST,
  [LEVEL_SCENARIO]: LEVEL_TEST,
};
