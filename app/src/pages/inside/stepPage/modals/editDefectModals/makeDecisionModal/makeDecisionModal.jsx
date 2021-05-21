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

import React, { useEffect, useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { hideModalAction, withModal } from 'controllers/modal';
import { useIntl } from 'react-intl';
import { NOTIFICATION_TYPES, showNotification } from 'controllers/notification';
import { DarkModalLayout } from 'components/main/modal/darkModalLayout';
import { GhostButton } from 'components/buttons/ghostButton';
import { activeProjectSelector } from 'controllers/user';
import { Accordion, useAccordionTabsState } from 'pages/inside/common/accordion';
import isEqual from 'fast-deep-equal';
import { URLS } from 'common/urls';
import { fetch, isEmptyObject } from 'common/utils';
import { historyItemsSelector } from 'controllers/log';
import { linkIssueAction, postIssueAction, unlinkIssueAction } from 'controllers/step';
import { LINK_ISSUE, POST_ISSUE, UNLINK_ISSUE } from 'common/constants/actionTypes';
import classNames from 'classnames/bind';
import { CSSTransition } from 'react-transition-group';
import { messages } from './../messages';
import {
  COPY_FROM_HISTORY_LINE,
  CURRENT_EXECUTION_ONLY,
  MACHINE_LEARNING_SUGGESTIONS,
  MAKE_DECISION_MODAL,
  SEARCH_MODES,
  SELECT_DEFECT_MANUALLY,
  SIMILAR_TI_CURRENT_LAUNCH,
  TO_INVESTIGATE_LOCATOR_PREFIX,
} from '../constants';
import { SelectDefectManually } from './selectDefectManually';
import { CopyFromHistoryLine } from './copyFromHistoryLine';
import styles from './makeDecisionModal.scss';
import { OptionsSection } from './optionsStepForm/optionsSection';

const cx = classNames.bind(styles);

const MakeDecision = ({ data }) => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const activeProject = useSelector(activeProjectSelector);
  const historyItems = useSelector(historyItemsSelector);
  const isBulkOperation = data.items && data.items.length > 1;
  const itemData = isBulkOperation ? data.items : data.items[0];
  const [modalState, setModalState] = useReducer((state, newState) => ({ ...state, ...newState }), {
    source: {
      issue: isBulkOperation ? { comment: '' } : itemData.issue,
    },
    decisionType: SELECT_DEFECT_MANUALLY,
    issueActionType: '',
    optionValue:
      itemData.issue && itemData.issue.issueType.startsWith(TO_INVESTIGATE_LOCATOR_PREFIX)
        ? SIMILAR_TI_CURRENT_LAUNCH
        : CURRENT_EXECUTION_ONLY,
    searchMode:
      itemData.issue && itemData.issue.issueType.startsWith(TO_INVESTIGATE_LOCATOR_PREFIX)
        ? SEARCH_MODES.SIMILAR_TI_CURRENT_LAUNCH
        : '',
    testItems: [],
    selectedItems: [],
  });
  const [tabs, toggleTab, collapseTabsExceptCurr] = useAccordionTabsState({
    [MACHINE_LEARNING_SUGGESTIONS]: false,
    [COPY_FROM_HISTORY_LINE]: false,
    [SELECT_DEFECT_MANUALLY]: true,
  });
  const [modalHasChanges, setModalHasChanges] = useState(false);
  const [isShownLess, setIsShown] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  useEffect(() => {
    setModalHasChanges(
      (isBulkOperation
        ? !isEmptyObject(modalState.source.issue)
        : modalState.decisionType === SELECT_DEFECT_MANUALLY &&
          !isEqual(itemData.issue, modalState.source.issue)) ||
        modalState.decisionType === COPY_FROM_HISTORY_LINE ||
        !!modalState.issueActionType,
    );
  }, [modalState]);

  const prepareDataToSend = ({ isIssueAction, replaceComment } = {}) => {
    const { issue } = modalState.source;
    if (isBulkOperation) {
      const items = modalState.selectedItems;
      return items.map((item) => {
        const comment = replaceComment
          ? issue.comment
          : `${item.issue.comment}\n${issue.comment}`.trim();
        return {
          ...(isIssueAction ? item : {}),
          testItemId: item.id,
          issue: {
            ...item.issue,
            ...issue,
            comment,
            autoAnalyzed: false,
          },
        };
      });
    }
    return modalState.selectedItems.map((item, i) => {
      let comment = issue.comment || '';
      if (
        comment !== item.issue.comment &&
        (modalState.decisionType === COPY_FROM_HISTORY_LINE || i !== 0)
      ) {
        comment = `${item.issue.comment || ''}\n${comment}`.trim();
      }
      return {
        ...(isIssueAction ? item : {}),
        id: item.id || item.itemId,
        testItemId: item.id || item.itemId,
        issue: {
          ...issue,
          comment,
          autoAnalyzed: false,
        },
      };
    });
  };
  const saveDefect = (options) => {
    const { fetchFunc } = data;
    const issues = prepareDataToSend(options);
    const url = URLS.testItems(activeProject);

    fetch(url, {
      method: 'put',
      data: {
        issues,
      },
    })
      .then(() => {
        fetchFunc(issues);
        dispatch(
          showNotification({
            message: formatMessage(messages.updateDefectsSuccess),
            type: NOTIFICATION_TYPES.SUCCESS,
          }),
        );
      })
      .catch(() => {
        dispatch(
          showNotification({
            message: formatMessage(messages.updateDefectsFailed),
            type: NOTIFICATION_TYPES.ERROR,
          }),
        );
      });
    dispatch(hideModalAction());
  };

  const handlePostIssue = () => {
    const { postIssueEvents } = data.eventsInfo;
    dispatch(
      postIssueAction(prepareDataToSend({ isIssueAction: true }), {
        fetchFunc: data.fetchFunc,
        eventsInfo: postIssueEvents,
      }),
    );
  };
  const handleLinkIssue = () => {
    const { linkIssueEvents } = data.eventsInfo;
    dispatch(
      linkIssueAction(prepareDataToSend({ isIssueAction: true }), {
        fetchFunc: data.fetchFunc,
        eventsInfo: linkIssueEvents,
      }),
    );
  };
  const handleUnlinkIssue = () => {
    const { unlinkIssueEvents } = data.eventsInfo;
    const selectedItems = isBulkOperation
      ? prepareDataToSend({ isIssueAction: true }).filter(
          (item) => item.issue.externalSystemIssues.length > 0,
        )
      : prepareDataToSend({ isIssueAction: true });
    dispatch(
      unlinkIssueAction(selectedItems, {
        fetchFunc: data.fetchFunc,
        eventsInfo: unlinkIssueEvents,
      }),
    );
  };

  const getIssueAction = () => {
    switch (modalState.issueActionType) {
      case POST_ISSUE:
        return handlePostIssue();
      case LINK_ISSUE:
        return handleLinkIssue();
      case UNLINK_ISSUE:
        return handleUnlinkIssue();
      default:
        return false;
    }
  };
  const applyChangesImmediately = (options) => {
    if (isBulkOperation) {
      modalHasChanges && !isEmptyObject(modalState.source.issue) && saveDefect(options);
    } else {
      modalHasChanges && !isEqual(itemData.issue, modalState.source.issue) && saveDefect(options);
    }
    modalState.decisionType === COPY_FROM_HISTORY_LINE &&
      isEqual(itemData.issue, modalState.source.issue) &&
      dispatch(hideModalAction());
    modalState.issueActionType && dispatch(hideModalAction()) && getIssueAction();
  };
  const applyImmediatelyWithComment = () => {
    applyChangesImmediately({ replaceComment: true });
  };
  const applyChanges = () => applyChangesImmediately();

  const renderHeaderElements = () => {
    return (
      <>
        {isBulkOperation && (
          <GhostButton
            onClick={applyImmediatelyWithComment}
            disabled={!modalHasChanges}
            transparentBorder
            transparentBackground
            appearance="topaz"
          >
            {formatMessage(
              modalState.source.issue.comment
                ? messages.replaceCommentsAndApply
                : messages.clearCommentsAndApply,
            )}
          </GhostButton>
        )}
        <GhostButton
          onClick={applyChanges}
          disabled={modalState.selectedItems.length === 0 || !modalHasChanges}
          color="''"
          appearance="topaz"
        >
          {modalState.selectedItems.length > 1
            ? formatMessage(messages.applyToItems, {
                itemsCount: modalState.selectedItems.length,
              })
            : formatMessage(messages.applyAndContinue)}
        </GhostButton>
      </>
    );
  };

  const getAccordionTabs = () => {
    const preparedHistoryLineItems = historyItems.filter(
      (item) => item.issue && item.id !== itemData.id,
    );
    const tabsData = [
      {
        id: MACHINE_LEARNING_SUGGESTIONS,
        shouldShow: !isBulkOperation,
        disabled: true,
        isOpen: tabs[MACHINE_LEARNING_SUGGESTIONS],
        title: (
          <div title={formatMessage(messages.disabledTabTooltip)}>
            {formatMessage(messages.machineLearningSuggestions)}
          </div>
        ),
        content: null,
      },
      {
        id: SELECT_DEFECT_MANUALLY,
        shouldShow: true,
        disabled: false,
        isOpen: tabs[SELECT_DEFECT_MANUALLY],
        title: formatMessage(messages.selectDefectTypeManually),
        content: (
          <SelectDefectManually
            itemData={itemData}
            modalState={modalState}
            setModalState={setModalState}
            isBulkOperation={isBulkOperation}
            collapseTabsExceptCurr={collapseTabsExceptCurr}
            isShownLess={isShownLess}
          />
        ),
      },
    ];
    if (preparedHistoryLineItems.length > 0) {
      tabsData.splice(1, 0, {
        id: COPY_FROM_HISTORY_LINE,
        shouldShow: !isBulkOperation,
        disabled: false,
        isOpen: tabs[COPY_FROM_HISTORY_LINE],
        title: formatMessage(messages.copyFromHistoryLine),
        content: (
          <CopyFromHistoryLine
            items={preparedHistoryLineItems}
            itemData={itemData}
            modalState={modalState}
            setModalState={setModalState}
            collapseTabsExceptCurr={collapseTabsExceptCurr}
          />
        ),
      });
    }
    return tabsData;
  };

  const hotKeyAction = {
    ctrlEnter: applyChanges,
  };

  const renderTitle = () => {
    if (isBulkOperation) {
      return !isShownLess
        ? formatMessage(messages.bulk)
        : formatMessage(messages.bulkOperationDecision);
    } else {
      return !isShownLess
        ? formatMessage(messages.test, {
            launchNumber: itemData.launchNumber && `#${itemData.launchNumber}`,
          })
        : formatMessage(messages.decisionForTest, {
            launchNumber: itemData.launchNumber && `#${itemData.launchNumber}`,
          });
    }
  };

  return (
    <CSSTransition
      timeout={300}
      in={isOpen}
      classNames={cx('window-animation')}
      onExited={() => dispatch(hideModalAction())}
    >
      {(status) => (
        <div className={cx('modal-content')}>
          <DarkModalLayout
            title={renderTitle()}
            renderHeaderElements={renderHeaderElements}
            modalHasChanges={modalHasChanges}
            hotKeyAction={hotKeyAction}
            modalNote={formatMessage(messages.modalNote)}
            isShownLess={isShownLess}
            setIsOpen={setIsOpen}
            status={status}
          >
            <Accordion tabs={getAccordionTabs()} toggleTab={toggleTab} />
          </DarkModalLayout>
          <OptionsSection
            currentTestItem={itemData}
            modalState={modalState}
            setModalState={setModalState}
            isShownLess={isShownLess}
            setIsShown={setIsShown}
            isBulkOperation={isBulkOperation}
          />
        </div>
      )}
    </CSSTransition>
  );
};
MakeDecision.propTypes = {
  data: PropTypes.shape({
    items: PropTypes.array,
    fetchFunc: PropTypes.func,
    eventsInfo: PropTypes.object,
  }).isRequired,
};
export const MakeDecisionModal = withModal(MAKE_DECISION_MODAL)(MakeDecision);
