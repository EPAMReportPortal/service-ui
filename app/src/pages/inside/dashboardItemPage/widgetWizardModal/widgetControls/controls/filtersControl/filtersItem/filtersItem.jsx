import React, { PureComponent } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Parser from 'html-react-parser';
import PencilIcon from 'common/img/pencil-icon-inline.svg';
import { InputRadio } from 'components/inputs/inputRadio';
import { FilterOptions } from 'pages/inside/filtersPage/filterGrid/filterOptions';
import { FilterName } from 'pages/inside/filtersPage/filterGrid/filterName';
import styles from './filtersItem.scss';

const cx = classNames.bind(styles);

@injectIntl
export class FiltersItem extends PureComponent {
  static propTypes = {
    intl: intlShape,
    search: PropTypes.string,
    userId: PropTypes.string,
    activeFilterId: PropTypes.string,
    filter: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    intl: {},
    search: '',
    userId: '',
    activeFilterId: '',
    item: {},
    onChange: () => {},
    onEdit: () => {},
  };

  render() {
    const { activeFilterId, filter, search, onChange, onEdit, userId } = this.props;

    return (
      <div className={cx('filter-item')}>
        <InputRadio
          value={activeFilterId}
          ownValue={String(filter.id)}
          name={'filter-id'}
          onChange={onChange}
          circleAtTop
        >
          <FilterName search={search} filter={filter} userId={userId} showDesc={false} />
          <FilterOptions entities={filter.conditions} sort={filter.orders}>
            {userId === filter.owner && (
              <span className={cx('pencil-icon')} onClick={onEdit}>
                {Parser(PencilIcon)}
              </span>
            )}
          </FilterOptions>
        </InputRadio>
      </div>
    );
  }
}
