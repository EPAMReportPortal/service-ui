/*
 * Copyright 2021 EPAM Systems
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

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { messages } from 'pages/inside/stepPage/modals/editDefectModals/messages';
import classNames from 'classnames/bind';
import { useIntl } from 'react-intl';
import { URLS } from 'common/urls';
import { fetch } from 'common/utils';
import { NOTIFICATION_TYPES, showNotification } from 'controllers/notification';
import { useDispatch, useSelector } from 'react-redux';
import { activeProjectSelector } from 'controllers/user';
import { activeFilterSelector } from 'controllers/filter';
import ShowLess from 'common/img/show-less-inline.svg';
import ShowMore from 'common/img/show-more-inline.svg';
import Parser from 'html-react-parser';
import { ScrollWrapper } from 'components/main/scrollWrapper';
import styles from './optionsSection.scss';
import { ItemsList } from './itemsList';
import { OptionsBlock } from './optionsBlock';
import { ALL_LOADED_TI_FROM_HISTORY_LINE, ERROR_LOGS_SIZE, SEARCH_MODES } from '../../constants';

const cx = classNames.bind(styles);

export const OptionsSection = ({
  currentTestItem,
  setModalState,
  modalState,
  isShownLess,
  setIsShown,
  isBulkOperation,
}) => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const activeProject = useSelector(activeProjectSelector);
  const activeFilter = useSelector(activeFilterSelector);
  const [loading, setLoading] = useState(false);
  const { optionValue, testItems, selectedItems } = modalState;
  useEffect(() => {
    const fetchLogs = (searchMode) => {
      const requestData = {
        searchMode,
      };
      if (searchMode === SEARCH_MODES.WITH_FILTER) {
        requestData.filterId = activeFilter.id;
      }
      setLoading(true);
      let currentItemLogRequest = [];
      let similarItemsRequest = [];
      let requests;
      if (isBulkOperation) {
        currentTestItem.map((elem) => {
          currentItemLogRequest.push(
            fetch(URLS.logItemStackTrace(activeProject, elem.path, ERROR_LOGS_SIZE)),
          );
          return (
            searchMode &&
            similarItemsRequest.push(
              fetch(URLS.logSearch(activeProject, elem.id), {
                method: 'post',
                data: requestData,
              }),
            )
          );
        });
        requests = searchMode
          ? currentItemLogRequest.concat(similarItemsRequest)
          : currentItemLogRequest;
      } else {
        currentItemLogRequest = fetch(
          URLS.logItemStackTrace(activeProject, currentTestItem.path, ERROR_LOGS_SIZE),
        );
        similarItemsRequest =
          searchMode &&
          fetch(URLS.logSearch(activeProject, currentTestItem.id), {
            method: 'post',
            data: requestData,
          });
        requests = searchMode
          ? [currentItemLogRequest, similarItemsRequest]
          : [currentItemLogRequest];
      }

      Promise.all(requests)
        .then((responses) => {
          const [currentItemRes, similarItemsRes] = responses;
          const currentItemLogs = isBulkOperation
            ? responses.map((item) => item.content)
            : currentItemRes.content;
          const items = [];
          isBulkOperation
            ? currentTestItem.map((elem, i) => {
                return items.push({ ...elem, logs: currentItemLogs[i] });
              })
            : items.push({ ...currentTestItem, logs: currentItemLogs }, ...(similarItemsRes || []));
          setModalState({
            testItems: items,
            selectedItems: isBulkOperation
              ? items.map((item) => {
                  return { ...item, itemId: item.id };
                })
              : items,
          });
          setLoading(false);
        })
        .catch(({ message }) => {
          setModalState({
            testItems: [],
            selectedItems: [],
          });
          setLoading(false);
          dispatch(
            showNotification({
              message,
              type: NOTIFICATION_TYPES.ERROR,
            }),
          );
        });
    };

    optionValue !== ALL_LOADED_TI_FROM_HISTORY_LINE && fetchLogs(modalState.searchMode);
  }, [optionValue]);

  return (
    <div className={cx('options-section', { 'shown-less': isShownLess })}>
      <ScrollWrapper hideTracksWhenNotNeeded autoHide>
        <div className={cx('header-block')}>
          <button className={cx('button')} onClick={() => setIsShown(!isShownLess)}>
            <i className={cx('show-icon')}>{Parser(isShownLess ? ShowMore : ShowLess)}</i>{' '}
            <span className={cx('show-icon-prefix')}>
              {isShownLess ? formatMessage(messages.seeMore) : formatMessage(messages.seeLess)}
            </span>
          </button>
          {isBulkOperation ? (
            <span className={cx('header')}>{formatMessage(messages.currentSelection)}</span>
          ) : (
            <>
              <span className={cx('header')}>{formatMessage(messages.applyDefectFor)}</span>
              <span className={cx('subheader')}>
                {formatMessage(messages.applyToSimilarItems)}:
              </span>
            </>
          )}
        </div>
        <div className={cx('options-block')}>
          {!isBulkOperation && (
            <OptionsBlock
              optionValue={optionValue}
              currentTestItem={currentTestItem}
              loading={loading}
              setModalState={setModalState}
            />
          )}
          <div className={cx('items-list')}>
            <ItemsList
              setModalState={setModalState}
              testItems={testItems}
              selectedItems={selectedItems}
              loading={loading}
              optionValue={!isBulkOperation && optionValue}
              isShownLess={isShownLess}
              isBulkOperation={isBulkOperation}
            />
          </div>
        </div>
      </ScrollWrapper>
    </div>
  );
};
OptionsSection.propTypes = {
  currentTestItem: PropTypes.object,
  setModalState: PropTypes.func,
  testItems: PropTypes.array,
  selectedItems: PropTypes.array,
  optionValue: PropTypes.string,
  loading: PropTypes.bool,
  isBulkOperation: PropTypes.bool,
  isShownLess: PropTypes.bool,
  setIsShown: PropTypes.func,
  modalState: PropTypes.object,
};
OptionsSection.defaultProps = {
  currentTestItem: {},
  setModalState: () => {},
  testItems: [],
  selectedItems: [],
  optionValue: '',
  loading: false,
  isBulkOperation: false,
  isShownLess: true,
  setIsShown: () => {},
  modalState: {},
};
