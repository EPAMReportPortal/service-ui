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
  getProceedValidItemsEvent,
  getRefreshPageActionEvent,
  getHistoryPageLinkEvent,
  getRefineFiltersPanelEvents,
} from './common/testItemPages/actionEventsCreators';
import {
  getDeleteItemModalEvents,
  getEditItemsModalEvents,
} from './common/testItemPages/modalEventsCreators';

export const SUITE_PAGE = 'suites';
export const SUITES_PAGE_EVENTS = {
  PLUS_MINUS_BREADCRUMB: {
    category: SUITE_PAGE,
    action: 'Click on Bread Crumb icon Plus/Minus',
    label: 'Show/Hide all names of items',
  },
  ALL_LABEL_BREADCRUMB: {
    category: SUITE_PAGE,
    action: 'Click on Bread Crumb All',
    label: 'Transition to Launches Page',
  },
  ITEM_NAME_BREADCRUMB_CLICK: {
    category: SUITE_PAGE,
    action: 'Click on Bread Crumb Item name',
    label: 'Transition to Item',
  },
  DELETE_BTN: {
    category: SUITE_PAGE,
    action: 'Click on Btn Delete',
    label: 'Delete selected Items',
  },
  HISTORY_BTN: getHistoryPageLinkEvent(SUITE_PAGE),
  REFRESH_BTN: getRefreshPageActionEvent(SUITE_PAGE),
  REFINE_BY_NAME: {
    category: SUITE_PAGE,
    action: 'Enter parameters to refine by name',
    label: 'Refine by name',
  },
  // REFINE_FILTERS_PANEL
  REFINE_FILTERS_PANEL_EVENTS: {
    commonEvents: getRefineFiltersPanelEvents(SUITE_PAGE),
  },
  EDIT_ICON_CLICK: {
    category: SUITE_PAGE,
    action: 'Click on item icon "edit"',
    label: 'Arise Modal "Edit Item"',
  },
  EDIT_ITEMS_ACTION: {
    category: SUITE_PAGE,
    action: 'Click on "edit" in Actions',
    label: 'Arise Modal "Edit Items"',
  },
  SELECT_ALL_ITEMS: {
    category: SUITE_PAGE,
    action: 'Click on item icon "select all items"',
    label: 'Select/unselect all items',
  },
  SELECT_ONE_ITEM: {
    category: SUITE_PAGE,
    action: 'Click on item icon "select one item"',
    label: 'Select/unselect one item',
  },
  CLOSE_ICON_SELECTED_ITEM: {
    category: SUITE_PAGE,
    action: 'Click on icon "close" on selected item',
    label: 'Remove item from  selection',
  },
  CLOSE_ICON_FOR_ALL_SELECTIONS: {
    category: SUITE_PAGE,
    action: 'Click on icon "close" of all selection',
    label: 'Unselect all items',
  },
  PROCEED_VALID_ITEMS: getProceedValidItemsEvent(SUITE_PAGE),
  NAME_FILTER: {
    category: SUITE_PAGE,
    action: 'Click on icon "filter" on Name',
    label: 'Suite name input becomes active',
  },
  NAME_SORTING: {
    category: SUITE_PAGE,
    action: 'Click on icon "sorting" on Name',
    label: 'Sort items by name',
  },
  START_TIME_FILTER: {
    category: SUITE_PAGE,
    action: 'Click on icon "filter" on Start time',
    label: 'Arises active "Start time" input',
  },
  START_TIME_SORTING: {
    category: SUITE_PAGE,
    action: 'Click on icon "sorting" on Start time',
    label: 'Sort items by Start time',
  },
  TOTAL_FILTER: {
    category: SUITE_PAGE,
    action: 'Click on icon "filter" on Total',
    label: 'Arises active "Total" input',
  },
  TOTAL_SORTING: {
    category: SUITE_PAGE,
    action: 'Click on icon "sorting" on Total',
    label: 'Sort items by Total',
  },
  PASSED_FILTER: {
    category: SUITE_PAGE,
    action: 'Click on icon "filter" on Passed',
    label: 'Arises active "Passed" input',
  },
  PASSED_SORTING: {
    category: SUITE_PAGE,
    action: 'Click on icon "sorting" on Passed',
    label: 'Sort items by Passed',
  },
  UNTESTED_FILTER: {
    category: SUITE_PAGE,
    action: 'Click on icon "filter" on Untested',
    label: 'Arises active "Untested" input',
  },
  UNTESTED_SORTING: {
    category: SUITE_PAGE,
    action: 'Click on icon "sorting" on Untested',
    label: 'Sort items by Untested',
  },
  FAILED_FILTER: {
    category: SUITE_PAGE,
    action: 'Click on icon "filter" on Failed',
    label: 'Arises active "Failed" input',
  },
  FAILED_SORTING: {
    category: SUITE_PAGE,
    action: 'Click on icon "sorting" on Failed',
    label: 'Sort items by Failed',
  },
  SKIPPED_FILTER: {
    category: SUITE_PAGE,
    action: 'Click on icon "filter" on Skipped',
    label: 'Arises active "Skipped" input',
  },
  SKIPPED_SORTING: {
    category: SUITE_PAGE,
    action: 'Click on icon "sorting" on Skipped',
    label: 'Sort items by Skipped',
  },
  PB_FILTER: {
    category: SUITE_PAGE,
    action: 'Click on icon "filter" on Product Bug',
    label: 'Arises active "Product Bug" input',
  },
  PB_SORTING: {
    category: SUITE_PAGE,
    action: 'Click on icon "sorting" on Product Bug',
    label: 'Sort items by Product Bug',
  },
  AB_FILTER: {
    category: SUITE_PAGE,
    action: 'Click on icon "filter" on Auto Bug',
    label: 'Arises active "Auto Bug" input',
  },
  AB_SORTING: {
    category: SUITE_PAGE,
    action: 'Click on icon "sorting" on Auto Bug',
    label: 'Sort items by Auto Bug',
  },
  SI_FILTER: {
    category: SUITE_PAGE,
    action: 'Click on icon "filter" on System Issue',
    label: 'Arises active "System Issue" input',
  },
  SI_SORTING: {
    category: SUITE_PAGE,
    action: 'Click on icon "sorting" on System Issue',
    label: 'Sort items by System Issue',
  },
  TI_FILTER: {
    category: SUITE_PAGE,
    action: 'Click on icon "filter" on To Investigate',
    label: 'Arises active "To Investigate" input',
  },
  TI_SORTING: {
    category: SUITE_PAGE,
    action: 'Click on icon "sorting" on To Investigatee',
    label: 'Sort items by To Investigate',
  },
  PB_CHART: {
    category: SUITE_PAGE,
    action: 'Click on PB Circle',
    label: 'Transition to PB list view',
  },
  PB_TOOLTIP: {
    category: SUITE_PAGE,
    action: 'Click on Tooltip "Total Product Bugs"',
    label: 'Transition to PB list view',
  },
  AB_CHART: {
    category: SUITE_PAGE,
    action: 'Click on AB Circle',
    label: 'Transition to AB list view ',
  },
  AB_TOOLTIP: {
    category: SUITE_PAGE,
    action: 'Click on Tooltip "Auto Bug"',
    label: 'Transition to AB list view ',
  },
  SI_CHART: {
    category: SUITE_PAGE,
    action: 'Click on SI Circle',
    label: 'Transition to SI list view ',
  },
  SI_TOOLTIP: {
    category: SUITE_PAGE,
    action: 'Click on Tooltip "Total System Issue"',
    label: 'Transition to SI list view',
  },
  TI_CHART: {
    category: SUITE_PAGE,
    action: 'Click on TI tag',
    label: 'Transition to TI list view',
  },
  TI_TOOLTIP: {
    category: SUITE_PAGE,
    action: 'Click on Tooltip "To Investigate"',
    label: 'Transition to inner level of launch with To Investigate',
  },
  LOG_VIEW_SWITCHER: {
    category: SUITE_PAGE,
    action: 'Click on launch log view switcher',
    label: 'Open "Launch log view"',
  },
  // DELETE_ITEM_MODAL
  DELETE_ITEM_MODAL_EVENTS: getDeleteItemModalEvents(SUITE_PAGE),
  // EDIT_ITEMS_MODAL
  EDIT_ITEMS_MODAL_EVENTS: getEditItemsModalEvents(SUITE_PAGE),
};
