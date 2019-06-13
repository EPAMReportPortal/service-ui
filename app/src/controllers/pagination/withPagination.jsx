import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { connectRouter } from 'common/utils';
import { userIdSelector } from 'controllers/user';
import { defaultPaginationSelector, totalElementsSelector, totalPagesSelector } from './selectors';
import { PAGE_KEY, SIZE_KEY } from './constants';
import { setPageSize, getStorageKey } from './storageUtils';

export const withPagination = ({
  paginationSelector = defaultPaginationSelector,
  namespace,
  namespaceSelector,
  offset,
} = {}) => (WrappedComponent) => {
  const getTotalElements = totalElementsSelector(paginationSelector);
  const getTotalPages = totalPagesSelector(paginationSelector);

  @connectRouter(
    (query) => ({
      page: query[PAGE_KEY] && Number(query[PAGE_KEY]),
      size: query[SIZE_KEY] && Number(query[SIZE_KEY]),
    }),
    {
      updatePagination: (page, size) => ({ [PAGE_KEY]: page, [SIZE_KEY]: size }),
    },
    { namespace, namespaceSelector, offset },
  )
  @connect((state) => ({
    totalElements: getTotalElements(state),
    totalPages: getTotalPages(state),
    userId: userIdSelector(state),
    currentNamespace:
      (!namespace && namespaceSelector ? namespaceSelector(state, offset) : namespace) || '',
  }))
  class PaginationWrapper extends Component {
    static displayName = `withPagination(${WrappedComponent.displayName || WrappedComponent.name})`;

    static propTypes = {
      userId: PropTypes.string.isRequired,
      currentNamespace: PropTypes.string.isRequired,
      filter: PropTypes.string,
      page: PropTypes.number,
      size: PropTypes.number,
      updatePagination: PropTypes.func,
      sortingString: PropTypes.string,
      totalElements: PropTypes.number,
      totalPages: PropTypes.number,
    };

    static defaultProps = {
      filter: null,
      page: undefined,
      size: undefined,
      sortingString: null,
      totalElements: 0,
      totalPages: 1,
      updatePagination: () => {},
    };

    componentDidUpdate() {
      const totalPages = this.props.totalPages || 1;
      if (this.props.page > totalPages) {
        this.changePaginationOptions({ page: totalPages });
      }
    }
    changePageHandler = (page) => {
      this.changePaginationOptions({ page });
    };

    changeSizeHandler = (size) => this.changePaginationOptions({ size, page: 1 });

    changePaginationOptions = (options) => {
      const { userId, currentNamespace, page, size } = this.props;
      if (options.size) setPageSize(userId, options.size, getStorageKey(currentNamespace));
      this.props.updatePagination(options.page || page, options.size || size);
    };

    render() {
      const { page, size, totalElements, totalPages, updatePagination, ...restProps } = this.props;

      return (
        <WrappedComponent
          activePage={page}
          itemCount={totalElements}
          pageCount={totalPages}
          pageSize={size}
          onChangePage={this.changePageHandler}
          onChangePageSize={this.changeSizeHandler}
          {...restProps}
        />
      );
    }
  }

  return PaginationWrapper;
};
