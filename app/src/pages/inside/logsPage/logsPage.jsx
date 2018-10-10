import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { PageLayout, PageSection } from 'layouts/pageLayout';
import {
  refreshLogPageData,
  logItemsSelector,
  logPaginationSelector,
  loadingSelector,
  NAMESPACE,
} from 'controllers/log';
import { withFilter } from 'controllers/filter';
import { withPagination } from 'controllers/pagination';
import { withSorting, SORTING_ASC } from 'controllers/sorting';
import { PaginationToolbar } from 'components/main/paginationToolbar';
import { LogToolbar } from './logToolbar';
import { HistoryLine } from './historyLine';
import { LogItemInfo } from './logItemInfo';
import { LogsGrid } from './logsGrid/logsGrid';

@connect(
  (state) => ({
    logItems: logItemsSelector(state),
    loading: loadingSelector(state),
  }),
  {
    refresh: refreshLogPageData,
  },
)
@withSorting({
  defaultSortingColumn: 'time',
  defaultSortingDirection: SORTING_ASC,
})
@withFilter({
  filterKey: 'filter.cnt.message',
  namespace: NAMESPACE,
})
@withPagination({
  paginationSelector: logPaginationSelector,
  namespace: NAMESPACE,
})
export class LogsPage extends Component {
  static propTypes = {
    refresh: PropTypes.func.isRequired,
    logItems: PropTypes.array,
    activePage: PropTypes.number,
    itemCount: PropTypes.number,
    pageCount: PropTypes.number,
    pageSize: PropTypes.number,
    onChangePage: PropTypes.func,
    onChangePageSize: PropTypes.func,
    loading: PropTypes.bool,
    filter: PropTypes.string,
    onFilterChange: PropTypes.func,
    sortingColumn: PropTypes.string,
    sortingDirection: PropTypes.string,
    onChangeSorting: PropTypes.func,
  };

  static defaultProps = {
    logItems: [],
    activePage: 1,
    itemCount: 0,
    pageCount: 0,
    pageSize: 20,
    onChangePage: () => {},
    onChangePageSize: () => {},
    loading: false,
    filter: '',
    onFilterChange: () => {},
    sortingColumn: '',
    sortingDirection: '',
    onChangeSorting: () => {},
  };

  render() {
    const {
      refresh,
      logItems,
      activePage,
      itemCount,
      pageCount,
      pageSize,
      onChangePage,
      onChangePageSize,
      loading,
      filter,
      onFilterChange,
      sortingColumn,
      sortingDirection,
      onChangeSorting,
    } = this.props;

    return (
      <PageLayout>
        <PageSection>
          <LogToolbar onRefresh={refresh} />
          <HistoryLine />
          <LogItemInfo fetchFunc={refresh} />
          <LogsGrid
            logItems={logItems}
            loading={loading}
            filter={filter}
            onFilterChange={onFilterChange}
            sortingColumn={sortingColumn}
            sortingDirection={sortingDirection}
            onChangeSorting={onChangeSorting}
          />
          {logItems &&
            !!logItems.length && (
              <PaginationToolbar
                activePage={activePage}
                itemCount={itemCount}
                pageCount={pageCount}
                pageSize={pageSize}
                onChangePage={onChangePage}
                onChangePageSize={onChangePageSize}
              />
            )}
        </PageSection>
      </PageLayout>
    );
  }
}
