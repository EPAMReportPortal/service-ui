import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import classNames from 'classnames/bind';
import { lastLogActivitySelector } from 'controllers/log';
import { LOG_PAGE_EVENTS } from 'components/main/analytics/events';
import StackTraceIcon from 'common/img/stack-trace-inline.svg';
import AttachmentIcon from 'common/img/attachment-inline.svg';
import InfoIcon from 'common/img/info-inline.svg';
import TestParamsIcon from 'common/img/test-params-icon-inline.svg';
import ClockIcon from 'common/img/clock-inline.svg';
import { InfoTabs } from '../infoTabs';
import { LogItemDetails } from './logItemDetails';
import { LogItemActivity } from './logItemActivity';
import { Parameters } from './parameters';
import { Attachments } from './attachments';
import { StackTrace } from './stackTrace';
import { getActionMessage } from '../utils/getActionMessage';
import styles from './logItemInfoTabs.scss';

const cx = classNames.bind(styles);

const messages = defineMessages({
  stackTab: {
    id: 'LogItemInfoTabs.stackTab',
    defaultMessage: 'Stack trace',
  },
  attachmentsTab: {
    id: 'LogItemInfoTabs.attachmentsTab',
    defaultMessage: 'Attachments',
  },
  detailsTab: {
    id: 'LogItemInfoTabs.detailsTab',
    defaultMessage: 'Item details',
  },
  parametersTab: {
    id: 'LogItemInfoTabs.parametersTab',
    defaultMessage: 'Parameters',
  },
  historyTab: {
    id: 'LogItemInfoTabs.historyTab',
    defaultMessage: 'History of actions',
  },
});

const makeTabs = ({ formatMessage }, logItem, onChangePage, onChangeLogLevel) => [
  {
    id: 'stack',
    label: formatMessage(messages.stackTab),
    icon: StackTraceIcon,
    eventInfo: LOG_PAGE_EVENTS.STACK_TRACE_TAB,
    content: <StackTrace onChangePage={onChangePage} onChangeLogLevel={onChangeLogLevel} />,
  },
  {
    id: 'attachments',
    label: formatMessage(messages.attachmentsTab),
    icon: AttachmentIcon,
    content: <Attachments />,
    eventInfo: LOG_PAGE_EVENTS.ATTACHMENT_TAB,
  },
  {
    id: 'details',
    label: formatMessage(messages.detailsTab),
    icon: InfoIcon,
    content: <LogItemDetails logItem={logItem} />,
    eventInfo: LOG_PAGE_EVENTS.ITEM_DETAILS_TAB,
  },
  {
    id: 'parameters',
    label: formatMessage(messages.parametersTab),
    icon: TestParamsIcon,
    content: <Parameters logItem={logItem} />,
  },
  {
    id: 'history',
    label: formatMessage(messages.historyTab),
    icon: ClockIcon,
    content: <LogItemActivity />,
    eventInfo: LOG_PAGE_EVENTS.ACTIONS_TAB,
  },
];

@injectIntl
@connect((state) => ({
  lastActivity: lastLogActivitySelector(state),
}))
export class LogItemInfoTabs extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    lastActivity: PropTypes.object,
    logItem: PropTypes.object.isRequired,
    onChangePage: PropTypes.func.isRequired,
    onChangeLogLevel: PropTypes.func.isRequired,
  };

  static defaultProps = {
    lastActivity: null,
  };

  state = {
    activeTab: null,
  };

  componentDidUpdate(prevProps) {
    if (prevProps.logItem.id !== this.props.logItem.id) {
      this.setActiveTab();
    }
  }

  setActiveTab = (tab = {}) => {
    this.setState({
      activeTab: this.state.activeTab && this.state.activeTab.id === tab.id ? null : tab,
    });
  };

  renderPanelContent() {
    const { intl, lastActivity } = this.props;

    return lastActivity ? (
      <div className={cx('panel-content')}>
        <span className={cx('user')}>{lastActivity.userRef}</span>{' '}
        <span className={cx('action')}>{getActionMessage(intl, lastActivity)}</span>
      </div>
    ) : null;
  }

  render() {
    const { intl, logItem, onChangePage, onChangeLogLevel } = this.props;

    return (
      <InfoTabs
        tabs={makeTabs(intl, logItem, onChangePage, onChangeLogLevel)}
        activeTab={this.state.activeTab}
        setActiveTab={this.setActiveTab}
        panelContent={this.renderPanelContent()}
      />
    );
  }
}
