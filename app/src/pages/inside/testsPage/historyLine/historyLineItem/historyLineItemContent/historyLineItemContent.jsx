import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import { PASSED, FAILED, SKIPPED, MANY, NOT_FOUND, RESETED } from 'common/constants/launchStatuses';
import classNames from 'classnames/bind';
import { HistoryLineItemBadges } from './historyLineItemBadges';
import styles from './historyLineItemContent.scss';

const cx = classNames.bind(styles);

const messages = defineMessages({
  launchPassed: {
    id: 'HistoryLineItemContent.launchPassed',
    defaultMessage: 'Passed',
  },
  launchReseted: {
    id: 'HistoryLineItemContent.launchReseted',
    defaultMessage: 'Item is empty',
  },
  launchFailed: {
    id: 'HistoryLineItemContent.launchFailed',
    defaultMessage: 'Failed',
  },
  launchNotFound: {
    id: 'HistoryLineItemContent.launchNotFound',
    defaultMessage: 'No item in launch',
  },
  launchSkipped: {
    id: 'HistoryLineItemContent.launchSkipped',
    defaultMessage: 'Skipped',
  },
  launchSameItems: {
    id: 'HistoryLineItemContent.launchSameItems',
    defaultMessage: "There're several items with the same UID meaning.",
  },
});

const blockTitleMessagesMap = {
  [PASSED]: messages.launchPassed,
  [FAILED]: messages.launchFailed,
  [SKIPPED]: messages.launchSkipped,
  [RESETED]: messages.launchReseted,
  [MANY]: messages.launchSameItems,
  [NOT_FOUND]: messages.launchNotFound,
};

@injectIntl
export class HistoryLineItemContent extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    onClick: PropTypes.func,
    status: PropTypes.string,
    statistics: PropTypes.shape({
      defects: PropTypes.object,
    }),
    has_childs: PropTypes.bool,
    active: PropTypes.bool,
    isFirstItem: PropTypes.bool,
    isLastItem: PropTypes.bool,
  };

  static defaultProps = {
    onClick: () => {},
    status: '',
    statistics: {},
    has_childs: false,
    active: false,
    isFirstItem: false,
    isLastItem: false,
  };

  render() {
    const {
      intl,
      status,
      active,
      isFirstItem,
      isLastItem,
      statistics,
      onClick,
      ...rest
    } = this.props;

    return (
      <div
        className={cx('history-line-item-content', `status-${status}`, {
          active,
          'first-item': isFirstItem,
          'last-item': isLastItem,
        })}
        title={intl.formatMessage(blockTitleMessagesMap[status.toLowerCase()])}
        onClick={onClick}
      >
        <div className={cx('item-block-bg')} />
        <HistoryLineItemBadges
          active={active}
          status={status}
          defects={!this.props.has_childs ? statistics.defects : {}}
          {...rest}
        />
      </div>
    );
  }
}
