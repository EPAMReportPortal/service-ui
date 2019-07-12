import { takeEvery, all, put, select, call } from 'redux-saga/effects';
import { URLS } from 'common/urls';
import { BTS_GROUP_TYPE } from 'common/constants/pluginsGroupTypes';
import {
  showNotification,
  showDefaultErrorNotification,
  NOTIFICATION_TYPES,
} from 'controllers/notification';
import { projectIdSelector } from 'controllers/pages';
import { fetchDataAction } from 'controllers/fetch';
import { hideModalAction } from 'controllers/modal';
import { showScreenLockAction, hideScreenLockAction } from 'controllers/screenLock';
import { fetch } from 'common/utils';
import {
  NAMESPACE,
  REMOVE_PROJECT_INTEGRATIONS_BY_TYPE,
  ADD_INTEGRATION,
  UPDATE_INTEGRATION,
  REMOVE_INTEGRATION,
  FETCH_PLUGINS,
  FETCH_GLOBAL_INTEGRATIONS,
} from './constants';
import {
  addProjectIntegrationSuccessAction,
  updateProjectIntegrationSuccessAction,
  removeProjectIntegrationSuccessAction,
  removeProjectIntegrationsByTypeSuccessAction,
  addGlobalIntegrationSuccessAction,
  removeGlobalIntegrationSuccessAction,
  updateGlobalIntegrationSuccessAction,
  fetchGlobalIntegrationsSuccessAction,
} from './actionCreators';

function* addIntegration({ payload: { data, isGlobal, pluginName, callback } }) {
  yield put(showScreenLockAction());
  try {
    const projectId = yield select(projectIdSelector);
    const url = isGlobal
      ? URLS.newGlobalIntegration(pluginName)
      : URLS.newProjectIntegration(projectId, pluginName);
    const response = yield call(fetch, url, {
      method: 'post',
      data,
    });
    const newIntegration = {
      ...data,
      id: response.id,
      integrationType: { name: pluginName, groupType: BTS_GROUP_TYPE },
    };
    const addIntegrationSuccessAction = isGlobal
      ? addGlobalIntegrationSuccessAction(newIntegration)
      : addProjectIntegrationSuccessAction(newIntegration);
    yield put(addIntegrationSuccessAction);
    yield put(
      showNotification({
        messageId: 'addIntegrationSuccess',
        type: NOTIFICATION_TYPES.SUCCESS,
      }),
    );
    yield put(hideModalAction());
    yield call(callback, newIntegration);
  } catch (error) {
    yield put(showDefaultErrorNotification(error));
  } finally {
    yield put(hideScreenLockAction());
  }
}

function* watchAddIntegration() {
  yield takeEvery(ADD_INTEGRATION, addIntegration);
}

function* updateIntegration({ payload: { data, isGlobal, id, callback } }) {
  yield put(showScreenLockAction());
  try {
    const projectId = yield select(projectIdSelector);
    const url = isGlobal ? URLS.globalIntegration(id) : URLS.projectIntegration(projectId, id);

    yield call(fetch, url, {
      method: 'put',
      data,
    });

    const updateIntegrationSuccessAction = isGlobal
      ? updateGlobalIntegrationSuccessAction(data, id)
      : updateProjectIntegrationSuccessAction(data, id);
    yield put(updateIntegrationSuccessAction);
    yield put(
      showNotification({
        messageId: 'updateIntegrationSuccess',
        type: NOTIFICATION_TYPES.SUCCESS,
      }),
    );
    yield call(callback);
  } catch (error) {
    yield put(showDefaultErrorNotification(error));
  } finally {
    yield put(hideScreenLockAction());
  }
}

function* watchUpdateIntegration() {
  yield takeEvery(UPDATE_INTEGRATION, updateIntegration);
}

function* removeIntegration({ payload: { id, isGlobal, callback } }) {
  yield put(showScreenLockAction());
  try {
    const projectId = yield select(projectIdSelector);
    const url = isGlobal ? URLS.globalIntegration(id) : URLS.projectIntegration(projectId, id);

    yield call(fetch, url, {
      method: 'delete',
    });

    const removeIntegrationSuccessAction = isGlobal
      ? removeGlobalIntegrationSuccessAction(id)
      : removeProjectIntegrationSuccessAction(id);
    yield put(removeIntegrationSuccessAction);
    yield put(
      showNotification({
        messageId: 'removeIntegrationSuccess',
        type: NOTIFICATION_TYPES.SUCCESS,
      }),
    );
    yield call(callback);
  } catch (error) {
    yield put(showDefaultErrorNotification(error));
  } finally {
    yield put(hideScreenLockAction());
  }
}

function* watchRemoveIntegration() {
  yield takeEvery(REMOVE_INTEGRATION, removeIntegration);
}

function* removeIntegrationsByType({ payload: instanceType }) {
  yield put(showScreenLockAction());
  try {
    const projectId = yield select(projectIdSelector);
    yield call(fetch, URLS.removeProjectIntegrationByType(projectId, instanceType), {
      method: 'delete',
    });
    yield put(removeProjectIntegrationsByTypeSuccessAction(instanceType));
    yield put(
      showNotification({
        messageId: 'resetToGlobalSuccess',
        type: NOTIFICATION_TYPES.SUCCESS,
      }),
    );
  } catch (error) {
    yield put(showDefaultErrorNotification(error));
  } finally {
    yield put(hideScreenLockAction());
  }
}

function* watchRemoveIntegrationsByType() {
  yield takeEvery(REMOVE_PROJECT_INTEGRATIONS_BY_TYPE, removeIntegrationsByType);
}

function* fetchPlugins() {
  yield put(fetchDataAction(NAMESPACE)(URLS.plugin()));
}

function* watchFetchPlugins() {
  yield takeEvery(FETCH_PLUGINS, fetchPlugins);
}

function* fetchGlobalIntegrations() {
  try {
    const globalIntegrations = yield call(fetch, URLS.globalIntegrationsByPluginName());
    yield put(fetchGlobalIntegrationsSuccessAction(globalIntegrations));
  } catch (error) {
    yield put(showDefaultErrorNotification(error));
  }
}

function* watchFetchGlobalIntegrations() {
  yield takeEvery(FETCH_GLOBAL_INTEGRATIONS, fetchGlobalIntegrations);
}

export function* pluginSagas() {
  yield all([
    watchAddIntegration(),
    watchUpdateIntegration(),
    watchRemoveIntegration(),
    watchRemoveIntegrationsByType(),
    watchFetchPlugins(),
    watchFetchGlobalIntegrations(),
  ]);
}
