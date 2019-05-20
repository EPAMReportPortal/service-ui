import { fetch, setStorageItem } from 'common/utils';
import { URLS } from 'common/urls';
import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { showNotification } from 'controllers/notification';
import { NOTIFICATION_TYPES } from 'controllers/notification/constants';
import { activeProjectSelector, fetchUserAction } from 'controllers/user';
import { fetchProjectAction } from 'controllers/project';
import { fetchPluginsAction, fetchGlobalIntegrationsAction } from 'controllers/plugins';
import { fetchInfoAction } from 'controllers/appInfo';
import { authSuccessAction, resetTokenAction, setTokenAction } from './actionCreators';
import { LOGIN, LOGOUT, TOKEN_KEY, GRANT_TYPES, SET_TOKEN } from './constants';

function* handleLogout() {
  yield put(resetTokenAction());
  yield put(
    showNotification({
      messageId: 'infoLogout',
      type: NOTIFICATION_TYPES.INFO,
    }),
  );
}

function* watchLogout() {
  yield takeEvery(LOGOUT, handleLogout);
}

function* handleLogin({ payload }) {
  let result;
  try {
    result = yield call(fetch, URLS.login(GRANT_TYPES.PASSWORD, payload.login, payload.password), {
      method: 'POST',
    });
    yield put(
      showNotification({
        messageId: 'successLogin',
        type: NOTIFICATION_TYPES.SUCCESS,
      }),
    );
  } catch (e) {
    const error = (e.response && e.response.data && e.response.data.message) || e.message;
    yield put(
      showNotification({
        messageId: 'failureDefault',
        type: NOTIFICATION_TYPES.ERROR,
        values: { error },
      }),
    );
    return;
  }

  yield put(
    setTokenAction({
      type: result.token_type,
      value: result.access_token,
    }),
  );
  yield put(fetchInfoAction());
  // TODO: Change those calls after project & users actions will be refactored with sagas
  yield put.resolve(fetchUserAction());
  const projectId = yield select(activeProjectSelector);
  yield put(fetchProjectAction(projectId));
  yield put(fetchPluginsAction());
  yield put(fetchGlobalIntegrationsAction());
  yield put(authSuccessAction());
}

function* watchLogin() {
  yield takeEvery(LOGIN, handleLogin);
}

function* handleSetToken({ payload }) {
  yield call(setStorageItem, TOKEN_KEY, payload);
}

function* watchSetToken() {
  yield takeEvery(SET_TOKEN, handleSetToken);
}

export function* authSagas() {
  yield all([watchLogin(), watchLogout(), watchSetToken()]);
}
