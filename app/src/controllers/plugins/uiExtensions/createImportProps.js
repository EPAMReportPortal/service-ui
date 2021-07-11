/*
 * Copyright 2020 EPAM Systems
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
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';
import moment from 'moment';
import Parser from 'html-react-parser';
import {
  reduxForm,
  FieldArray,
  formValueSelector,
  getFormValues,
  destroy,
  change,
} from 'redux-form';
import Link from 'redux-first-router-link';
import { GhostButton } from 'components/buttons/ghostButton';
import { BigButton } from 'components/buttons/bigButton';
import { NavigationTabs } from 'components/main/navigationTabs';
import { NoCasesBlock } from 'components/main/noCasesBlock';
import { ItemList } from 'components/main/itemList';
import { ModalLayout, ModalField } from 'components/main/modal';
import { showModalAction, hideModalAction } from 'controllers/modal';
import { fetch } from 'common/utils/fetch';
import { isEmptyObject } from 'common/utils/isEmptyObject';
import {
  STATS_PB_TOTAL,
  STATS_AB_TOTAL,
  STATS_ND_TOTAL,
  STATS_SI_TOTAL,
  STATS_TI_TOTAL,
} from 'common/constants/statistics';
import { PASSED, FAILED, INTERRUPTED, SKIPPED } from 'common/constants/testStatuses';
import {
  activeProjectSelector,
  activeProjectRoleSelector,
  isAdminSelector,
} from 'controllers/user';
import {
  PLUGIN_UI_EXTENSION_ADMIN_PAGE,
  PROJECT_SETTINGS_TAB_PAGE,
  pluginRouteSelector,
} from 'controllers/pages';
import { attributesArray, isNotEmptyArray } from 'common/utils/validation/validate';
import {
  requiredField,
  btsUrl,
  btsProject,
  btsIntegrationName,
} from 'common/utils/validation/commonValidators';
import {
  composeValidators,
  bindMessageToValidator,
} from 'common/utils/validation/validatorHelpers';
import RefreshIcon from 'common/img/refresh-inline.svg';
import PlusIcon from 'common/img/plus-button-inline.svg';
import RemoveIcon from 'common/img/trashcan-inline.svg';
import CrossIcon from 'common/img/cross-icon-inline.svg';
import ErrorIcon from 'common/img/error-inline.svg';
import ExportIcon from 'common/img/export-inline.svg';
import ArrowIcon from 'common/img/arrow-down-inline.svg';
import CircleCrossIcon from 'common/img/circle-cross-icon-inline.svg';
import CircleCheckIcon from 'common/img/circle-check-inline.svg';
import PencilIcon from 'common/img/pencil-empty-inline.svg';
import { Input } from 'components/inputs/input';
import { InputDropdown } from 'components/inputs/inputDropdown';
import { InputRadio } from 'components/inputs/inputRadio';
import { URLS } from 'common/urls';
import { isEmailIntegrationAvailableSelector } from 'controllers/plugins';
import { showScreenLockAction, hideScreenLockAction } from 'controllers/screenLock';
import { showSuccessNotification, showErrorNotification } from 'controllers/notification';
import { SpinningPreloader } from 'components/preloaders/spinningPreloader';
import { FieldProvider } from 'components/fields/fieldProvider';
import { FieldErrorHint } from 'components/fields/fieldErrorHint';
import { SimpleBreadcrumbs } from 'components/main/simpleBreadcrumbs';
import {
  projectMembersSelector,
  projectInfoSelector,
  projectAttributesSelector,
  fetchProjectAction,
  projectInfoLoadingSelector,
  defectTypesSelector,
  updateConfigurationAttributesAction,
} from 'controllers/project';
import { statisticsLinkSelector, defectLinkSelector } from 'controllers/testItem';
import { Grid } from 'components/main/grid';
import { InputCheckbox } from 'components/inputs/inputCheckbox';
import { AttributeListField } from 'components/main/attributeList';
import { AsyncAutocomplete } from 'components/inputs/autocompletes/asyncAutocomplete';
import { InputSearch } from 'components/inputs/inputSearch';
import { PaginationToolbar } from 'components/main/paginationToolbar';
import { ProjectName } from 'pages/admin/projectsPage/projectName';
import { debounce } from 'common/utils/debounce';
import { DotsMenuButton } from 'components/buttons/dotsMenuButton';
import { GhostMenuButton } from 'components/buttons/ghostMenuButton';
import { MultiActionButton } from 'components/buttons/multiActionButton';
import { ToggleButton } from 'components/buttons/toggleButton';
import { SingleAutocomplete } from 'components/inputs/autocompletes/singleAutocomplete';
import { MultipleAutocomplete } from 'components/inputs/autocompletes/multipleAutocomplete';
import { WithAsyncLoading } from 'components/inputs/autocompletes/withAsyncLoading';
import { InputBigSwitcher } from 'components/inputs/inputBigSwitcher';
import { InputDropdownSorting } from 'components/inputs/inputDropdownSorting';
import { InputSlider } from 'components/inputs/inputSlider';
import { InputRadioGroup } from 'components/inputs/inputRadioGroup';
import { InputSwitcher } from 'components/inputs/inputSwitcher';
import { InputTextArea } from 'components/inputs/inputTextArea';
import { InputTimeDateRange, InputTimeDateRangeMenu } from 'components/inputs/inputTimeDateRange';
import { ScrollWrapper } from 'components/main/scrollWrapper';
import { AbsRelTime } from 'components/main/absRelTime';
import { StripedMessage } from 'components/main/stripedMessage';
import { MarkdownEditor, MarkdownViewer } from 'components/main/markdown';
import { DependentFieldsControl } from 'components/main/dependentFieldsControl';
import { SidebarButton } from 'components/buttons/sidebarButton';
import { GeneralTab } from 'pages/common/settingsPage/generalTab';
import { RuleList, ItemContent } from 'pages/common/settingsPage/ruleList';
import { RuleListHeader } from 'pages/common/settingsPage/ruleListHeader';
import { getGroupedDefectTypesOptions } from 'pages/inside/dashboardItemPage/modals/common/widgetControls/utils/getWidgetCriteriaOptions';
import { DEFECT_TYPES_SEQUENCE, TO_INVESTIGATE } from 'common/constants/defectTypes';
import {
  getDefaultTestItemLinkParams,
  getItemNameConfig,
  getDefectTypeLocators,
} from 'components/widgets/common/utils';
import {
  IntegrationSettings,
  IntegrationFormField,
  BtsAuthFieldsInfo,
  BtsPropertiesForIssueForm,
} from 'components/integrations/elements';
import { createGlobalNamedIntegrationsSelector } from '../selectors';

const BUTTONS = {
  GhostButton,
  BigButton,
  ToggleButton,
  DotsMenuButton,
  GhostMenuButton,
  MultiActionButton,
  SidebarButton,
};

const INPUTS = {
  Input,
  InputDropdown,
  InputRadio,
  InputRadioGroup,
  InputBigSwitcher,
  InputDropdownSorting,
  InputSearch,
  InputSlider,
  InputSwitcher,
  InputTextArea,
  InputTimeDateRange,
  InputTimeDateRangeMenu,
  InputCheckbox,
  SingleAutocomplete,
  MultipleAutocomplete,
  WithAsyncLoading,
};

export const createImportProps = (pluginName) => ({
  lib: {
    React,
    useSelector,
    useDispatch,
    useIntl,
    moment,
    Parser,
    reduxForm,
    formValueSelector,
    getFormValues,
    destroy,
    change,
  },
  components: {
    ...BUTTONS,
    ...INPUTS,
    NavigationTabs,
    NoCasesBlock,
    ItemList,
    SpinningPreloader,
    ModalLayout,
    ModalField,
    FieldProvider,
    FieldErrorHint,
    SimpleBreadcrumbs,
    Link,
    Grid,
    PaginationToolbar,
    ProjectName,
    ScrollWrapper,
    AbsRelTime,
    MarkdownEditor,
    MarkdownViewer,
    GeneralTab,
    RuleList,
    RuleListHeader,
    ItemContent,
    StripedMessage,
    AttributeListField,
    AsyncAutocomplete,
    DependentFieldsControl,
    FieldArray,
    IntegrationSettings,
    IntegrationFormField,
    BtsAuthFieldsInfo,
    BtsPropertiesForIssueForm,
  },
  constants: {
    PLUGIN_UI_EXTENSION_ADMIN_PAGE,
    PROJECT_SETTINGS_TAB_PAGE,
    DEFECT_TYPES_SEQUENCE,
    TO_INVESTIGATE,
    STATS_PB_TOTAL,
    STATS_AB_TOTAL,
    STATS_ND_TOTAL,
    STATS_SI_TOTAL,
    STATS_TI_TOTAL,
    PASSED,
    FAILED,
    INTERRUPTED,
    SKIPPED,
  },
  actions: {
    showModalAction,
    hideModalAction,
    showSuccessNotification,
    showErrorNotification,
    fetchProjectAction,
    showScreenLockAction,
    hideScreenLockAction,
    updateConfigurationAttributesAction,
  },
  selectors: {
    pluginRouteSelector,
    activeProjectSelector,
    globalIntegrationsSelector: createGlobalNamedIntegrationsSelector(pluginName),
    projectMembersSelector,
    projectInfoSelector,
    projectAttributesSelector,
    activeProjectRoleSelector,
    projectInfoLoadingSelector,
    isEmailIntegrationAvailableSelector,
    isAdminSelector,
    defectTypesSelector,
    statisticsLinkSelector,
    defectLinkSelector,
  },
  icons: {
    PlusIcon,
    RemoveIcon,
    CrossIcon,
    ErrorIcon,
    ExportIcon,
    ArrowIcon,
    PencilIcon,
    CircleCheckIcon,
    CircleCrossIcon,
    RefreshIcon,
  },
  utils: {
    fetch,
    URLS,
    debounce,
    getGroupedDefectTypesOptions,
    isEmptyObject,
    getDefaultTestItemLinkParams,
    getItemNameConfig,
    getDefectTypeLocators,
  },
  validators: {
    attributesArray,
    isNotEmptyArray,
    requiredField,
    btsUrl,
    btsProject,
    btsIntegrationName,
    helpers: { composeValidators, bindMessageToValidator },
  },
});
