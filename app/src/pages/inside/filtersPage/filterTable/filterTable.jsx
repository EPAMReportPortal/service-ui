import { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { PaginationToolbar } from 'components/main/paginationToolbar';
import { withPagination } from 'components/containers/pagination';
import { withFilter } from 'controllers/filter';
import { userIdSelector } from 'controllers/user';
import { FilterTableItem } from '../filterTableItem';
import { FilterTableHeader } from './filterTableHeader';
import { FilterSearch } from './filterSearch';
import styles from './filterTable.scss';

const cx = classNames.bind(styles);

@withFilter
@withPagination({
  url: activeProject => `/api/v1/${activeProject}/filter`,
})
@connect(state => ({
  userId: userIdSelector(state),
}))
export class FilterTable extends PureComponent {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    activePage: PropTypes.number,
    itemCount: PropTypes.number,
    pageCount: PropTypes.number,
    pageSize: PropTypes.number,
    onChangePage: PropTypes.func,
    onChangePageSize: PropTypes.func,
    userId: PropTypes.string,
    filter: PropTypes.string,
    onFilterChange: PropTypes.func,
  };

  static defaultProps = {
    data: [],
    activePage: 1,
    itemCount: 0,
    pageCount: 0,
    pageSize: 20,
    userId: '',
    filter: '',
    onFilterChange: () => {
    },
    onChangePage: () => {
    },
    onChangePageSize: () => {
    },
  };

  render() {
    return (
      <Fragment>
        <FilterSearch
          filter={this.props.filter}
          onFilterChange={this.props.onFilterChange}
        />
        <div className={cx('filter-table')}>
          <FilterTableHeader />
          {
            this.props.data.map(item => (
              <FilterTableItem
                key={item.id}
                name={item.name}
                description={item.description}
                owner={item.owner}
                options="(TBD)"
                shared={item.share}
                showOnLaunches={item.showOnLaunches}
                editable={item.owner === this.props.userId}
              />
            ))
          }
        </div>
        <div className={cx('filter-table-pagination')}>
          <PaginationToolbar
            activePage={this.props.activePage}
            itemCount={this.props.itemCount}
            pageCount={this.props.pageCount}
            pageSize={this.props.pageSize}
            onChangePage={this.props.onChangePage}
            onChangePageSize={this.props.onChangePageSize}
          />
        </div>
      </Fragment>
    );
  }
}
