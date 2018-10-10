import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { getStorageItem } from 'common/utils';
import { fetchParentItems } from 'controllers/testItem';
import { URLS } from 'common/urls';
import { activeProjectSelector } from 'controllers/user';
import { logItemIdSelector, pagePropertiesSelector } from 'controllers/pages';
import { fetchDataAction } from 'controllers/fetch';
import {
  ACTIVITY_NAMESPACE,
  DEFAULT_HISTORY_DEPTH,
  DEFAULT_LOG_LEVEL,
  FETCH_HISTORY_ENTRIES,
  FETCH_LOG_PAGE_DATA,
  HISTORY_NAMESPACE,
  LOG_ITEMS_NAMESPACE,
  LOG_LEVEL_STORAGE_KEY,
  NAMESPACE,
} from './constants';
import { activeLogIdSelector, querySelector } from './selectors';

function* fetchActivity() {
  const activeProject = yield select(activeProjectSelector);
  const activeLogItemId = yield select(activeLogIdSelector);
  yield put(
    fetchDataAction(ACTIVITY_NAMESPACE)(URLS.logItemActivity(activeProject, activeLogItemId)),
  );
}

function* fetchLogItems() {
  const activeProject = yield select(activeProjectSelector);
  const query = yield select(pagePropertiesSelector, NAMESPACE);
  const filterLevel =
    query['filter.gte.level'] || getStorageItem(LOG_LEVEL_STORAGE_KEY) || DEFAULT_LOG_LEVEL;
  const params = yield select(querySelector, NAMESPACE);
  const activeLogItemId = yield select(activeLogIdSelector);
  yield put(
    fetchDataAction(LOG_ITEMS_NAMESPACE)(
      URLS.logItems(activeProject, activeLogItemId, filterLevel),
      {
        params,
      },
    ),
  );
}

function* fetchHistoryEntries() {
  const activeProject = yield select(activeProjectSelector);
  const logItemId = yield select(logItemIdSelector);

  yield put(
    fetchDataAction(HISTORY_NAMESPACE)(
      URLS.testItemsHistory(activeProject, logItemId, DEFAULT_HISTORY_DEPTH),
    ),
  );
}

function* fetchLogPageData({ meta = {} }) {
  if (meta.refresh) {
    yield all([call(fetchLogItems), call(fetchActivity), call(fetchHistoryEntries)]);
  } else {
    yield all([
      call(fetchParentItems),
      call(fetchLogItems),
      call(fetchActivity),
      call(fetchHistoryEntries),
    ]);
  }
}

function* watchFetchLogPageData() {
  yield takeEvery(FETCH_LOG_PAGE_DATA, fetchLogPageData);
}

function* watchFetchHistoryEntries() {
  yield takeEvery(FETCH_HISTORY_ENTRIES, fetchHistoryEntries);
}

export function* logSagas() {
  yield all([watchFetchLogPageData(), watchFetchHistoryEntries()]);
}
