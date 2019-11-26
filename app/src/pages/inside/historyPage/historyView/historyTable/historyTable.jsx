/*
 * Copyright 2019 EPAM Systems
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import {
  historySelector,
  totalItemsCountSelector,
  loadingSelector,
  fetchItemsHistoryAction,
} from 'controllers/itemsHistory';
import { nameLinkSelector } from 'controllers/testItem';
import { SpinningPreloader } from 'components/preloaders/spinningPreloader';
import { ScrollWrapper } from 'components/main/scrollWrapper';
import { NOT_FOUND, RESETED } from 'common/constants/launchStatuses';
import { PROJECT_LOG_PAGE } from 'controllers/pages';
import { ItemNameBlock } from './itemNameBlock';
import { HistoryItem } from './historyItem';
import { HistoryCell } from './historyCell';

import styles from './historyTable.scss';

const cx = classNames.bind(styles);

const messages = defineMessages({
  loadMoreHistoryItemsTitle: {
    id: 'HistoryTable.loadMoreHistoryItemsTitle',
    defaultMessage: 'Click here to load more items',
  },
  itemNamesHeaderTitle: {
    id: 'HistoryTable.itemNamesHeaderTitle',
    defaultMessage: 'Name',
  },
  executionNumberTitle: {
    id: 'HistoryTable.launchNumberTitle',
    defaultMessage: 'Execution #',
  },
});

@connect(
  (state) => ({
    history: historySelector(state),
    loading: loadingSelector(state),
    totalItemsCount: totalItemsCountSelector(state),
    link: (ownProps) => nameLinkSelector(state, ownProps),
  }),
  {
    fetchItemsHistoryAction,
    navigate: (linkAction) => linkAction,
  },
)
@injectIntl
export class HistoryTable extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    historyDepth: PropTypes.string.isRequired,
    loading: PropTypes.bool,
    history: PropTypes.array,
    totalItemsCount: PropTypes.number,
    fetchItemsHistoryAction: PropTypes.func,
    link: PropTypes.func,
    navigate: PropTypes.func,
  };

  static defaultProps = {
    history: [],
    loading: false,
    totalItemsCount: 0,
    fetchItemsHistoryAction: () => {},
    link: () => {},
    navigate: () => {},
  };

  getHeaderItemsCount = () => {
    const { history } = this.props;
    let headerItemsCount = 0;
    history.forEach((item) => {
      if (item.resources.length > headerItemsCount) {
        headerItemsCount = item.resources.length;
      }
    });
    this.rowItemsCount = headerItemsCount;

    return headerItemsCount;
  };

  getHistoryItemProps = (historyItem) => {
    let itemProps = {};

    if (!historyItem) {
      itemProps = {
        status: NOT_FOUND.toUpperCase(),
        defects: {},
      };
    } else {
      const itemIdsArray = historyItem.path.split('.');
      const itemIds = itemIdsArray.slice(0, itemIdsArray.length - 1).join('/');
      itemProps = {
        status: historyItem.status,
        issue: historyItem.issue,
        defects: historyItem.statistics.defects,
        itemIds,
      };
    }
    return itemProps;
  };

  getCorrespondingHistoryItem = (historyItemProps, currentHistoryItem) => {
    const { navigate, link } = this.props;
    switch (historyItemProps.status) {
      case NOT_FOUND.toUpperCase():
      case RESETED.toUpperCase():
        return (
          <HistoryCell status={historyItemProps.status}>
            <HistoryItem {...historyItemProps} />
          </HistoryCell>
        );
      default: {
        const clickHandler = () => {
          const ownProps = {
            ownLinkParams: {
              page: currentHistoryItem.hasChildren ? null : PROJECT_LOG_PAGE,
              testItemIds: historyItemProps.itemIds
                ? `${currentHistoryItem.launchId}/${historyItemProps.itemIds}`
                : currentHistoryItem.launchId,
            },
            itemId: currentHistoryItem.id,
          };
          navigate(link(ownProps));
        };
        return (
          <HistoryCell
            status={historyItemProps.status}
            onClick={clickHandler}
            key={currentHistoryItem.id}
          >
            <HistoryItem {...historyItemProps} />
          </HistoryCell>
        );
      }
    }
  };

  loadMoreHistoryItems = () => {
    this.props.fetchItemsHistoryAction({
      historyDepth: this.props.historyDepth,
      loadMore: true,
    });
  };

  renderHeader = () => {
    const { intl } = this.props;
    const headerItemsCount = this.getHeaderItemsCount();
    const headerItems = [];
    for (let index = headerItemsCount; index > 0; index -= 1) {
      headerItems.push(
        <HistoryCell key={index} header>
          {`${intl.formatMessage(messages.executionNumberTitle)}${index}`}
        </HistoryCell>,
      );
    }
    return headerItems;
  };

  renderHistoryItems = (item) => {
    const itemLastIndex = this.rowItemsCount - 1;
    const itemResources = [...item.resources].reverse();
    const historyItems = [];

    for (let index = itemLastIndex; index >= 0; index -= 1) {
      const historyItem = itemResources[index];

      const historyItemProps = this.getHistoryItemProps(historyItem);
      historyItems.push(this.getCorrespondingHistoryItem(historyItemProps, historyItem));
    }

    return historyItems;
  };

  renderBody = () => {
    const { history } = this.props;
    return history.map((item) => (
      <tr key={item.testCaseId}>
        <HistoryCell first>
          <div className={cx('history-grid-name')}>
            <ItemNameBlock data={item.resources[0]} />
          </div>
        </HistoryCell>
        {this.renderHistoryItems(item)}
      </tr>
    ));
  };

  renderFooter = () => {
    const { intl, history, loading, totalItemsCount } = this.props;
    const visibleItemsCount = history.length;

    if (visibleItemsCount && loading) {
      return (
        <div className={cx('spinner-wrapper')}>
          <SpinningPreloader />
        </div>
      );
    }

    return (
      !!visibleItemsCount &&
      visibleItemsCount < totalItemsCount && (
        <div className={cx('load-more-container')}>
          <button className={cx('load-more')} onClick={this.loadMoreHistoryItems}>
            <h3 className={cx('load-more-title')}>
              {intl.formatMessage(messages.loadMoreHistoryItemsTitle)}
            </h3>
          </button>
        </div>
      )
    );
  };

  render() {
    const { intl, history } = this.props;

    return (
      <Fragment>
        {!history.length ? (
          <div className={cx('spinner-wrapper')}>
            <SpinningPreloader />
          </div>
        ) : (
          <ScrollWrapper autoHeight>
            <table>
              <thead>
                <tr>
                  <HistoryCell header first>
                    <div className={cx('history-grid-name')}>
                      {intl.formatMessage(messages.itemNamesHeaderTitle)}
                    </div>
                  </HistoryCell>
                  {this.renderHeader()}
                </tr>
              </thead>
              <tbody>{this.renderBody()}</tbody>
            </table>
          </ScrollWrapper>
        )}
        {this.renderFooter()}
      </Fragment>
    );
  }
}
