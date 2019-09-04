import { redirect } from 'redux-first-router';
import {
  activeProjectSelector,
  userAccountRoleSelector,
  userInfoSelector,
  setActiveProjectAction,
} from 'controllers/user';
import { fetchProjectAction } from 'controllers/project';
import {
  LOGIN_PAGE,
  REGISTRATION_PAGE,
  PROJECT_DASHBOARD_PAGE,
  PROJECT_PAGE,
  PROJECT_DASHBOARD_ITEM_PAGE,
  PROJECT_DASHBOARD_PRINT_PAGE,
  PROJECT_SETTINGS_TAB_PAGE,
  PROJECT_LOG_PAGE,
  PROJECT_USERDEBUG_LOG_PAGE,
  PROJECT_USERDEBUG_PAGE,
  HISTORY_PAGE,
  PROJECTS_PAGE,
  PROJECT_DETAILS_PAGE,
  ALL_USERS_PAGE,
  SERVER_SETTINGS_PAGE,
  SERVER_SETTINGS_TAB_PAGE,
  LAUNCHES_PAGE,
  PROJECT_LAUNCHES_PAGE,
  PLUGINS_PAGE,
  PLUGINS_TAB_PAGE,
  NOT_FOUND,
  OAUTH_SUCCESS,
  HOME_PAGE,
  pageSelector,
  adminPageNames,
} from 'controllers/pages';
import {
  GENERAL,
  DEFECT,
  DEMO_DATA,
  INTEGRATIONS,
  NOTIFICATIONS,
  ANALYSIS,
  AUTHORIZATION_CONFIGURATION,
  STATISTICS,
  PATTERN_ANALYSIS,
} from 'common/constants/settingsTabs';
import { ADMINISTRATOR } from 'common/constants/accountRoles';
import { INSTALLED, STORE } from 'common/constants/pluginsTabs';
import { SETTINGS, MEMBERS, EVENTS } from 'common/constants/projectSections';
import { isAuthorizedSelector } from 'controllers/auth';
import {
  fetchDashboardsAction,
  changeVisibilityTypeAction,
  dashboardItemsSelector,
} from 'controllers/dashboard';
import {
  fetchLaunchesAction,
  setDebugMode,
  unselectAllLaunchesAction,
  launchDistinctSelector,
} from 'controllers/launch';
import { TEST_ITEM_PAGE } from 'controllers/pages/constants';
import {
  fetchTestItemsAction,
  setLevelAction,
  setDefaultQueryParams,
  getQueryConditionsFromStore,
  namespaceSelector,
  queryParametersSelector,
} from 'controllers/testItem';
import { fetchFiltersAction } from 'controllers/filter';
import { fetchMembersAction } from 'controllers/members';
import { fetchProjectDataAction } from 'controllers/administrate';
import { fetchAllUsersAction } from 'controllers/administrate/allUsers';
import { fetchLogPageData } from 'controllers/log';
import { fetchHistoryPageInfo } from 'controllers/itemsHistory';
import { fetchProjectsAction } from 'controllers/administrate/projects';
import { startSetViewMode } from 'controllers/administrate/projects/actionCreators';
import { SIZE_KEY } from 'controllers/pagination';
import { createNamespacedQuery } from 'common/utils/routingUtils';
import { pageRendering, ANONYMOUS_ACCESS, ADMIN_ACCESS } from './constants';

const redirectRoute = (path, createNewAction, onRedirect = () => {}) => ({
  path,
  thunk: (dispatch, getState) => {
    const { location } = getState();
    const newAction = createNewAction(location.payload, getState);
    onRedirect(dispatch);
    dispatch(redirect(newAction));
  },
});

export const onBeforeRouteChange = (dispatch, getState, { action }) => {
  const {
    type: nextPageType,
    payload: { projectId: hashProject },
  } = action;
  const currentPageType = pageSelector(getState());
  const authorized = isAuthorizedSelector(getState());
  let projectId = activeProjectSelector(getState());
  const accountRole = userAccountRoleSelector(getState());
  const userInfo = userInfoSelector(getState());
  const userProjects = userInfo ? userInfo.assignedProjects : {};
  const isAdminNewPageType = !!adminPageNames[nextPageType];
  const isAdminCurrentPageType = !!adminPageNames[currentPageType];

  if (
    userProjects &&
    hashProject in userProjects &&
    (hashProject !== projectId || isAdminCurrentPageType) &&
    !isAdminNewPageType
  ) {
    dispatch(setActiveProjectAction(hashProject));
    dispatch(fetchProjectAction(hashProject));
    projectId = hashProject;
  }
  const page = pageRendering[nextPageType];
  if (page) {
    const { access } = page;
    switch (access) {
      case ANONYMOUS_ACCESS:
        if (authorized) {
          dispatch(
            redirect({
              type: PROJECT_DASHBOARD_PAGE,
              payload: {
                projectId,
              },
            }),
          );
        }
        break;
      case ADMIN_ACCESS:
        if (authorized && accountRole !== ADMINISTRATOR) {
          dispatch(redirect({ type: PROJECT_DASHBOARD_PAGE, payload: { projectId } }));
        }
        !authorized && dispatch(redirect({ type: LOGIN_PAGE }));
        break;
      default:
        !authorized && dispatch(redirect({ type: LOGIN_PAGE }));
    }
  }
};

const addDefaultParamsToTestItemURL = (dispatch, state) => {
  const namespace = namespaceSelector(state);
  const query = queryParametersSelector(state, namespace);
  const defaultParams = getQueryConditionsFromStore(state);
  const isAllDefaultSetted = !Object.keys(defaultParams).some(
    (defaultParamKey) =>
      !(defaultParamKey in query) && defaultParams[defaultParamKey] !== undefined,
  );
  if (!isAllDefaultSetted) {
    const namespaceQuery = createNamespacedQuery({ ...defaultParams, ...query }, namespace);
    const linkPayload = state.location.payload;
    dispatch(
      redirect({
        type: TEST_ITEM_PAGE,
        payload: linkPayload,
        meta: {
          query: namespaceQuery,
        },
      }),
    );
  }
};

export default {
  [HOME_PAGE]: redirectRoute('/', (payload) => ({ type: LOGIN_PAGE, payload })),

  [LOGIN_PAGE]: '/login',
  [REGISTRATION_PAGE]: '/registration',
  [OAUTH_SUCCESS]: '/authSuccess',
  [NOT_FOUND]: '/notfound',

  ADMINISTRATE_PAGE: redirectRoute('/administrate', () => ({ type: PROJECTS_PAGE })),
  USER_PROFILE_PAGE: '/user-profile',

  API_PAGE: '/api',

  [PROJECTS_PAGE]: {
    path: '/administrate/projects',
    thunk: (dispatch) => {
      dispatch(fetchProjectsAction());
      dispatch(startSetViewMode());
    },
  },
  [PROJECT_DETAILS_PAGE]: {
    path: `/administrate/projects/:projectId/:projectSection(${SETTINGS}|${MEMBERS}|${EVENTS})?/:settingsTab(${GENERAL}|${NOTIFICATIONS}|${INTEGRATIONS}|${DEFECT}|${ANALYSIS}|${PATTERN_ANALYSIS}|${DEMO_DATA})?`,
    thunk: (dispatch) => {
      dispatch(fetchProjectDataAction());
    },
  },
  [ALL_USERS_PAGE]: {
    path: '/administrate/users',
    thunk: (dispatch) => dispatch(fetchAllUsersAction()),
  },
  [SERVER_SETTINGS_PAGE]: redirectRoute('/administrate/settings', () => ({
    type: SERVER_SETTINGS_TAB_PAGE,
    payload: { settingsTab: AUTHORIZATION_CONFIGURATION },
  })),
  [SERVER_SETTINGS_TAB_PAGE]: `/administrate/settings/:settingsTab(${AUTHORIZATION_CONFIGURATION}|${STATISTICS})`,
  [PLUGINS_PAGE]: redirectRoute('/administrate/plugins', () => ({
    type: PLUGINS_TAB_PAGE,
    payload: { pluginsTab: INSTALLED },
  })),
  [PLUGINS_TAB_PAGE]: `/administrate/plugins/:pluginsTab(${INSTALLED}|${STORE})`,

  [PROJECT_PAGE]: {
    path: '/:projectId',
    thunk: (dispatch, getState) => {
      dispatch(
        redirect({
          type: PROJECT_DASHBOARD_PAGE,
          payload: {
            projectId: activeProjectSelector(getState()),
          },
        }),
      );
    },
  },
  [PROJECT_DASHBOARD_PAGE]: {
    path: '/:projectId/dashboard',
    thunk: (dispatch) => {
      dispatch(
        fetchDashboardsAction({
          [SIZE_KEY]: 300,
        }),
      );
      dispatch(changeVisibilityTypeAction());
    },
  },
  [PROJECT_DASHBOARD_ITEM_PAGE]: {
    path: '/:projectId/dashboard/:dashboardId',
    thunk: (dispatch, getState) => {
      const dashboardItems = dashboardItemsSelector(getState());
      if (dashboardItems.length === 0) {
        dispatch(fetchDashboardsAction({}));
      }
    },
  },
  [PROJECT_DASHBOARD_PRINT_PAGE]: {
    path: '/:projectId/dashboard/:dashboardId/print',
    thunk: (dispatch, getState) => {
      const dashboardItems = dashboardItemsSelector(getState());
      if (dashboardItems.length === 0) {
        dispatch(fetchDashboardsAction({}));
      }
    },
  },
  [LAUNCHES_PAGE]: redirectRoute(
    '/:projectId/launches',
    (payload, getState) => ({
      type: PROJECT_LAUNCHES_PAGE,
      payload: { ...payload, filterId: launchDistinctSelector(getState()) },
    }),
    (dispatch) => {
      dispatch(unselectAllLaunchesAction());
    },
  ),
  [PROJECT_LAUNCHES_PAGE]: {
    path: '/:projectId/launches/:filterId',
    thunk: (dispatch) => {
      dispatch(setDebugMode(false));
      dispatch(setLevelAction(''));
      dispatch(fetchLaunchesAction());
    },
  },
  [HISTORY_PAGE]: {
    path: '/:projectId/launches/:filterId/:testItemIds+/history',
    thunk: (dispatch) => {
      dispatch(fetchHistoryPageInfo());
    },
  },
  PROJECT_FILTERS_PAGE: {
    path: '/:projectId/filters',
    thunk: (dispatch) => dispatch(fetchFiltersAction()),
  },
  [PROJECT_LOG_PAGE]: {
    path: '/:projectId/launches/:filterId/:testItemIds+/log',
    thunk: (dispatch) => {
      dispatch(setDefaultQueryParams());
      dispatch(setDebugMode(false));
      dispatch(fetchLogPageData());
    },
  },
  [PROJECT_USERDEBUG_LOG_PAGE]: {
    path: '/:projectId/userdebug/:filterId/:testItemIds+/log',
    thunk: (dispatch) => {
      dispatch(setDebugMode(true));
      dispatch(fetchLogPageData());
    },
  },
  [PROJECT_USERDEBUG_PAGE]: {
    path: '/:projectId/userdebug/:filterId',
    thunk: (dispatch) => {
      dispatch(setDebugMode(true));
      dispatch(setLevelAction(''));
      dispatch(fetchLaunchesAction());
    },
  },
  PROJECT_USERDEBUG_TEST_ITEM_PAGE: {
    path: '/:projectId/userdebug/:filterId/:testItemIds+',
    thunk: (dispatch) => {
      dispatch(setDebugMode(true));
      dispatch(fetchTestItemsAction());
    },
  },
  PROJECT_MEMBERS_PAGE: {
    path: '/:projectId/members',
    thunk: (dispatch) => dispatch(fetchMembersAction()),
  },
  PROJECT_SETTINGS_PAGE: redirectRoute('/:projectId/settings', (payload) => ({
    type: PROJECT_SETTINGS_TAB_PAGE,
    payload: { ...payload, settingsTab: GENERAL },
  })),
  PROJECT_SETTINGS_TAB_PAGE: `/:projectId/settings/:settingsTab(${GENERAL}|${NOTIFICATIONS}|${INTEGRATIONS}|${DEFECT}|${ANALYSIS}|${PATTERN_ANALYSIS}|${DEMO_DATA})`,
  PROJECT_SANDBOX_PAGE: '/:projectId/sandbox',
  [TEST_ITEM_PAGE]: {
    path: '/:projectId/launches/:filterId/:testItemIds+',
    thunk: (dispatch, getState) => {
      addDefaultParamsToTestItemURL(dispatch, getState());
      dispatch(setDebugMode(false));
      dispatch(fetchTestItemsAction());
    },
  },
};
