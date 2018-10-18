import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { columnPropTypes } from '../propTypes';
import { HeaderCell } from './headerCell';
import { CheckboxHeaderCell } from './checkboxHeaderCell';
import styles from './gridHeader.scss';

const cx = classNames.bind(styles);

export const GridHeader = ({
  columns,
  sortingColumn,
  sortingDirection,
  selectable,
  allSelected,
  onChangeSorting,
  onFilterClick,
  onToggleSelectAll,
  hideHeaderForMobile,
}) => (
  <div className={cx('grid-header', { 'mobile-hide': hideHeaderForMobile })}>
    {columns.map((column, i) => (
      <HeaderCell
        key={column.id || i}
        title={column.title}
        align={column.align}
        sortable={column.sortable}
        id={column.id}
        withFilter={column.withFilter}
        filterEventInfo={column.filterEventInfo}
        sortingDirection={sortingDirection}
        sortingActive={sortingColumn === column.id}
        onChangeSorting={onChangeSorting}
        onFilterClick={onFilterClick}
      />
    ))}
    {selectable && <CheckboxHeaderCell value={allSelected} onChange={onToggleSelectAll} />}
  </div>
);
GridHeader.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape(columnPropTypes)),
  sortingColumn: PropTypes.string,
  sortingDirection: PropTypes.string,
  selectable: PropTypes.bool,
  allSelected: PropTypes.bool,
  hideHeaderForMobile: PropTypes.bool,
  onChangeSorting: PropTypes.func,
  onFilterClick: PropTypes.func,
  onToggleSelectAll: PropTypes.func,
};
GridHeader.defaultProps = {
  columns: [],
  sortingColumn: '',
  sortingDirection: null,
  selectable: false,
  allSelected: false,
  hideHeaderForMobile: false,
  onChangeSorting: () => {},
  onFilterClick: () => {},
  onToggleSelectAll: () => {},
};
