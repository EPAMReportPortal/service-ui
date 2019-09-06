import React, { Component } from 'react';
import track from 'react-tracking';
import classNames from 'classnames/bind';
import { injectIntl, defineMessages, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import { validateSearchFilter } from 'common/utils/validation';
import { GhostButton } from 'components/buttons/ghostButton';
import GridViewDashboardIcon from 'common/img/grid-inline.svg';
import TableViewDashboardIcon from 'common/img/table-inline.svg';
import { reduxForm } from 'redux-form';
import { InputSearch } from 'components/inputs/inputSearch';
import { FieldProvider } from 'components/fields/fieldProvider';
import { DASHBOARD_PAGE_EVENTS } from 'components/main/analytics/events';
import { FieldErrorHint } from 'components/fields/fieldErrorHint';
import styles from './dashboardPageToolbar.scss';

const cx = classNames.bind(styles);
const messages = defineMessages({
  searchPlaceholder: {
    id: 'DashboardPageToolbar.searchPlaceholder',
    defaultMessage: 'Search by name',
  },
});

@track()
@reduxForm({
  form: 'searchDashboardForm',
  validate: ({ filter }) => ({
    filter: validateSearchFilter(filter) ? undefined : 'dashboardNameSearchHint',
  }),
  enableReinitialize: true,
  onChange: ({ filter }, dispatch, props) => {
    if (validateSearchFilter(filter)) {
      props.tracking.trackEvent(DASHBOARD_PAGE_EVENTS.ENTER_PARAM_FOR_SEARCH);
      props.onFilterChange(filter);
    }
  },
})
@injectIntl
export class DashboardPageToolbar extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    isSearchDisabled: PropTypes.bool,
    onGridViewToggle: PropTypes.func,
    onTableViewToggle: PropTypes.func,
    gridType: PropTypes.string,
    tracking: PropTypes.shape({
      trackEvent: PropTypes.func,
      getTrackingData: PropTypes.func,
    }).isRequired,
  };
  static defaultProps = {
    isSearchDisabled: false,
    onGridViewToggle: () => {},
    onTableViewToggle: () => {},
    gridType: '',
  };

  render() {
    const { intl, onGridViewToggle, onTableViewToggle, gridType, isSearchDisabled } = this.props;

    return (
      <div className={cx('tool-bar')}>
        <div className={cx('input')}>
          <FieldProvider name="filter">
            <FieldErrorHint>
              <InputSearch
                disabled={isSearchDisabled}
                maxLength="128"
                placeholder={intl.formatMessage(messages.searchPlaceholder)}
              />
            </FieldErrorHint>
          </FieldProvider>
        </div>
        <div className={cx('buttons', `active-${gridType}`)}>
          <GhostButton onClick={onGridViewToggle} icon={GridViewDashboardIcon} />
          <GhostButton onClick={onTableViewToggle} icon={TableViewDashboardIcon} />
        </div>
      </div>
    );
  }
}
