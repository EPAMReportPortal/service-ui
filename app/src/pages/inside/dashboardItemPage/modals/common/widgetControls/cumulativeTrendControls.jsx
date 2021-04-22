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
import classNames from 'classnames/bind';
import { injectIntl, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import { FieldArray } from 'redux-form';
import {
  validate,
  bindMessageToValidator,
  composeBoundValidators,
  commonValidators,
} from 'common/utils/validation';
import { URLS } from 'common/urls';
import {
  STATS_FAILED,
  STATS_PASSED,
  STATS_SKIPPED,
  STATS_UNTESTED,
} from 'common/constants/statistics';
import { FieldProvider } from 'components/fields/fieldProvider';
import { DEFAULT_LAUNCHES_LIMIT } from 'controllers/testItem';
import { activeProjectSelector } from 'controllers/user';
import {
  FiltersControl,
  InputControl,
  TogglerControl,
  AttributesFieldArrayControl,
} from './controls';
import { getWidgetCriteriaOptions } from './utils/getWidgetCriteriaOptions';
import { DEFECT_STATISTICS_OPTIONS, TO_INVESTIGATE_OPTION, ITEMS_INPUT_WIDTH } from './constants';
import styles from './widgetControls.scss';

const cx = classNames.bind(styles);

const MAX_ATTRIBUTES_AMOUNT = 2;
const STATIC_CONTENT_FIELDS = [STATS_FAILED, STATS_SKIPPED, STATS_PASSED, STATS_UNTESTED];

const messages = defineMessages({
  CriteriaFieldLabel: {
    id: 'CumulativeTrendControls.CriteriaFieldLabel',
    defaultMessage: 'Criteria for widget',
  },
  LaunchesLimitFieldLabel: {
    id: 'CumulativeTrendControls.LaunchesLimitFieldLabel',
    defaultMessage: 'Number of launches',
  },
  attributesTitle: {
    id: 'CumulativeTrendControls.attributesTitle',
    defaultMessage: 'Add attributes',
  },
  LaunchesLimitValidationError: {
    id: 'CumulativeTrendControls.LaunchesLimitValidationError',
    defaultMessage: 'Items count should have value from 1 to 20000',
  },
  attributeKeyFieldLabelOverview: {
    id: 'CumulativeTrendControls.attributeKeyFieldLabelOverview',
    defaultMessage: '(overview)',
  },
  attributeKeyFieldLabelDetailedView: {
    id: 'CumulativeTrendControls.attributeKeyFieldLabelDetailedView',
    defaultMessage: '(detailed view)',
  },
  attributesArrayValidationError: {
    id: 'CumulativeTrendControls.attributesArrayValidationError',
    defaultMessage:
      'Enter an attribute key whose unique values will be used for combine launches into groups',
  },
});

const itemsValidator = (formatMessage) =>
  bindMessageToValidator(
    validate.cumulativeItemsValidation,
    formatMessage(messages.LaunchesLimitValidationError),
  );
const attributeKeyValidator = (formatMessage) => (attributes) =>
  composeBoundValidators([
    bindMessageToValidator(
      validate.required,
      formatMessage(messages.attributesArrayValidationError),
    ),
    commonValidators.attributeKey,
    commonValidators.uniqueAttributeKey(attributes),
  ]);

@connect((state) => ({
  activeProject: activeProjectSelector(state),
}))
@injectIntl
export class CumulativeTrendControls extends Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    widgetSettings: PropTypes.object.isRequired,
    initializeControlsForm: PropTypes.func.isRequired,
    formAppearance: PropTypes.object.isRequired,
    onFormAppearanceChange: PropTypes.func.isRequired,
    activeProject: PropTypes.string.isRequired,
    eventsInfo: PropTypes.object,
  };

  static defaultProps = {
    eventsInfo: {},
  };

  constructor(props) {
    super(props);
    const { intl, widgetSettings, initializeControlsForm } = props;

    this.criteria = getWidgetCriteriaOptions(
      [DEFECT_STATISTICS_OPTIONS, TO_INVESTIGATE_OPTION],
      intl.formatMessage,
    );

    initializeControlsForm({
      contentParameters: widgetSettings.contentParameters || {
        itemsCount: DEFAULT_LAUNCHES_LIMIT,
        contentFields: this.parseContentFields(this.criteria),
        widgetOptions: {
          attributes: [],
        },
      },
    });
  }

  tabItems = [
    {
      value: '1',
      label: 'All launches',
    },
    {
      value: '2',
      label: 'Latest Launches',
    },
  ];

  parseContentFields = (criteries) => {
    const data =
      criteries &&
      STATIC_CONTENT_FIELDS.concat(
        criteries
          .map((criteria) => criteria.value || criteria)
          .reduce((acc, val) => acc.concat(val), []),
      );

    return criteries ? data : this.props.widgetSettings.contentParameters.contentFields;
  };

  normalizeValue = (value) => value && `${value}`.replace(/\D+/g, '');

  formatFilterValue = (value) => value && value[0];
  parseFilterValue = (value) => value && [value];

  renderAttributesFieldArray = ({ fields, fieldValidator }) => (
    <AttributesFieldArrayControl
      fields={fields}
      fieldValidator={fieldValidator}
      maxAttributesAmount={MAX_ATTRIBUTES_AMOUNT}
      getURI={URLS.launchAttributeKeysSearch(this.props.activeProject)}
      attributeKeyFieldViewLabels={[
        this.props.intl.formatMessage(messages.attributeKeyFieldLabelOverview),
        this.props.intl.formatMessage(messages.attributeKeyFieldLabelDetailedView),
      ]}
    />
  );

  render() {
    const {
      intl: { formatMessage },
      formAppearance,
      onFormAppearanceChange,
      eventsInfo,
    } = this.props;

    return (
      <Fragment>
        <FieldProvider name="filters" parse={this.parseFilterValue} format={this.formatFilterValue}>
          <FiltersControl
            formAppearance={formAppearance}
            onFormAppearanceChange={onFormAppearanceChange}
            eventsInfo={eventsInfo}
          />
        </FieldProvider>

        {!formAppearance.isMainControlsLocked && (
          <Fragment>
            <TogglerControl disabled fieldLabel=" " items={this.tabItems} value="2" />

            <FieldProvider
              name="contentParameters.itemsCount"
              validate={itemsValidator(formatMessage)}
              format={String}
              normalize={this.normalizeValue}
            >
              <InputControl
                fieldLabel={formatMessage(messages.LaunchesLimitFieldLabel)}
                inputWidth={ITEMS_INPUT_WIDTH}
                maxLength="6"
                hintType={'top-right'}
              />
            </FieldProvider>

            <div className={cx('attr-header')}>{formatMessage(messages.attributesTitle)}</div>
            <FieldArray
              name="contentParameters.widgetOptions.attributes"
              component={this.renderAttributesFieldArray}
              fieldValidator={attributeKeyValidator(formatMessage)}
            />
          </Fragment>
        )}
      </Fragment>
    );
  }
}
