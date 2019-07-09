import {
  FETCH_PROJECT_SUCCESS,
  FETCH_PROJECT_PREFERENCES_SUCCESS,
  UPDATE_CONFIGURATION_ATTRIBUTES,
  UPDATE_NOTIFICATIONS_CONFIG,
  UPDATE_NOTIFICATIONS_CONFIG_SUCCESS,
  UPDATE_DEFECT_SUBTYPE,
  UPDATE_DEFECT_SUBTYPE_SUCCESS,
  ADD_DEFECT_SUBTYPE,
  ADD_DEFECT_SUBTYPE_SUCCESS,
  DELETE_DEFECT_SUBTYPE,
  DELETE_DEFECT_SUBTYPE_SUCCESS,
  REMOVE_PROJECT_INTEGRATIONS_BY_TYPE,
  REMOVE_PROJECT_INTEGRATIONS_BY_TYPE_SUCCESS,
  ADD_PROJECT_INTEGRATION,
  ADD_PROJECT_INTEGRATION_SUCCESS,
  UPDATE_PROJECT_INTEGRATION,
  UPDATE_PROJECT_INTEGRATION_SUCCESS,
  REMOVE_PROJECT_INTEGRATION,
  REMOVE_PROJECT_INTEGRATION_SUCCESS,
  ADD_PATTERN,
  ADD_PATTERN_SUCCESS,
  UPDATE_PATTERN,
  UPDATE_PATTERN_SUCCESS,
  DELETE_PATTERN,
  DELETE_PATTERN_SUCCESS,
  UPDATE_PA_STATE,
  FETCH_PROJECT,
  FETCH_PROJECT_PREFERENCES,
  FETCH_CONFIGURATION_ATTRIBUTES,
  SHOW_FILTER_ON_LAUNCHES,
  HIDE_FILTER_ON_LAUNCHES,
  UPDATE_PROJECT_FILTER_PREFERENCES,
} from './constants';

export const fetchProjectSuccessAction = (project) => ({
  type: FETCH_PROJECT_SUCCESS,
  payload: project,
});

export const fetchProjectPreferencesSuccessAction = (preferences) => ({
  type: FETCH_PROJECT_PREFERENCES_SUCCESS,
  payload: preferences,
});

export const updateConfigurationAttributesAction = (project) => ({
  type: UPDATE_CONFIGURATION_ATTRIBUTES,
  payload: project.configuration.attributes,
});

export const updateProjectNotificationsConfigAction = (config) => ({
  type: UPDATE_NOTIFICATIONS_CONFIG,
  payload: config,
});

export const updateProjectNotificationsConfigSuccessAction = (config) => ({
  type: UPDATE_NOTIFICATIONS_CONFIG_SUCCESS,
  payload: config,
});

export const updateProjectFilterPreferencesAction = (filterId, method) => ({
  type: UPDATE_PROJECT_FILTER_PREFERENCES,
  payload: { filterId, method },
});

export const showFilterOnLaunchesAction = (filter) => ({
  type: SHOW_FILTER_ON_LAUNCHES,
  payload: filter,
});

export const hideFilterOnLaunchesAction = (filter) => ({
  type: HIDE_FILTER_ON_LAUNCHES,
  payload: filter,
});

export const fetchProjectPreferencesAction = (projectId) => ({
  type: FETCH_PROJECT_PREFERENCES,
  payload: projectId,
});

export const fetchProjectAction = (projectId, isAdminAccess) => ({
  type: FETCH_PROJECT,
  payload: { projectId, isAdminAccess },
});

export const fetchConfigurationAttributesAction = (projectId) => ({
  type: FETCH_CONFIGURATION_ATTRIBUTES,
  payload: projectId,
});

export const updateProjectIntegrationAction = (data, id, callback) => ({
  type: UPDATE_PROJECT_INTEGRATION,
  payload: { data, id, callback },
});

export const updateProjectIntegrationSuccessAction = (data, id) => ({
  type: UPDATE_PROJECT_INTEGRATION_SUCCESS,
  payload: { data, id },
});

export const addProjectIntegrationAction = (data, pluginName, callback) => ({
  type: ADD_PROJECT_INTEGRATION,
  payload: { data, pluginName, callback },
});

export const addProjectIntegrationSuccessAction = (integration) => ({
  type: ADD_PROJECT_INTEGRATION_SUCCESS,
  payload: integration,
});

export const removeProjectIntegrationAction = (id, callback) => ({
  type: REMOVE_PROJECT_INTEGRATION,
  payload: { id, callback },
});

export const removeProjectIntegrationSuccessAction = (id) => ({
  type: REMOVE_PROJECT_INTEGRATION_SUCCESS,
  payload: id,
});

export const removeProjectIntegrationsByTypeAction = (instanceType) => ({
  type: REMOVE_PROJECT_INTEGRATIONS_BY_TYPE,
  payload: instanceType,
});

export const removeProjectIntegrationsByTypeSuccessAction = (instanceType) => ({
  type: REMOVE_PROJECT_INTEGRATIONS_BY_TYPE_SUCCESS,
  payload: instanceType,
});

export const updateDefectSubTypeAction = (subType) => ({
  type: UPDATE_DEFECT_SUBTYPE,
  payload: subType,
});

export const updateDefectSubTypeSuccessAction = (subType) => ({
  type: UPDATE_DEFECT_SUBTYPE_SUCCESS,
  payload: subType,
});

export const addDefectSubTypeAction = (subType) => ({
  type: ADD_DEFECT_SUBTYPE,
  payload: subType,
});

export const addDefectSubTypeSuccessAction = (subType) => ({
  type: ADD_DEFECT_SUBTYPE_SUCCESS,
  payload: subType,
});

export const deleteDefectSubTypeAction = (subType) => ({
  type: DELETE_DEFECT_SUBTYPE,
  payload: subType,
});

export const deleteDefectSubTypeSuccessAction = (subType) => ({
  type: DELETE_DEFECT_SUBTYPE_SUCCESS,
  payload: subType,
});

export const addPatternAction = (pattern) => ({
  type: ADD_PATTERN,
  payload: pattern,
});

export const addPatternSuccessAction = (pattern) => ({
  type: ADD_PATTERN_SUCCESS,
  payload: pattern,
});

export const updatePatternAction = (pattern) => ({
  type: UPDATE_PATTERN,
  payload: pattern,
});

export const updatePatternSuccessAction = (pattern) => ({
  type: UPDATE_PATTERN_SUCCESS,
  payload: pattern,
});

export const deletePatternAction = (pattern) => ({
  type: DELETE_PATTERN,
  payload: pattern,
});

export const deletePatternSuccessAction = (pattern) => ({
  type: DELETE_PATTERN_SUCCESS,
  payload: pattern,
});

export const updatePAStateAction = (PAState) => ({
  type: UPDATE_PA_STATE,
  payload: PAState,
});
