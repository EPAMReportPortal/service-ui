import { NOT_FOUND } from 'redux-first-router';

// undefined page
export const NO_PAGE = undefined;
// admin
export const ADMINISTRATE_PAGE = 'ADMINISTRATE_PAGE';
export const PROJECTS_PAGE = 'PROJECTS_PAGE';
export const PROJECT_DETAILS_PAGE = 'PROJECT_DETAILS_PAGE';
export const ALL_USERS_PAGE = 'ALL_USERS_PAGE';
export const SERVER_SETTINGS_PAGE = 'SERVER_SETTINGS_PAGE';
export const SERVER_SETTINGS_TAB_PAGE = 'SERVER_SETTINGS_TAB_PAGE';
export const PLUGINS_PAGE = 'PLUGINS_PAGE';
export const PLUGINS_TAB_PAGE = 'PLUGINS_TAB_PAGE';
// inside
export const API_PAGE = 'API_PAGE';
export const PROJECT_PAGE = 'PROJECT_PAGE';
export const PROJECT_DASHBOARD_PAGE = 'PROJECT_DASHBOARD_PAGE';
export const PROJECT_DASHBOARD_ITEM_PAGE = 'PROJECT_DASHBOARD_ITEM_PAGE';
export const PROJECT_FILTERS_PAGE = 'PROJECT_FILTERS_PAGE';
export const PROJECT_LAUNCHES_PAGE = 'PROJECT_LAUNCHES_PAGE';
export const PROJECT_MEMBERS_PAGE = 'PROJECT_MEMBERS_PAGE';
export const PROJECT_SANDBOX_PAGE = 'PROJECT_SANDBOX_PAGE';
export const PROJECT_SETTINGS_PAGE = 'PROJECT_SETTINGS_PAGE';
export const PROJECT_SETTINGS_TAB_PAGE = 'PROJECT_SETTINGS_TAB_PAGE';
export const PROJECT_USERDEBUG_PAGE = 'PROJECT_USERDEBUG_PAGE';
export const PROJECT_USERDEBUG_TEST_ITEM_PAGE = 'PROJECT_USERDEBUG_TEST_ITEM_PAGE';
export const PROJECT_LOG_PAGE = 'PROJECT_LOG_PAGE';
export const PROJECT_USERDEBUG_LOG_PAGE = 'PROJECT_USERDEBUG_LOG_PAGE';
export const USER_PROFILE_PAGE = 'USER_PROFILE_PAGE';
export const HISTORY_PAGE = 'HISTORY_PAGE';
export const TEST_ITEM_PAGE = 'TEST_ITEM_PAGE';
export const LAUNCHES_PAGE = 'LAUNCHES_PAGE';
export const OAUTH_SUCCESS = 'OAUTH_SUCCESS';
export const TEST_ITEM_LOG_PAGE = 'TEST_ITEM_LOG_PAGE';
export const PROJECT_USERDEBUG_TEST_ITEM_LOG_PAGE = 'PROJECT_USERDEBUG_TEST_ITEM_LOG_PAGE';
// outside
export const LOGIN_PAGE = 'LOGIN_PAGE';
export const REGISTRATION_PAGE = 'REGISTRATION_PAGE';
export const HOME_PAGE = 'HOME_PAGE';

export const pageNames = {
  [NOT_FOUND]: NOT_FOUND,
  ADMINISTRATE_PAGE,
  PROJECTS_PAGE,
  PROJECT_DETAILS_PAGE,
  ALL_USERS_PAGE,
  SERVER_SETTINGS_PAGE,
  SERVER_SETTINGS_TAB_PAGE,
  PLUGINS_PAGE,
  PLUGINS_TAB_PAGE,
  API_PAGE,
  PROJECT_DASHBOARD_PAGE,
  PROJECT_DASHBOARD_ITEM_PAGE,
  PROJECT_FILTERS_PAGE,
  LAUNCHES_PAGE,
  PROJECT_LAUNCHES_PAGE,
  PROJECT_MEMBERS_PAGE,
  PROJECT_SANDBOX_PAGE,
  PROJECT_SETTINGS_PAGE,
  PROJECT_SETTINGS_TAB_PAGE,
  PROJECT_USERDEBUG_PAGE,
  PROJECT_USERDEBUG_TEST_ITEM_PAGE,
  USER_PROFILE_PAGE,
  LOGIN_PAGE,
  REGISTRATION_PAGE,
  TEST_ITEM_PAGE,
  HISTORY_PAGE,
  PROJECT_LOG_PAGE,
  PROJECT_USERDEBUG_LOG_PAGE,
  OAUTH_SUCCESS,
  TEST_ITEM_LOG_PAGE,
  PROJECT_USERDEBUG_TEST_ITEM_LOG_PAGE,
};

export const adminPageNames = {
  [ADMINISTRATE_PAGE]: ADMINISTRATE_PAGE,
  [PROJECTS_PAGE]: PROJECTS_PAGE,
  [PROJECT_DETAILS_PAGE]: PROJECT_DETAILS_PAGE,
  [ALL_USERS_PAGE]: ALL_USERS_PAGE,
  [SERVER_SETTINGS_PAGE]: SERVER_SETTINGS_PAGE,
  [SERVER_SETTINGS_TAB_PAGE]: SERVER_SETTINGS_TAB_PAGE,
  [PLUGINS_PAGE]: PLUGINS_PAGE,
  [PLUGINS_TAB_PAGE]: PLUGINS_TAB_PAGE,
};
