import { pageNames, NO_PAGE } from './constants';

export const activeDashboardIdSelector = (state) => state.location.payload.dashboardId;
export const projectIdSelector = (state) => state.location.payload.projectId;
export const launchIdSelector = (state) => state.location.payload.launchId;
export const suiteIdSelector = (state) => state.location.payload.suiteId;

export const pageSelector = (state) => pageNames[state.location.type] || NO_PAGE;

export const pagePropertiesSelector = ({ location: { query } }, mapping = undefined) => {
  if (!query) {
    return {};
  }

  if (!mapping) {
    return query;
  }

  const result = {};
  Object.keys(mapping).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(query, key)) {
      const propertyName = mapping[key];
      result[propertyName] = query[key];
    }
  });
  return result;
};

export const payloadSelector = (state) => state.location.payload;
export const testItemIdsSelector = (state) =>
  state.location.payload.testItemIds && String(state.location.payload.testItemIds);
export const testItemIdsArraySelector = (state) =>
  state.location.payload.testItemIds && String(state.location.payload.testItemIds).split('/');
