import React, { Component } from 'react';
import track from 'react-tracking';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';
import classNames from 'classnames/bind';
import { LOG_PAGE_EVENTS } from 'components/main/analytics/events';
import { payloadSelector, PROJECT_LOG_PAGE, PROJECT_USERDEBUG_LOG_PAGE } from 'controllers/pages';
import { MANY, NOT_FOUND } from 'common/constants/launchStatuses';
import { debugModeSelector } from 'controllers/launch';
import { HistoryLineItemContent } from './historyLineItemContent';
import styles from './historyLineItem.scss';

const cx = classNames.bind(styles);

@connect((state) => ({
  pagePayload: payloadSelector(state),
  debugMode: debugModeSelector(state),
}))
@track()
export class HistoryLineItem extends Component {
  static propTypes = {
    projectId: PropTypes.string.isRequired,
    launchNumber: PropTypes.string.isRequired,
    pathNames: PropTypes.object,
    launchId: PropTypes.number,
    id: PropTypes.number,
    status: PropTypes.string,
    active: PropTypes.bool,
    isFirstItem: PropTypes.bool,
    isLastItem: PropTypes.bool,
    pagePayload: PropTypes.object,
    debugMode: PropTypes.bool,
    tracking: PropTypes.shape({
      trackEvent: PropTypes.func,
      getTrackingData: PropTypes.func,
    }).isRequired,
  };

  static defaultProps = {
    pathNames: {},
    launchId: 0,
    id: 0,
    status: '',
    active: false,
    isFirstItem: false,
    isLastItem: false,
    debugMode: false,
    pagePayload: {},
  };

  checkIfTheLinkIsActive = () => {
    const { status, isLastItem } = this.props;

    return !(status === NOT_FOUND.toUpperCase() || status === MANY.toUpperCase() || isLastItem);
  };

  createHistoryLineItemLink = () => {
    const { id, pagePayload, pathNames, launchId, debugMode } = this.props;

    const parentIds = Object.keys(pathNames);

    return {
      type: debugMode ? PROJECT_USERDEBUG_LOG_PAGE : PROJECT_LOG_PAGE,
      payload: {
        ...pagePayload,
        testItemIds: [launchId, ...parentIds, id].join('/'),
      },
    };
  };

  render() {
    const { launchNumber, active, ...rest } = this.props;

    return (
      <div className={cx('history-line-item', { active })}>
        <Link
          className={cx('history-line-item-title', {
            'active-link': this.checkIfTheLinkIsActive(),
          })}
          to={this.checkIfTheLinkIsActive() ? this.createHistoryLineItemLink() : ''}
          onClick={() => this.props.tracking.trackEvent(LOG_PAGE_EVENTS.HISTORY_LINE_ITEM)}
        >
          <span className={cx('launch-title')}>{'launch '}</span>
          <span>#{launchNumber}</span>
        </Link>
        <HistoryLineItemContent
          active={active}
          launchNumber={launchNumber}
          hasChildren={rest.has_children}
          startTime={rest.start_time}
          endTime={rest.end_time}
          {...rest}
        />
      </div>
    );
  }
}
