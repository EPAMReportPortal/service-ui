import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { injectIntl, intlShape, defineMessages } from 'react-intl';
import { SpinningPreloader } from 'components/preloaders/spinningPreloader';
import { NoItemMessage } from 'components/main/noItemMessage';
import { ScrollWrapper } from 'components/main/scrollWrapper';
import { dateFormat } from 'common/utils';
import {
  logStackTraceItemsSelector,
  logStackTraceLoadingSelector,
  fetchLogPageStackTrace,
  isLoadMoreStackTraceVisible,
} from 'controllers/log';
import { StackTraceMessageBlock } from 'pages/inside/common/stackTraceMessageBlock';
import styles from './stackTrace.scss';

const cx = classNames.bind(styles);

const messages = defineMessages({
  messageRefCaption: {
    id: 'StackTrace.messageRefCaption',
    defaultMessage: 'Go to stack trace in log message',
  },
  noStackTrace: {
    id: 'StackTrace.noStackTrace',
    defaultMessage: 'No stack trace to display',
  },
  loadLabel: {
    id: 'StackTrace.loadLabel',
    defaultMessage: 'Load more',
  },
});

const MAX_ROW_HEIGHT = 120;
const SCROLL_HEIGHT = 300;
const LOAD_MORE_HEIGHT = 32;

@connect(
  (state) => ({
    items: logStackTraceItemsSelector(state),
    loading: logStackTraceLoadingSelector(state),
    loadMore: isLoadMoreStackTraceVisible(state),
  }),
  {
    fetchLogPageStackTrace,
  },
)
@injectIntl
export class StackTrace extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    items: PropTypes.array,
    loading: PropTypes.bool,
    fetchLogPageStackTrace: PropTypes.func,
    loadMore: PropTypes.bool,
    logItem: PropTypes.object,
    hideTime: PropTypes.bool,
    minHeight: PropTypes.number,
  };

  static defaultProps = {
    items: [],
    loading: false,
    fetchLogPageStackTrace: () => {},
    loadMore: false,
    logItem: {},
    hideTime: false,
    minHeight: SCROLL_HEIGHT,
  };

  componentDidMount() {
    if (this.isItemsExist()) {
      return;
    }
    this.fetchItems();
  }

  getScrolledHeight = () =>
    this.props.loadMore ? this.props.minHeight - LOAD_MORE_HEIGHT : this.props.minHeight;

  getMaxRowHeight = () => {
    const { items } = this.props;
    const scrolledHeight = this.getScrolledHeight();
    if (scrolledHeight && items.length && scrolledHeight > items.length * MAX_ROW_HEIGHT) {
      return scrolledHeight / items.length;
    }
    return MAX_ROW_HEIGHT;
  };

  fetchItems = () => this.props.fetchLogPageStackTrace(this.props.logItem);

  isItemsExist = () => {
    const { items } = this.props;
    return items.length;
  };

  renderStackTraceMessage = () => {
    const { items, loadMore, loading, intl, hideTime } = this.props;
    return (
      <React.Fragment>
        <ScrollWrapper autoHeight autoHeightMax={this.getScrolledHeight()}>
          {items.map((item) => (
            <div key={item.id} className={cx('row')}>
              <StackTraceMessageBlock maxHeight={this.getMaxRowHeight()}>
                <div className={cx('message-container')}>
                  <div className={cx('cell', 'message-cell')}>{item.message}</div>
                  {!hideTime && (
                    <div className={cx('cell', 'time-cell')}>{dateFormat(item.time)}</div>
                  )}
                </div>
              </StackTraceMessageBlock>
            </div>
          ))}
        </ScrollWrapper>
        {loadMore && (
          <div
            className={cx('load-more-container', {
              loading,
            })}
          >
            <div className={cx('load-more-label')} onClick={this.fetchItems}>
              {intl.formatMessage(messages.loadLabel)}
            </div>
            {loading && (
              <div className={cx('loading-icon')}>
                <SpinningPreloader />
              </div>
            )}
          </div>
        )}
      </React.Fragment>
    );
  };

  renderStackTrace = () => {
    const { intl, loading } = this.props;

    if (loading && !this.isItemsExist()) {
      return <SpinningPreloader />;
    }
    if (this.isItemsExist()) {
      return this.renderStackTraceMessage();
    }
    return <NoItemMessage message={intl.formatMessage(messages.noStackTrace)} />;
  };

  render() {
    return <div className={cx('stack-trace')}>{this.renderStackTrace()}</div>;
  }
}
