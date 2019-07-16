import {
  PROJECT_USERDEBUG_TEST_ITEM_PAGE,
  TEST_ITEM_PAGE,
  PROJECT_LOG_PAGE,
  PROJECT_USERDEBUG_LOG_PAGE,
} from 'controllers/pages';
import * as launchLevels from 'common/constants/launchLevels';
import * as methodTypes from 'common/constants/methodTypes';
import { TEST_ITEM_TYPES_MAP } from './constants';
import { LEVELS } from './levels';

const getItemLevel = (type) => {
  const level = TEST_ITEM_TYPES_MAP[type] || type;
  if (!launchLevels[`LEVEL_${level}`] && methodTypes[level]) {
    return launchLevels.LEVEL_STEP;
  }
  return level;
};

export const calculateLevel = (data = [], previousLevel) => {
  if (data.length === 0) {
    return previousLevel || launchLevels.LEVEL_SUITE;
  }
  return data.reduce((acc, item) => {
    const itemLevel = getItemLevel(item.type);
    if (!acc) {
      return itemLevel;
    }
    const prevLevel = getItemLevel(acc);
    return LEVELS[prevLevel] && LEVELS[prevLevel].order > LEVELS[itemLevel].order
      ? itemLevel
      : prevLevel;
  }, '');
};

export const getQueryNamespace = (levelIndex) => `item${levelIndex}`;

export const getNextPage = (debugMode, hasChildren = true) => {
  if (hasChildren) {
    return debugMode ? PROJECT_USERDEBUG_TEST_ITEM_PAGE : TEST_ITEM_PAGE;
  }
  return debugMode ? PROJECT_USERDEBUG_LOG_PAGE : PROJECT_LOG_PAGE;
};

export const createLink = (testItemIds, itemId, payload, query, nextPage) => {
  let newTestItemsParam = testItemIds;
  if (itemId) {
    newTestItemsParam = testItemIds ? `${testItemIds}/${itemId}` : itemId;
  }
  return {
    type: nextPage,
    payload: {
      ...payload,
      testItemIds: newTestItemsParam,
    },
    meta: {
      query,
    },
  };
};

export const getDefectsString = (defects) =>
  defects && defects.filter((k) => k !== 'total').join(',');

export const normalizeTestItem = (testItem, defectTypesConfig = {}) => {
  if (!testItem) {
    return null;
  }
  const testItemDefects = (testItem.statistics && testItem.statistics.defects) || {};
  const defectStatistics = Object.keys(defectTypesConfig).reduce((result, key) => {
    const defectTypeName = key.toLowerCase();
    const testItemDefectType = testItemDefects[defectTypeName] || {};
    const newDefect = defectTypesConfig[key].reduce(
      (acc, defectTypeConfig) => ({
        ...acc,
        [defectTypeConfig.locator]: testItemDefectType[defectTypeConfig.locator] || 0,
      }),
      { total: testItemDefectType.total || 0 },
    );
    return { ...result, [defectTypeName]: newDefect };
  }, {});
  return {
    ...testItem,
    statistics: {
      ...(testItem.statistics || {}),
      defects: defectStatistics,
    },
  };
};

export const formatItemName = (name) => (name.length > 256 ? `${name.substr(0, 256)}...` : name);
