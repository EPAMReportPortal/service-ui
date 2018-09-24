import { TRACE } from 'common/constants/logLevels';

export const NAMESPACE = 'log';
export const LOG_ITEMS_NAMESPACE = `${NAMESPACE}/logItems`;
export const ACTIVITY_NAMESPACE = `${NAMESPACE}/activity`;
export const HISTORY_NAMESPACE = `${NAMESPACE}/history`;
export const FETCH_LOG_PAGE_DATA = 'fetchLogPageData';
export const FETCH_HISTORY_ENTRIES = 'fetchHistoryEntries';
export const DEFAULT_HISTORY_DEPTH = 10;
export const DEFAULT_LOG_LEVEL = TRACE;
