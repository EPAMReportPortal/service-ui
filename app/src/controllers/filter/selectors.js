import { createSelector } from 'reselect';
import isEqual from 'fast-deep-equal';
import { createQueryParametersSelector, filterIdSelector } from 'controllers/pages';
import { DEFAULT_PAGINATION } from './constants';

const domainSelector = (state) => state.filters || {};

export const filtersPaginationSelector = (state) => domainSelector(state).pagination;
export const filtersSelector = (state) => domainSelector(state).filters;
export const loadingSelector = (state) => domainSelector(state).loading || false;
export const querySelector = createQueryParametersSelector({
  defaultPagination: DEFAULT_PAGINATION,
  defaultSorting: 'name',
});
export const launchFiltersSelector = (state) => domainSelector(state).launchesFilters || [];
export const activeFilterSelector = createSelector(
  launchFiltersSelector,
  filterIdSelector,
  (filters, filterId) => filters.find((filter) => filter.id === filterId),
);
export const launchFiltersLoadedSelector = (state) => domainSelector(state).launchFiltersLoaded;
export const savedLaunchesFiltersSelector = (state) => domainSelector(state).savedLaunchesFilters;
export const unsavedFilterIdsSelector = createSelector(
  launchFiltersSelector,
  savedLaunchesFiltersSelector,
  (filters, savedFilters) =>
    filters
      .map((filter) => {
        const savedFilter = savedFilters.find((item) => item.id === filter.id);
        return !isEqual(filter, savedFilter) ? savedFilter.id : null;
      })
      .filter(Boolean),
);
