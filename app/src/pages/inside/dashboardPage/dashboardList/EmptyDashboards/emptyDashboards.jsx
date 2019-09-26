import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { injectIntl, defineMessages, intlShape } from 'react-intl';
import { GhostButton } from 'components/buttons/ghostButton';
import { NoResultsForFilter } from 'pages/inside/common/noResultsForFilter';
import styles from './emptyDashboards.scss';
import AddDashboardIcon from './img/ic-add-dash-inline.svg';

const cx = classNames.bind(styles);
const messages = defineMessages({
  currentUserDashboardsHeadline: {
    id: 'DashboardEmptyResults.currentUserDashboardsHeadline',
    defaultMessage: 'You have no dashboards',
  },
  currentUserDashboardsText: {
    id: 'DashboardEmptyResults.currentUserDashboardsText',
    defaultMessage: 'Add your first dashboard to analyse statistics',
  },
  currentUserDashboardsActionText: {
    id: 'DashboardEmptyResults.currentUserDashboardsActionText',
    defaultMessage: 'Add New Dashboard',
  },
  sharedDashboardsHeadline: {
    id: 'DashboardEmptyResults.sharedDashboardsHeadline',
    defaultMessage: 'No dashboards are shared',
  },
  noDashboardFound: {
    id: 'DashboardEmptyResults.noDashboardFound',
    defaultMessage: "No dashboards found for '{filter}'",
  },
});

@injectIntl
export class EmptyDashboards extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    action: PropTypes.func,
    userDashboards: PropTypes.bool,
    filter: PropTypes.string,
  };

  static defaultProps = {
    action: () => {},
    userDashboards: false,
    filter: '',
  };

  render() {
    const { userDashboards, action, intl, filter } = this.props;

    if (filter)
      return <NoResultsForFilter filter={filter} notFoundMessage={messages.noDashboardFound} />;

    return (
      <div className={cx('empty-dashboards')}>
        {userDashboards ? (
          <Fragment>
            <div className={cx('empty-dashboard--shared')} />
            <p className={cx('empty-dashboard-headline')}>
              {intl.formatMessage(messages.currentUserDashboardsHeadline)}
            </p>
          </Fragment>
        ) : (
          <Fragment>
            <div className={cx('empty-dashboard--current-user')} />
            <p className={cx('empty-dashboard-headline')}>
              {intl.formatMessage(messages.sharedDashboardsHeadline)}
            </p>
          </Fragment>
        )}
        {userDashboards && (
          <Fragment>
            <p className={cx('empty-dashboard-text')}>
              {intl.formatMessage(messages.currentUserDashboardsText)}
            </p>
            <div className={cx('empty-dashboard-content')}>
              <GhostButton icon={AddDashboardIcon} onClick={action}>
                {intl.formatMessage(messages.currentUserDashboardsActionText)}
              </GhostButton>
            </div>
          </Fragment>
        )}
      </div>
    );
  }
}
