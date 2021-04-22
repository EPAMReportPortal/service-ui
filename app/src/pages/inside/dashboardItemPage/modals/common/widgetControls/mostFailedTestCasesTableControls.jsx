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
import { FieldProvider } from 'components/fields/fieldProvider';
import { activeProjectSelector } from 'controllers/user';
import { injectIntl, defineMessages } from 'react-intl';
import { URLS } from 'common/urls';
import { validate, bindMessageToValidator } from 'common/utils/validation';
import { getWidgetCriteriaOptions } from './utils/getWidgetCriteriaOptions';
import {
  SKIPPED_FAILED_UNTESTED_LAUNCHES_OPTIONS,
  DEFECT_STATISTICS_OPTIONS,
  ITEMS_INPUT_WIDTH,
} from './constants';
import { DropdownControl, InputControl, TagsControl, CheckboxControl } from './controls';

const DEFAULT_ITEMS_COUNT = '30';
const messages = defineMessages({
  CriteriaFieldLabel: {
    id: 'MostFailedTestCasesTableControls.CriteriaFieldLabel',
    defaultMessage: 'Criteria for widget',
  },
  ItemsFieldLabel: {
    id: 'MostFailedTestCasesTableControls.ItemsFieldLabel',
    defaultMessage: 'Launches count',
  },
  LaunchNameFieldLabel: {
    id: 'MostFailedTestCasesTableControls.LaunchNameFieldLabel',
    defaultMessage: 'Launch name',
  },
  LaunchNamePlaceholder: {
    id: 'MostFailedTestCasesTableControls.LaunchNamePlaceholder',
    defaultMessage: 'Enter launch name',
  },
  IncludeMethodsControlText: {
    id: 'MostFailedTestCasesTableControls.IncludeMethodsControlText',
    defaultMessage: 'Include Before and After methods',
  },
  ItemsValidationError: {
    id: 'MostFailedTestCasesTableControls.ItemsValidationError',
    defaultMessage: 'Items count should have value from 2 to 600',
  },
  LaunchNamesValidationError: {
    id: 'MostFailedTestCasesTableControls.LaunchNamesValidationError',
    defaultMessage: 'You must select at least one item',
  },
});
const validators = {
  items: (message) => bindMessageToValidator(validate.mostFailedWidgetNumberOfLaunches, message),
  launchNames: (message) => bindMessageToValidator(validate.isNotEmptyArray, message),
};

@injectIntl
@connect((state) => ({
  activeProject: activeProjectSelector(state),
}))
export class MostFailedTestCasesTableControls extends Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    widgetSettings: PropTypes.object.isRequired,
    activeProject: PropTypes.string.isRequired,
    initializeControlsForm: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    const { intl, widgetSettings, initializeControlsForm } = props;
    this.criteria = getWidgetCriteriaOptions(
      [SKIPPED_FAILED_UNTESTED_LAUNCHES_OPTIONS, DEFECT_STATISTICS_OPTIONS],
      intl.formatMessage,
    );
    initializeControlsForm({
      contentParameters: widgetSettings.contentParameters || {
        contentFields: [this.criteria[0].value],
        itemsCount: DEFAULT_ITEMS_COUNT,
        widgetOptions: {
          includeMethods: false,
          launchNameFilter: false,
        },
      },
      filters: [],
    });
  }

  formatContentFields = (value) => value[0];
  parseContentFields = (value) =>
    value ? [value] : this.props.widgetSettings.contentParameters.contentFields;

  normalizeValue = (value) => value && `${value}`.replace(/\D+/g, '');

  formatFilterValue = (value) => value && value[0];
  parseFilterValue = (value) => value && [value];

  render() {
    const {
      intl: { formatMessage },
      activeProject,
    } = this.props;

    return (
      <Fragment>
        <FieldProvider
          name="contentParameters.contentFields"
          format={this.formatContentFields}
          parse={this.parseContentFields}
        >
          <DropdownControl
            fieldLabel={formatMessage(messages.CriteriaFieldLabel)}
            options={this.criteria}
          />
        </FieldProvider>
        <FieldProvider
          name="contentParameters.itemsCount"
          validate={validators.items(formatMessage(messages.ItemsValidationError))}
          format={String}
          normalize={this.normalizeValue}
        >
          <InputControl
            fieldLabel={formatMessage(messages.ItemsFieldLabel)}
            inputWidth={ITEMS_INPUT_WIDTH}
            maxLength="3"
          />
        </FieldProvider>
        <FieldProvider
          name="contentParameters.widgetOptions.launchNameFilter"
          validate={validators.launchNames(formatMessage(messages.LaunchNamesValidationError))}
        >
          <TagsControl
            fieldLabel={formatMessage(messages.LaunchNameFieldLabel)}
            placeholder={formatMessage(messages.LaunchNamePlaceholder)}
            minLength={3}
            maxLength={256}
            getURI={URLS.launchNameSearch(activeProject)}
          />
        </FieldProvider>
        <FieldProvider name="contentParameters.widgetOptions.includeMethods">
          <CheckboxControl
            fieldLabel=" "
            text={formatMessage(messages.IncludeMethodsControlText)}
          />
        </FieldProvider>
      </Fragment>
    );
  }
}
