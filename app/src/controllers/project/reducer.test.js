import { projectInfoReducer, projectPreferencesReducer } from './reducer';
import {
  PROJECT_INFO_INITIAL_STATE,
  PROJECT_PREFERENCES_INITIAL_STATE,
  FETCH_PROJECT_SUCCESS,
  UPDATE_CONFIGURATION_ATTRIBUTES,
  FETCH_PROJECT_PREFERENCES_SUCCESS,
  TOGGLE_DISPLAY_FILTER_ON_LAUNCHES,
  UPDATE_NOTIFICATIONS_CONFIG_SUCCESS,
  EMAIL_NOTIFICATION_INTEGRATION_TYPE,
} from './constants';

describe('project reducer', () => {
  describe('projectInfoReducer', () => {
    test('should return initial state', () => {
      expect(projectInfoReducer(undefined, {})).toBe(PROJECT_INFO_INITIAL_STATE);
    });

    test('should return old state on unknown action', () => {
      const oldState = { foo: 1 };
      expect(projectInfoReducer(oldState, { type: 'foo' })).toBe(oldState);
    });

    test('should handle FETCH_PROJECT_SUCCESS', () => {
      const payload = { foo: 'bar' };
      const newState = projectInfoReducer(PROJECT_INFO_INITIAL_STATE, {
        type: FETCH_PROJECT_SUCCESS,
        payload,
      });
      expect(newState).toEqual(payload);
    });

    test('should handle UPDATE_CONFIGURATION_ATTRIBUTES', () => {
      const oldState = {
        ...PROJECT_INFO_INITIAL_STATE,
        configuration: {
          ...PROJECT_INFO_INITIAL_STATE.configuration,
          attributes: {},
        },
      };
      const payload = { foo: 'bar' };
      const newState = projectInfoReducer(PROJECT_INFO_INITIAL_STATE, {
        type: UPDATE_CONFIGURATION_ATTRIBUTES,
        payload,
      });
      expect(newState).toEqual({
        ...oldState,
        configuration: {
          ...oldState.configuration,
          attributes: {
            ...oldState.configuration.attributes,
            ...payload,
          },
        },
      });
    });

    test('should handle UPDATE_NOTIFICATIONS_CONFIG_SUCCESS', () => {
      const payload = { enabled: true, rules: [] };
      const oldState = {
        integrations: [
          {
            integrationType: {
              groupType: EMAIL_NOTIFICATION_INTEGRATION_TYPE,
            },
          },
        ],
      };
      const newState = projectInfoReducer(oldState, {
        type: UPDATE_NOTIFICATIONS_CONFIG_SUCCESS,
        payload,
      });
      expect(newState).toEqual({
        integrations: [
          {
            integrationType: {
              groupType: EMAIL_NOTIFICATION_INTEGRATION_TYPE,
            },
            enabled: payload.enabled,
            integrationParameters: {
              rules: payload.rules,
            },
          },
        ],
      });
    });
  });

  describe('projectPreferencesReducer', () => {
    test('should return initial state', () => {
      expect(projectPreferencesReducer(undefined, {})).toBe(PROJECT_PREFERENCES_INITIAL_STATE);
    });

    test('should return old state on unknown action', () => {
      const oldState = { filters: ['filter1'] };
      expect(projectPreferencesReducer(oldState, { type: 'foo' })).toBe(oldState);
    });

    test('shoud handle FETCH_PROJECT_PREFERENCES_SUCCESS', () => {
      const payload = { filters: ['filter1'] };
      const newState = projectPreferencesReducer(PROJECT_INFO_INITIAL_STATE, {
        type: FETCH_PROJECT_PREFERENCES_SUCCESS,
        payload,
      });
      expect(newState).toEqual(payload);
    });

    test('should handle TOGGLE_DISPLAY_FILTER_ON_LAUNCHES', () => {
      const oldState = {
        ...PROJECT_PREFERENCES_INITIAL_STATE,
        filters: ['filter0'],
      };
      const payload = 'filter1';
      const stateWithFilter = projectPreferencesReducer(oldState, {
        type: TOGGLE_DISPLAY_FILTER_ON_LAUNCHES,
        payload,
      });
      expect(stateWithFilter).toEqual({
        ...oldState,
        filters: [...oldState.filters, payload],
      });
      const stateWithoutFilter = projectPreferencesReducer(stateWithFilter, {
        type: TOGGLE_DISPLAY_FILTER_ON_LAUNCHES,
        payload,
      });
      expect(stateWithoutFilter).toEqual(oldState);
    });
  });
});
