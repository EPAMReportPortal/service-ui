import { takeEvery, put, call, all, select, take } from 'redux-saga/effects';
import { URLS } from 'common/urls';
import { SAUCE_LABS } from 'common/constants/integrationNames';
import { availableIntegrationsByPluginNameSelector } from 'controllers/plugins';
import { activeProjectSelector } from 'controllers/user';
import { fetchDataAction, createFetchPredicate } from 'controllers/fetch';
import {
  EXECUTE_SAUCE_LABS_COMMAND_ACTION,
  BULK_EXECUTE_SAUCE_LABS_COMMAND_ACTION,
  SAUCE_LABS_COMMANDS_NAMESPACES_MAP,
} from './constants';
import { generateAuthToken } from './utils';
import { setAuthTokenAction, updateLoadingAction } from './actionCreators';

function* executeSauceLabsCommand({ payload: { command, integrationId, data = {} } }) {
  const activeProject = yield select(activeProjectSelector);

  yield put(
    fetchDataAction(SAUCE_LABS_COMMANDS_NAMESPACES_MAP[command])(
      URLS.projectIntegrationByIdCommand(activeProject, integrationId, command),
      { data, method: 'put' },
    ),
  );
}

function* bulkExecuteSauceLabsCommands({ payload: { commands, data } }) {
  const activeIntegration = (yield select((state) =>
    availableIntegrationsByPluginNameSelector(state, SAUCE_LABS),
  ))[0];

  const { integrationParameters: { username, accessToken } = {}, id } = activeIntegration;
  const authToken = generateAuthToken(username, accessToken, data.jobId);
  yield put(updateLoadingAction(true));
  yield put(setAuthTokenAction(authToken));

  const commandsSagas = commands.reduce(
    (acc, command) => [
      ...acc,
      call(executeSauceLabsCommand, { payload: { command, integrationId: id, data } }),
      take(createFetchPredicate(SAUCE_LABS_COMMANDS_NAMESPACES_MAP[command])),
    ],
    [],
  );
  yield all(commandsSagas);
  yield put(updateLoadingAction(false));
}

function* watchExecuteSauceLabsCommand() {
  yield takeEvery(EXECUTE_SAUCE_LABS_COMMAND_ACTION, executeSauceLabsCommand);
}

function* watchBulkExecuteSauceLabsCommand() {
  yield takeEvery(BULK_EXECUTE_SAUCE_LABS_COMMAND_ACTION, bulkExecuteSauceLabsCommands);
}

export function* sauceLabsSagas() {
  yield all([watchExecuteSauceLabsCommand(), watchBulkExecuteSauceLabsCommand()]);
}
