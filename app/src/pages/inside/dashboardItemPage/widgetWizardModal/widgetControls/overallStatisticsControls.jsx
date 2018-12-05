import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getFormValues, initialize } from 'redux-form';
import { defectTypesSelector } from 'controllers/project';
import { FieldProvider } from 'components/fields/fieldProvider';
import { validate } from 'common/utils';
import { injectIntl, defineMessages, intlShape } from 'react-intl';
import { getWidgetCriteriaOptions } from './utils/getWidgetCriteriaOptions';
import { getWidgetModeOptions } from './utils/getWidgetModeOptions';
import {
  LAUNCH_STATUSES_OPTIONS,
  DEFECT_TYPES_OPTIONS,
  ITEMS_INPUT_WIDTH,
  CHART_MODES,
} from './constants';
import { FiltersControl, DropdownControl, InputControl, TogglerControl } from './controls';
import { WIDGET_WIZARD_FORM } from '../widgetWizardContent/wizardControlsSection/constants';

const DEFAULT_ITEMS_COUNT = '50';
const messages = defineMessages({
  CriteriaFieldLabel: {
    id: 'OverallStatisticsControls.CriteriaFieldLabel',
    defaultMessage: 'Criteria for widget',
  },
  ItemsFieldLabel: {
    id: 'OverallStatisticsControls.ItemsFieldLabel',
    defaultMessage: 'Items',
  },
  ItemsValidationError: {
    id: 'OverallStatisticsControls.ItemsValidationError',
    defaultMessage: 'Items count should have value from 1 to 150',
  },
  ContentFieldsValidationError: {
    id: 'OverallStatisticsControls.ContentFieldsValidationError',
    defaultMessage: 'You must select at least one item',
  },
});
const validators = {
  items: (formatMessage) => (value) =>
    (!value || !validate.inRangeValidate(value, 1, 150)) &&
    formatMessage(messages.ItemsValidationError),
  contentFields: (formatMessage) => (value) =>
    (!value || !value.length) && formatMessage(messages.ContentFieldsValidationError),
};

@injectIntl
@connect(
  (state) => ({
    widgetSettings: getFormValues(WIDGET_WIZARD_FORM)(state),
    defectTypes: defectTypesSelector(state),
  }),
  {
    initializeWizardSecondStepForm: (data) =>
      initialize(WIDGET_WIZARD_FORM, data, true, { keepValues: true }),
  },
)
export class OverallStatisticsControls extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    defectTypes: PropTypes.object.isRequired,
    widgetSettings: PropTypes.object.isRequired,
    initializeWizardSecondStepForm: PropTypes.func.isRequired,
    formAppearance: PropTypes.object.isRequired,
    onFormAppearanceChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    formAppearance: {},
    onFormAppearanceChange: () => {},
  };

  constructor(props) {
    super(props);
    const { intl, widgetSettings, defectTypes, initializeWizardSecondStepForm } = props;
    this.criteria = getWidgetCriteriaOptions(
      [LAUNCH_STATUSES_OPTIONS, DEFECT_TYPES_OPTIONS],
      intl.formatMessage,
      { defectTypes },
    );
    initializeWizardSecondStepForm({
      contentParameters: widgetSettings.contentParameters || {
        contentFields: this.criteria.map((criteria) => criteria.value),
        itemsCount: DEFAULT_ITEMS_COUNT,
        widgetOptions: {
          viewMode: CHART_MODES.PANEL_VIEW,
          mode: CHART_MODES.ALL_LAUNCHES,
        },
      },
    });
  }

  parseItems = (value) =>
    value.length < 4 ? value : this.props.widgetSettings.contentParameters.itemsCount;

  formatFilterValue = (value) => value && value[0];
  parseFilterValue = (value) => value && [value];

  render() {
    const {
      intl: { formatMessage },
      formAppearance,
      onFormAppearanceChange,
    } = this.props;

    return (
      <Fragment>
        <FieldProvider
          name="filterIds"
          parse={this.parseFilterValue}
          format={this.formatFilterValue}
        >
          <FiltersControl
            formAppearance={formAppearance}
            onFormAppearanceChange={onFormAppearanceChange}
          />
        </FieldProvider>
        {!formAppearance.mode && (
          <Fragment>
            <FieldProvider
              name="contentParameters.contentFields"
              validate={validators.contentFields(formatMessage)}
            >
              <DropdownControl
                fieldLabel={formatMessage(messages.CriteriaFieldLabel)}
                multiple
                selectAll
                options={this.criteria}
              />
            </FieldProvider>
            <FieldProvider
              name="contentParameters.itemsCount"
              validate={validators.items(formatMessage)}
              parse={this.parseItems}
            >
              <InputControl
                fieldLabel={formatMessage(messages.ItemsFieldLabel)}
                inputWidth={ITEMS_INPUT_WIDTH}
                type="number"
              />
            </FieldProvider>
            <FieldProvider name="contentParameters.widgetOptions.viewMode">
              <TogglerControl
                fieldLabel=" "
                items={getWidgetModeOptions(
                  [CHART_MODES.PANEL_VIEW, CHART_MODES.DONUT_VIEW],
                  formatMessage,
                )}
              />
            </FieldProvider>
            <FieldProvider name="contentParameters.widgetOptions.mode">
              <TogglerControl
                fieldLabel=" "
                items={getWidgetModeOptions(
                  [CHART_MODES.ALL_LAUNCHES, CHART_MODES.LATEST_LAUNCHES],
                  formatMessage,
                )}
              />
            </FieldProvider>
          </Fragment>
        )}
      </Fragment>
    );
  }
}
