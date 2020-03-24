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
import moment from 'moment';
import Parser from 'html-react-parser';
import { reduxForm, formValueSelector } from 'redux-form';
import { GhostButton } from 'components/buttons/ghostButton';
import { BigButton } from 'components/buttons/bigButton';
import { NavigationTabs } from 'components/main/navigationTabs';
import { NoCasesBlock } from 'components/main/noCasesBlock';
import { ItemList } from 'components/main/itemList';
import { ModalLayout, ModalField } from 'components/main/modal';
import { showModalAction } from 'controllers/modal';
import { fetch } from 'common/utils/fetch';
import { activeProjectSelector, activeProjectRoleSelector } from 'controllers/user';
import { PLUGIN_UI_EXTENSION_ADMIN_PAGE, pluginRouteSelector } from 'controllers/pages';
import PlusIcon from 'common/img/plus-button-inline.svg';
import RemoveIcon from 'common/img/trashcan-inline.svg';
import CrossIcon from 'common/img/cross-icon-inline.svg';
import ErrorIcon from 'common/img/error-inline.svg';
import { Input } from 'components/inputs/input';
import { InputDropdown } from 'components/inputs/inputDropdown';
import { URLS } from 'common/urls';
import { showSuccessNotification, showErrorNotification } from 'controllers/notification';
import { SpinningPreloader } from 'components/preloaders/spinningPreloader';
import { FieldProvider } from 'components/fields/fieldProvider';
import { FieldErrorHint } from 'components/fields/fieldErrorHint';
import { projectMembersSelector, projectInfoSelector } from 'controllers/project';
import { createGlobalNamedIntegrationsSelector } from '../selectors';

export const createImportProps = (pluginName) => ({
  lib: { React, useSelector, useDispatch, moment, Parser, reduxForm, formValueSelector },
  components: {
    GhostButton,
    BigButton,
    NavigationTabs,
    NoCasesBlock,
    ItemList,
    SpinningPreloader,
    ModalLayout,
    ModalField,
    FieldProvider,
    FieldErrorHint,
    Input,
    InputDropdown,
  },
  constants: { PLUGIN_UI_EXTENSION_ADMIN_PAGE },
  actions: { showModalAction, showSuccessNotification, showErrorNotification },
  selectors: {
    pluginRouteSelector,
    activeProjectSelector,
    globalIntegrationsSelector: createGlobalNamedIntegrationsSelector(pluginName),
    projectMembersSelector,
    projectInfoSelector,
    activeProjectRoleSelector,
  },
  icons: { PlusIcon, RemoveIcon, CrossIcon, ErrorIcon },
  utils: { fetch, URLS },
});
