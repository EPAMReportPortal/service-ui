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

import {
  getRefineFiltersPanelEvents,
  getDeleteActionEvent,
  getEditDefectActionEvent,
  getLinkIssueActionEvent,
  getUnlinkIssueActionEvent,
  getPostIssueActionEvent,
  getProceedValidItemsEvent,
  getRefreshPageActionEvent,
} from './common/testItemPages/actionEventsCreators';
import {
  getEditDefectModalEvents,
  getEditToInvestigateSelectAllSimilarItemsEvent,
  getEditToInvestigateChangeSearchModeEvent,
  getUnlinkIssueModalEvents,
  getPostIssueModalEvents,
  getLinkIssueModalEvents,
  getDeleteItemModalEvents,
} from './common/testItemPages/modalEventsCreators';

export const HISTORY_PAGE = 'history';
export const HISTORY_PAGE_EVENTS = {
  CLOSE_ICON_EDIT_ITEM_MODAL: {
    category: HISTORY_PAGE,
    action: 'Click on Close Icon on Modal "Edit Item"',
    label: 'Close modal "Edit Item"',
  },
  CANCEL_BTN_EDIT_ITEM_MODAL: {
    category: HISTORY_PAGE,
    action: 'Click on Btn Cancel on Modal "Edit Item',
    label: 'Close modal "Edit Item"',
  },
  SAVE_BTN_EDIT_ITEM_MODAL: {
    category: HISTORY_PAGE,
    action: 'Click on Btn Save on Modal "Edit Item"',
    label: 'Save changes',
  },
  BULK_EDIT_ITEMS_DESCRIPTION: {
    category: HISTORY_PAGE,
    action: 'Edit description in Modal "Edit Items" in a bulk',
    label: 'Edit description in mode: ',
  },
  SELECT_HISTORY_DEPTH: {
    category: HISTORY_PAGE,
    action: 'Select "history depth"',
    label: 'Show parameter of selected "history depth"',
  },
  SELECT_HISTORY_BASE: {
    category: HISTORY_PAGE,
    action: 'Select "history base"',
    label: 'Show parameter of selected "history base"',
  },
  CLICK_ON_ITEM: {
    category: HISTORY_PAGE,
    action: 'Click on item',
    label: 'Transition to "Item"',
  },
  COMPARE_WITH_FILTER_BTN: {
    category: HISTORY_PAGE,
    action: 'Click on button Compare',
    label: 'Open a drop down with Filters for adding custom column on History table',
  },
  CHOOSE_FILTER_FOR_COMPARE: {
    category: HISTORY_PAGE,
    action: 'Choose filter for Custom column on History table',
    label: 'Add new custom column on History table',
  },
  FILTERS_DROPDOWN_SEARCH_FILTER: {
    category: HISTORY_PAGE,
    action: 'Enter parameter for search in filters dropdown',
    label: 'Show filters by parameter',
  },
  CLEAR_COMPARE_FILTER_CROSS_BTN: {
    category: HISTORY_PAGE,
    action: 'Click on Cross near Filter name',
    label: 'Remove custom column on History table',
  },
  SELECT_HISTORY_ITEM: {
    category: HISTORY_PAGE,
    action: 'Select history item',
    label: 'Add item to the selected items',
  },
  UNSELECT_HISTORY_ITEM: {
    category: HISTORY_PAGE,
    action: 'Unselect history item',
    label: 'Remove item from the selected items',
  },
  REFRESH_BTN: getRefreshPageActionEvent(HISTORY_PAGE),
  EDIT_DEFECT_ACTION: getEditDefectActionEvent(HISTORY_PAGE),
  POST_ISSUE_ACTION: getPostIssueActionEvent(HISTORY_PAGE),
  LINK_ISSUE_ACTION: getLinkIssueActionEvent(HISTORY_PAGE),
  DELETE_ACTION: getDeleteActionEvent(HISTORY_PAGE),
  UNLINK_ISSUES_ACTION: getUnlinkIssueActionEvent(HISTORY_PAGE),
  PROCEED_VALID_ITEMS: getProceedValidItemsEvent(HISTORY_PAGE),
  // EDIT_DEFECT_MODAL
  EDIT_DEFECT_MODAL_EVENTS: getEditDefectModalEvents(HISTORY_PAGE),
  SELECT_ALL_SIMILIAR_ITEMS_EDIT_DEFECT_MODAL: getEditToInvestigateSelectAllSimilarItemsEvent(
    HISTORY_PAGE,
  ),
  CHANGE_SEARCH_MODE_EDIT_DEFECT_MODAL: getEditToInvestigateChangeSearchModeEvent(HISTORY_PAGE),
  // UNLINK_ISSUE_MODAL
  UNLINK_ISSUE_MODAL_EVENTS: getUnlinkIssueModalEvents(HISTORY_PAGE),
  // POST_ISSUE_MODAL
  POST_ISSUE_MODAL_EVENTS: getPostIssueModalEvents(HISTORY_PAGE),
  // LINK_ISSUE_MODAL
  LINK_ISSUE_MODAL_EVENTS: getLinkIssueModalEvents(HISTORY_PAGE),
  // DELETE_ITEM_MODAL
  DELETE_ITEM_MODAL_EVENTS: getDeleteItemModalEvents(HISTORY_PAGE),
  // REFINE_FILTERS_PANEL
  REFINE_FILTERS_PANEL_EVENTS: getRefineFiltersPanelEvents(HISTORY_PAGE),
};
