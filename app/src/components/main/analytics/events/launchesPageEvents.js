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

import { getEditItemsModalEvents } from 'components/main/analytics/events/common/testItemPages/modalEventsCreators';

export const LAUNCHES_PAGE = 'launches';
const LAUNCHES_MODAL = 'Modal launches';

const getActionTableFilter = (titleName) =>
  `Click on Filter Icon before Table title "${titleName}"`;
const getDescriptionTableFilter = () => 'Arise new field in filter';

const getAnalyzeItemMessage = (analyzerType, analyzeItemsMode) =>
  `Run analysis on Modal ${analyzerType} with mode: ${analyzeItemsMode}`;

const getAnalyzeItemEvent = (analyzerType, analyzeItemsMode) => {
  const message = getAnalyzeItemMessage(analyzerType, analyzeItemsMode.join(', '));
  return {
    category: LAUNCHES_MODAL,
    action: message,
    label: message,
  };
};

export const getRunAnalysisAnalysisModalEvent = (analyzeItemsMode) =>
  getAnalyzeItemEvent('Analyze Launch', analyzeItemsMode);
export const getRunAnalysisPatternAnalysisModalEvent = (analyzeItemsMode) =>
  getAnalyzeItemEvent('Pattern Analyze Launch', analyzeItemsMode);

export const LAUNCHES_PAGE_EVENTS = {
  CLICK_ITEM_NAME: {
    category: LAUNCHES_PAGE,
    action: 'Click on Item Name',
    label: 'Transition to Item page',
  },
  CLICK_HAMBURGER_MENU: {
    category: LAUNCHES_PAGE,
    action: 'Click on Icon Menu near Launch Name',
    label: 'Arise Dropdown with single actions for this launch',
  },
  CLICK_MOVE_TO_DEBUG_LAUNCH_MENU: {
    category: LAUNCHES_PAGE,
    action: 'Click on "Move to Debug" in Launch Menu',
    label: 'Arise Modal "Move to Debug"',
  },
  CLICK_FORCE_FINISH_LAUNCH_MENU: {
    category: LAUNCHES_PAGE,
    action: 'Click on "Force Finish" in Launch Menu',
    label: 'Interrupt launch loading',
  },
  CLICK_ANALYSIS_LAUNCH_MENU: {
    category: LAUNCHES_PAGE,
    action: 'Click on "Analysis" in Launch Menu',
    label: 'Arise Modal "Analyze Launches"',
  },
  CLICK_PATTERN_ANALYSIS_LAUNCH_MENU: {
    category: LAUNCHES_PAGE,
    action: 'Click on "Pattern analysis" in Launch Menu',
    label: 'Arise Modal "Pattern Analyze Launches"',
  },
  CLICK_DELETE_LAUNCH_MENU: {
    category: LAUNCHES_PAGE,
    action: 'Click on "Delete" in Launch Menu',
    label: 'Arise Modal "Delete Launch"',
  },
  CLICK_EXPORT_PDF: {
    category: LAUNCHES_PAGE,
    action: 'Click on "Export: PDF" in Launch Menu',
    label: 'Stars download of report in PDF',
  },
  CLICK_EXPORT_HTML: {
    category: LAUNCHES_PAGE,
    action: 'Click on "Export: HTML" in Launch Menu',
    label: 'Stars download of report in HTML',
  },
  CLICK_EXPORT_XLS: {
    category: LAUNCHES_PAGE,
    action: 'Click on "Export: XLS" in Launch Menu',
    label: 'Stars download of report in XLS',
  },
  NAME_FILTER: {
    category: LAUNCHES_PAGE,
    action: getActionTableFilter('NAME'),
    label: getDescriptionTableFilter(),
  },
  START_TIME_FILTER: {
    category: LAUNCHES_PAGE,
    action: getActionTableFilter('START'),
    label: getDescriptionTableFilter(),
  },
  TOTAL_FILTER: {
    category: LAUNCHES_PAGE,
    action: getActionTableFilter('TOTAL'),
    label: getDescriptionTableFilter(),
  },
  PASSED_FILTER: {
    category: LAUNCHES_PAGE,
    action: getActionTableFilter('PASSED'),
    label: getDescriptionTableFilter(),
  },
  UNTESTED_FILTER: {
    category: LAUNCHES_PAGE,
    action: getActionTableFilter('UNTESTED'),
    label: getDescriptionTableFilter(),
  },
  FAILED_FILTER: {
    category: LAUNCHES_PAGE,
    action: getActionTableFilter('FAILED'),
    label: getDescriptionTableFilter(),
  },
  SKIPPED_FILTER: {
    category: LAUNCHES_PAGE,
    action: getActionTableFilter('SKIPPED'),
    label: getDescriptionTableFilter(),
  },
  PB_FILTER: {
    category: LAUNCHES_PAGE,
    action: getActionTableFilter('PRODUCT BUG'),
    label: getDescriptionTableFilter(),
  },
  AB_FILTER: {
    category: LAUNCHES_PAGE,
    action: getActionTableFilter('AUTO BUG'),
    label: getDescriptionTableFilter(),
  },
  SI_FILTER: {
    category: LAUNCHES_PAGE,
    action: getActionTableFilter('SYSTEM ISSUE'),
    label: getDescriptionTableFilter(),
  },
  TI_FILTER: {
    category: LAUNCHES_PAGE,
    action: getActionTableFilter('TO INVESTIGATE'),
    label: getDescriptionTableFilter(),
  },
  EDIT_ICON_CLICK: {
    category: LAUNCHES_PAGE,
    action: 'Click on Edit Icon after launch name',
    label: 'Edit Launch/Arise Modal "Edit Launch"',
  },
  PB_CHART: {
    category: LAUNCHES_PAGE,
    action: 'Click on Product Bug Circle',
    label: 'Transition to inner level of launch with Product Bugs',
  },
  AB_CHART: {
    category: LAUNCHES_PAGE,
    action: 'Click on Auto Bug Circle',
    label: 'Transition to inner level of launch with Auto Bug',
  },
  SI_CHART: {
    category: LAUNCHES_PAGE,
    action: 'Click on System Issue Circle',
    label: 'Transition to inner level of launch with System Issue',
  },
  TI_CHART: {
    category: LAUNCHES_PAGE,
    action: 'Click on To Investigate tag',
    label: 'Transition to inner level of launch with To Investigate',
  },
  PB_TOOLTIP: {
    category: LAUNCHES_PAGE,
    action: 'Click on Tooltip "Total Product Bugs"',
    label: 'Transition to inner level of launch with Product Bugs',
  },
  AB_TOOLTIP: {
    category: LAUNCHES_PAGE,
    action: 'Click on Tooltip "Total Auto Bug"',
    label: 'Transition to inner level of launch with Auto Bug',
  },
  SI_TOOLTIP: {
    category: LAUNCHES_PAGE,
    action: 'Click on Tooltip "Total System Issue"',
    label: 'Transition to inner level of launch with System Issue',
  },
  TI_TOOLTIP: {
    category: LAUNCHES_PAGE,
    action: 'Click on Tooltip "To Investigate"',
    label: 'Transition to inner level of launch with To Investigate',
  },
  CLICK_SELECT_ALL_ICON: {
    category: LAUNCHES_PAGE,
    action: 'Click on item icon "select all launches"',
    label: 'Select/unselect all launches',
  },
  CLICK_SELECT_ONE_ITEM: {
    category: LAUNCHES_PAGE,
    action: 'Click on item icon "select one launch"',
    label: 'Select/unselect one launch',
  },
  CLICK_ACTIONS_BTN: {
    category: LAUNCHES_PAGE,
    action: 'Click on button Actions',
    label: 'Arise Dropdown with list of actions',
  },
  CLICK_MERGE_ACTION: {
    category: LAUNCHES_PAGE,
    action: 'Click on button "Merge" in list of actions',
    label: 'Arise Modal "Merge Launches"',
  },
  CLICK_EDIT_LAUNCH_ACTION: {
    category: LAUNCHES_PAGE,
    action: 'Click on button "Edit" in list of actions',
    label: 'Edit Launch/Arise Modal "Edit Launch"',
  },
  CLICK_EDIT_LAUNCHES_ACTION: {
    category: LAUNCHES_PAGE,
    action: 'Click on button "Edit" in list of actions',
    label: 'Arise Modal "Edit launches" in a bulk',
  },
  CLICK_COMPARE_ACTION: {
    category: LAUNCHES_PAGE,
    action: 'Click on button "Compare" in list of actions',
    label: 'Arise Modal "Compare Launches"',
  },
  CLICK_MOVE_TO_DEBUG_ACTION: {
    category: LAUNCHES_PAGE,
    action: 'Click on button "Move to Debug" in list of actions',
    label: 'Arise Modal "Move to Debug"',
  },
  CLICK_FORCE_FINISH_ACTION: {
    category: LAUNCHES_PAGE,
    action: 'Click on button "Force Finish" in list of actions',
    label: 'Force Finish',
  },
  CLICK_DELETE_ACTION: {
    category: LAUNCHES_PAGE,
    action: 'Click on button "Delete" in list of actions',
    label: 'Arise Modal "Delete Launch"',
  },
  CLICK_CLOSE_ICON_FROM_SELECTION: {
    category: LAUNCHES_PAGE,
    action: 'Click on Close Icon on Tag of Launch',
    label: 'Remove launch from  selection',
  },
  CLICK_CLOSE_ICON_ALL_SELECTION: {
    category: LAUNCHES_PAGE,
    action: 'Click on Close Icon of all selection',
    label: 'Unselect all launches',
  },
  CLICK_PROCEED_ITEMS_BUTTON: {
    category: LAUNCHES_PAGE,
    action: 'Click on button "Proceed Valid Items"',
    label: 'Remove invalid launches from selection',
  },
  CLICK_ALL_LAUNCHES_DROPDOWN: {
    category: LAUNCHES_PAGE,
    action: 'Click on All Launches dropdown icon',
    label: 'Arise dropdown',
  },
  SELECT_ALL_LAUNCHES: {
    category: LAUNCHES_PAGE,
    action: 'Select All Launches on dropdown',
    label: 'Transition to All Launches',
  },
  SELECT_LATEST_LAUNCHES: {
    category: LAUNCHES_PAGE,
    action: 'Select Latest Launches in dropdown',
    label: 'Transition to Latest Launches',
  },
  CLICK_IMPORT_BTN: {
    category: LAUNCHES_PAGE,
    action: 'Click on Btn Import',
    label: 'Arise Modul Import Launch',
  },
  ADD_NEW_WIDGET_BTN: {
    category: LAUNCHES_PAGE,
    action: 'Click on Btn Add New Widget on Dashboard',
    label: 'Arise Modal Add New Widget',
  },
};

export const LAUNCHES_MODAL_EVENTS = {
  // EDIT_ITEMS_MODAL
  EDIT_ITEMS_MODAL_EVENTS: getEditItemsModalEvents(LAUNCHES_PAGE, 'Launch'),
  CLOSE_ICON_MOVE_MODAL: {
    category: LAUNCHES_MODAL,
    action: 'Click on Close Icon on Modal "Move to Debug"',
    label: 'Close modal "Move to Debug"',
  },
  CLICK_CANCEL_BTN_MOVE_MODAL: {
    category: LAUNCHES_MODAL,
    action: 'Click on Btn Cancel on Modal "Move to Debug"',
    label: 'Close modal "Move to Debug"',
  },
  CLICK_MOVE_BTN_MOVE_MODAL: {
    category: LAUNCHES_MODAL,
    action: 'Click on Btn Move on Modal "Move to Debug"',
    label: 'Save changes "Move to Debug"',
  },
  CLOSE_ICON_DELETE_MODAL: {
    category: LAUNCHES_MODAL,
    action: 'Click on Close Icon on Modal "Delete Launch"',
    label: 'Close modal "Delete Launch"',
  },
  CANCEL_BTN_DELETE_MODAL: {
    category: LAUNCHES_MODAL,
    action: 'Click on Btn Cancel on Modal "Delete Launch"',
    label: 'Close modal "Delete Launch"',
  },
  DELETE_BTN_DELETE_MODAL: {
    category: LAUNCHES_MODAL,
    action: 'Click on Btn Delete on Modal "Delete Launch"',
    label: 'Delete launch mentioned in modal "Delete Launch"',
  },
  CLOSE_ICON_MERGE_MODAL: {
    category: LAUNCHES_MODAL,
    action: 'Click on Close Icon on Modal "Merge Launches"',
    label: 'Close modal "Merge Launches"',
  },
  CANCEL_BTN_MERGE_MODAL: {
    category: LAUNCHES_MODAL,
    action: 'Click on Btn Cancel on Modal "Merge Launches"',
    label: 'Close modal "Merge Launches"',
  },
  MERGE_BTN_MERGE_MODAL: {
    category: LAUNCHES_MODAL,
    action: 'Click on Btn Merge on Modal "Merge Launches"',
    label: 'Merge launches mentioned in modal "Merge Launches"',
  },
  CLOSE_ICON_IMPORT_MODAL: {
    category: LAUNCHES_MODAL,
    action: 'Click on Close Icon on Modal "Import Launch"',
    label: 'Close Modal Import Launch',
  },
  CANCEL_BTN_IMPORT_MODAL: {
    category: LAUNCHES_MODAL,
    action: 'Click on Btn Cancel on Modal "Import Launch"',
    label: 'Close Modal Import Launch',
  },
  OK_BTN_IMPORT_MODAL: {
    category: LAUNCHES_MODAL,
    action: 'Click on Btn Ok on Modal "Import Launch"',
    label: 'Import Launch',
  },
  LINEAR_MERGE_BTN_MERGE_MODAL: {
    category: LAUNCHES_MODAL,
    action: 'Click on Btn Linear Merge on Modal "Merge Launches"',
    label: 'Linear Merge',
  },
  DEEP_MERGE_BTN_MERGE_MODAL: {
    category: LAUNCHES_MODAL,
    action: 'Click on Btn Deep Merge on Modal "Merge Launches"',
    label: 'Deep Merge',
  },
  OK_BTN_ANALYSIS_MODAL: {
    category: LAUNCHES_MODAL,
    action: 'Click on Btn Analyze on Modal "Analyze Launch"',
    label: 'Analyze launch mentioned in modal "Analyze Launch"',
  },
  CLOSE_BTN_ANALYSIS_MODAL: {
    category: LAUNCHES_MODAL,
    action: 'Click on Close Icon on Modal "Analyze Launch"',
    label: 'Close Analyze Launch Modal',
  },
  CANCEL_BTN_ANALYSIS_MODAL: {
    category: LAUNCHES_MODAL,
    action: 'Click on Btn Cancel on Modal "Analyze Launch"',
    label: 'Cancel Modal "Analyze Launch"',
  },
  OK_BTN_PATTERN_ANALYSIS_MODAL: {
    category: LAUNCHES_MODAL,
    action: 'Click on Btn Analyze on Modal "Pattern Analyze Launch"',
    label: 'Analyze launch mentioned in modal "Pattern Analyze Launch"',
  },
  CLOSE_BTN_PATTERN_ANALYSIS_MODAL: {
    category: LAUNCHES_MODAL,
    action: 'Click on Close Icon on Modal "Pattern Analyze Launch"',
    label: 'Close Pattern Analyze Launch Modal',
  },
  CANCEL_BTN_PATTERN_ANALYSIS_MODAL: {
    category: LAUNCHES_MODAL,
    action: 'Click on Btn Cancel on Modal "Pattern Analyze Launch"',
    label: 'Cancel Modal "Pattern Analyze Launch"',
  },
  CLOSE_ICON_ADD_WIDGET_MODAL: {
    category: LAUNCHES_MODAL,
    action: 'Click on icon Close on Modal Add New Widget',
    label: 'Close Modal Add New Widget',
  },
  CHOOSE_WIDGET_TYPE_ADD_WIDGET_MODAL: {
    category: LAUNCHES_MODAL,
    action: 'Choose radio Btn of Widget type in Modal Add New Widget',
    label: 'Choose Widget type in Modal Add New Widget',
  },
  NEXT_STEP_ADD_WIDGET_MODAL: {
    category: LAUNCHES_MODAL,
    action: 'Click on Btn Next Step on Modal Add New Widget',
    label: 'Transition to Next Step on Modal Add New Widget',
  },
  PREVIOUS_STEP_ADD_WIDGET_MODAL: {
    category: LAUNCHES_MODAL,
    action: 'Click on Btn Previous Step on Modal Add New Widget',
    label: 'Transition to Previous Step in Modal Add New Widget',
  },
  ENTER_WIDGET_DESCRIPTION_ADD_WIDGET_MODAL: {
    category: LAUNCHES_MODAL,
    action: 'Enter Widget description in Modal Add New Widget',
    label: 'Widget description in Modal Add New Widget',
  },
  SHARE_WIDGET_ADD_WIDGET_MODAL: {
    category: LAUNCHES_MODAL,
    action: 'Click on Share Widget on/off in Modal Add New Widget',
    label: 'Share/unshare Widget',
  },
  ADD_BTN_ADD_WIDGET_MODAL: {
    category: LAUNCHES_MODAL,
    action: 'Click on Btn Add in Modal Add New Widget',
    label: 'Submit changes in filter in Modal Add New Widget',
  },
};
