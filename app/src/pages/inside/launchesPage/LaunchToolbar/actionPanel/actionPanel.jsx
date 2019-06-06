import React, { Component } from 'react';
import track from 'react-tracking';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { defineMessages, FormattedMessage, injectIntl, intlShape } from 'react-intl';
import classNames from 'classnames/bind';
import { GhostButton } from 'components/buttons/ghostButton';
import { GhostMenuButton } from 'components/buttons/ghostMenuButton';
import { Breadcrumbs, breadcrumbDescriptorShape } from 'components/main/breadcrumbs';
import { breadcrumbsSelector, restorePathAction } from 'controllers/testItem';
import { LAUNCHES_PAGE_EVENTS } from 'components/main/analytics/events';
import AddWidgetIcon from 'common/img/add-widget-inline.svg';
import ImportIcon from './img/import-inline.svg';
import RefreshIcon from './img/refresh-inline.svg';
import styles from './actionPanel.scss';

const cx = classNames.bind(styles);
const messages = defineMessages({
  actionsBtn: {
    id: 'ActionPanel.actionsBtn',
    defaultMessage: 'Actions',
  },
  actionMerge: {
    id: 'ActionPanel.actionMerge',
    defaultMessage: 'Merge',
  },
  actionCompare: {
    id: 'ActionPanel.actionCompare',
    defaultMessage: 'Compare',
  },
  actionMoveToDebug: {
    id: 'ActionPanel.actionMoveToDebug',
    defaultMessage: 'Move to debug',
  },
  actionMoveToAll: {
    id: 'ActionPanel.actionMoveToAll',
    defaultMessage: 'Move to all launches',
  },
  actionForceFinish: {
    id: 'ActionPanel.actionForceFinish',
    defaultMessage: 'Force finish',
  },
  actionDelete: {
    id: 'ActionPanel.actionDelete',
    defaultMessage: 'Delete',
  },
  proceedButton: {
    id: 'ActionPanel.proceedButton',
    defaultMessage: 'Proceed Valid Items',
  },
  actionsBtnTooltip: {
    id: 'ActionPanel.actionsBtnTooltip',
    defaultMessage: ' Select several items to processing',
  },
});

@connect(
  (state) => ({
    breadcrumbs: breadcrumbsSelector(state),
  }),
  {
    restorePath: restorePathAction,
  },
)
@injectIntl
@track()
export class ActionPanel extends Component {
  static propTypes = {
    debugMode: PropTypes.bool,
    onRefresh: PropTypes.func,
    selectedLaunches: PropTypes.array,
    hasErrors: PropTypes.bool,
    showBreadcrumb: PropTypes.bool,
    intl: intlShape.isRequired,
    onImportLaunch: PropTypes.func,
    hasValidItems: PropTypes.bool,
    onProceedValidItems: PropTypes.func,
    onMerge: PropTypes.func,
    onCompare: PropTypes.func,
    onMove: PropTypes.func,
    onForceFinish: PropTypes.func,
    onDelete: PropTypes.func,
    breadcrumbs: PropTypes.arrayOf(breadcrumbDescriptorShape),
    restorePath: PropTypes.func,
    tracking: PropTypes.shape({
      trackEvent: PropTypes.func,
      getTrackingData: PropTypes.func,
    }).isRequired,
    activeFilterId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onAddNewWidget: PropTypes.func,
    counter: PropTypes.number,
  };

  static defaultProps = {
    debugMode: false,
    onRefresh: () => {},
    selectedLaunches: [],
    hasErrors: false,
    showBreadcrumb: false,
    onImportLaunch: () => {},
    hasValidItems: false,
    onProceedValidItems: () => {},
    onMerge: () => {},
    onCompare: () => {},
    onMove: () => {},
    onForceFinish: () => {},
    onDelete: () => {},
    breadcrumbs: [],
    restorePath: () => {},
    activeFilterId: null,
    onAddNewWidget: () => {},
    counter: null,
  };

  constructor(props) {
    super(props);
    this.actionDescriptors = this.createActionDescriptors();
  }

  onClickActionButton = () => {
    this.props.tracking.trackEvent(LAUNCHES_PAGE_EVENTS.CLICK_ACTIONS_BTN);
  };

  createActionDescriptors = () => [
    {
      label: this.props.intl.formatMessage(messages.actionMerge),
      value: 'action-merge',
      hidden: this.props.debugMode,
      onClick: this.props.onMerge,
    },
    {
      label: this.props.intl.formatMessage(messages.actionCompare),
      value: 'action-compare',
      hidden: this.props.debugMode,
      onClick: this.props.onCompare,
    },
    {
      label: this.props.intl.formatMessage(messages.actionMoveToDebug),
      value: 'action-move-to-debug',
      hidden: this.props.debugMode,
      onClick: this.props.onMove,
    },
    {
      label: this.props.intl.formatMessage(messages.actionMoveToAll),
      value: 'action-move-to-all',
      hidden: !this.props.debugMode,
      onClick: this.props.onMove,
    },
    {
      label: this.props.intl.formatMessage(messages.actionForceFinish),
      value: 'action-force-finish',
      onClick: this.props.onForceFinish,
    },
    {
      label: this.props.intl.formatMessage(messages.actionDelete),
      value: 'action-delete',
      onClick: this.props.onDelete,
    },
  ];

  isShowImportButton = () => {
    const { debugMode, activeFilterId } = this.props;
    return !debugMode && !Number.isInteger(activeFilterId);
  };

  isShowWidgetButton = () => {
    const { activeFilterId } = this.props;
    return Number.isInteger(activeFilterId);
  };

  renderCounterNotification = (number) => <span className={cx('counter')}>{number}</span>;

  render() {
    const {
      intl,
      showBreadcrumb,
      onRefresh,
      hasErrors,
      selectedLaunches,
      hasValidItems,
      onProceedValidItems,
      onImportLaunch,
      breadcrumbs,
      restorePath,
      onAddNewWidget,
      counter,
    } = this.props;

    return (
      <div className={cx('action-panel', { 'right-buttons-only': !showBreadcrumb && !hasErrors })}>
        {showBreadcrumb && <Breadcrumbs descriptors={breadcrumbs} onRestorePath={restorePath} />}
        {hasErrors && (
          <GhostButton disabled={!hasValidItems} onClick={onProceedValidItems}>
            {intl.formatMessage(messages.proceedButton)}
          </GhostButton>
        )}
        <div className={cx('action-buttons')}>
          {this.isShowImportButton() && (
            <div className={cx('action-button', 'mobile-hidden')}>
              <GhostButton icon={ImportIcon} onClick={onImportLaunch}>
                <FormattedMessage id="LaunchesPage.import" defaultMessage="Import" />
              </GhostButton>
            </div>
          )}
          {this.isShowWidgetButton() && (
            <div className={cx('action-button', 'mobile-hidden')}>
              <GhostButton icon={AddWidgetIcon} onClick={onAddNewWidget}>
                <FormattedMessage id="LaunchesPage.addNewWidget" defaultMessage="Add new widget" />
              </GhostButton>
            </div>
          )}
          <div className={cx('action-button', 'mobile-hidden')}>
            <GhostMenuButton
              tooltip={
                !selectedLaunches.length ? intl.formatMessage(messages.actionsBtnTooltip) : null
              }
              title={intl.formatMessage(messages.actionsBtn)}
              items={this.actionDescriptors}
              disabled={!selectedLaunches.length}
              onClick={this.onClickActionButton}
            />
          </div>
          <div className={cx('action-button')}>
            <GhostButton
              disabled={!!selectedLaunches.length}
              icon={RefreshIcon}
              onClick={onRefresh}
            >
              <FormattedMessage id="LaunchesPage.refresh" defaultMessage="Refresh" />
              {counter && this.renderCounterNotification(counter)}
            </GhostButton>
          </div>
        </div>
      </div>
    );
  }
}
