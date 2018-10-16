import { createSelector } from 'reselect';
import {
  testItemIdsArraySelector,
  createQueryParametersSelector,
  pagePropertiesSelector,
  filterIdSelector,
  TEST_ITEM_PAGE,
  PROJECT_LAUNCHES_PAGE,
  PROJECT_USERDEBUG_TEST_ITEM_PAGE,
  PROJECT_USERDEBUG_PAGE,
  payloadSelector,
  testItemIdsSelector,
} from 'controllers/pages';
import { activeProjectSelector } from 'controllers/user';
import {
  copyQuery,
  extractNamespacedQuery,
  createNamespacedQuery,
} from 'common/utils/routingUtils';
import { LEVEL_SUITE, LEVEL_TEST, LEVEL_STEP } from 'common/constants/launchLevels';
import { suitesSelector } from 'controllers/suite';
import { testsSelector } from 'controllers/test';
import { stepsSelector } from 'controllers/step';
import { NAMESPACE as LAUNCH_NAMESPACE, debugModeSelector } from 'controllers/launch';
import { DEFAULT_SORTING } from './constants';
import { createLink, getQueryNamespace, getDefectsString, getNextPage } from './utils';

const domainSelector = (state) => state.testItem || {};

export const levelSelector = (state) => domainSelector(state).level;
export const loadingSelector = (state) => domainSelector(state).loading;
export const pageLoadingSelector = (state) => domainSelector(state).pageLoading;
export const namespaceSelector = (state) =>
  getQueryNamespace(testItemIdsArraySelector(state).length - 1);
export const queryParametersSelector = createQueryParametersSelector({
  defaultSorting: DEFAULT_SORTING,
});
export const parentItemsSelector = (state) => domainSelector(state).parentItems || [];
export const parentItemSelector = (state) => {
  const parentItems = parentItemsSelector(state);
  return parentItems[parentItems.length - 1];
};
export const launchSelector = (state) => parentItemsSelector(state)[0] || {};
export const isLostLaunchSelector = (state) =>
  parentItemsSelector(state).length > 1 && !!launchSelector(state);

const isListView = (query, namespace) => {
  const namespacedQuery = extractNamespacedQuery(query, namespace);
  return namespacedQuery && 'filter.eq.has_children' in namespacedQuery;
};

export const itemsSelector = (state) => {
  switch (levelSelector(state)) {
    case LEVEL_SUITE:
      return suitesSelector(state);
    case LEVEL_TEST:
      return testsSelector(state);
    case LEVEL_STEP:
      return stepsSelector(state);
    default:
      return [];
  }
};

export const isListViewSelector = (state, namespace) =>
  isListView(pagePropertiesSelector(state), namespace);

const itemTitleFormatter = (item) => {
  if (item.number || item.number === 0) {
    return `${item.name} #${item.number}`;
  }
  return item.name;
};

export const breadcrumbsSelector = createSelector(
  activeProjectSelector,
  filterIdSelector,
  parentItemsSelector,
  testItemIdsArraySelector,
  pagePropertiesSelector,
  debugModeSelector,
  (projectId, filterId, parentItems, testItemIds, query, debugMode) => {
    const queryNamespacesToCopy = [LAUNCH_NAMESPACE];
    const descriptors = [
      {
        id: filterId,
        title: 'All',
        link: {
          type: debugMode ? PROJECT_USERDEBUG_PAGE : PROJECT_LAUNCHES_PAGE,
          payload: {
            projectId,
            filterId,
          },
          meta: {
            query: copyQuery(query, queryNamespacesToCopy),
          },
        },
        active: !testItemIds || testItemIds.length === 0,
      },
    ];
    if (!testItemIds || testItemIds.length === 0) {
      return descriptors;
    }
    return [
      ...descriptors,
      ...parentItems.map((item, i) => {
        if (!item) {
          return {
            id: testItemIds[i] || i,
            error: true,
            lost: i === 0 && parentItems.length > 1,
          };
        }
        queryNamespacesToCopy.push(getQueryNamespace(i));
        return {
          id: item.id,
          title: itemTitleFormatter(item),
          link: {
            type: debugMode ? PROJECT_USERDEBUG_TEST_ITEM_PAGE : TEST_ITEM_PAGE,
            payload: {
              projectId,
              filterId,
              testItemIds: testItemIds && testItemIds.slice(0, i + 1).join('/'),
            },
            meta: {
              query: {
                ...copyQuery(query, queryNamespacesToCopy),
              },
            },
          },
          active: i === parentItems.length - 1,
          listView: isListView(query, getQueryNamespace(i)),
        };
      }),
    ];
  },
);

export const nameLinkSelector = (state, ownProps) => {
  const query = pagePropertiesSelector(state);
  const payload = payloadSelector(state);
  const testItemIds = testItemIdsSelector(state);
  const isDebugMode = debugModeSelector(state);
  const level = levelSelector(state);
  return createLink(testItemIds, ownProps.itemId, payload, query, getNextPage(level, isDebugMode));
};

export const statisticsLinkSelector = (state, ownProps) => {
  const query = pagePropertiesSelector(state);
  const payload = payloadSelector(state);
  const testItemIds = testItemIdsSelector(state);
  const isDebugMode = debugModeSelector(state);
  const level = levelSelector(state);
  return createLink(
    testItemIds,
    ownProps.itemId,
    payload,
    {
      ...query,
      ...createNamespacedQuery(
        {
          'filter.eq.has_children': false,
          'filter.in.type': LEVEL_STEP,
          'filter.in.status': ownProps.statuses && ownProps.statuses.join(','),
        },
        getQueryNamespace(
          testItemIdsArraySelector(state) ? testItemIdsArraySelector(state).length : 0,
        ),
      ),
    },
    getNextPage(level, isDebugMode),
  );
};

export const defectLinkSelector = (state, ownProps) => {
  const query = pagePropertiesSelector(state);
  const payload = payloadSelector(state);
  const testItemIds = testItemIdsSelector(state);
  const isDebugMode = debugModeSelector(state);
  const level = levelSelector(state);
  let levelIndex = 0;
  if (testItemIdsArraySelector(state).length >= 0) {
    levelIndex = !ownProps.itemId
      ? testItemIdsArraySelector(state).length - 1
      : testItemIdsArraySelector(state).length;
  }

  return createLink(
    testItemIds,
    ownProps.itemId,
    payload,
    {
      ...query,
      ...createNamespacedQuery(
        {
          'filter.eq.has_children': false,
          'filter.in.type': LEVEL_STEP,
          'filter.in.issue$issue_type': getDefectsString(ownProps.defects),
        },
        getQueryNamespace(levelIndex),
      ),
    },
    getNextPage(level, isDebugMode),
  );
};
