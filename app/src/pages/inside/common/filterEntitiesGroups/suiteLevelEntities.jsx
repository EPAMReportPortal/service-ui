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

import { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, defineMessages } from 'react-intl';
import PropTypes from 'prop-types';
import { URLS } from 'common/urls';
import { activeProjectSelector } from 'controllers/user';
import { commonValidators } from 'common/utils/validation';
import {
  STATS_TOTAL,
  STATS_FAILED,
  STATS_PASSED,
  STATS_SKIPPED,
  STATS_UNTESTED,
} from 'common/constants/statistics';
import { DEFECT_TYPES_SEQUENCE, NO_DEFECT } from 'common/constants/defectTypes';
import {
  EntityInputConditional,
  EntityItemStartTime,
  EntityInputConditionalTags,
} from 'components/filterEntities';
import { bindDefaultValue } from 'components/filterEntities/utils';
import {
  CONDITION_CNT,
  CONDITION_GREATER_EQ,
  CONDITION_BETWEEN,
  CONDITION_HAS,
  ENTITY_NAME,
  ENTITY_START_TIME,
  ENTITY_DESCRIPTION,
  ENTITY_ATTRIBUTE_KEYS,
  ENTITY_ATTRIBUTE_VALUES,
  CONDITION_LESS_EQ,
  CONDITION_EQ,
} from 'components/filterEntities/constants';
import { defectTypesSelector } from 'controllers/project';
import { launchIdSelector } from 'controllers/pages';
import { SUITES_PAGE_EVENTS } from 'components/main/analytics/events';

const messages = defineMessages({
  NameTitle: {
    id: 'SuiteLevelEntities.NameTitle',
    defaultMessage: 'Suite name',
  },
  DescriptionTitle: {
    id: 'SuiteLevelEntities.DescriptionTitle',
    defaultMessage: 'Description',
  },
  StartTimeTitle: {
    id: 'SuiteLevelEntities.StartTimeTitle',
    defaultMessage: 'Start time',
  },
  AttributeKeysTitle: {
    id: 'LaunchLevelEntities.AttributeKeysTitle',
    defaultMessage: 'Attribute keys',
  },
  AttributeValuesTitle: {
    id: 'LaunchLevelEntities.AttributeValuesTitle',
    defaultMessage: 'Attribute values',
  },
  TotalTitle: {
    id: 'SuiteLevelEntities.TotalTitle',
    defaultMessage: 'Total',
  },
  PassedTitle: {
    id: 'SuiteLevelEntities.PassedTitle',
    defaultMessage: 'Passed',
  },
  UntestedTitle: {
    id: 'SuiteLevelEntities.UntestedTitle',
    defaultMessage: 'Untested',
  },
  FailedTitle: {
    id: 'SuiteLevelEntities.FailedTitle',
    defaultMessage: 'Failed',
  },
  SkippedTitle: {
    id: 'SuiteLevelEntities.SkippedTitle',
    defaultMessage: 'Skipped',
  },
  PRODUCT_BUG_title: {
    id: 'SuiteLevelEntities.PRODUCT_BUG_title',
    defaultMessage: 'Product bug',
  },
  PRODUCT_BUG_totalTitle: {
    id: 'SuiteLevelEntities.PRODUCT_BUG_totalTitle',
    defaultMessage: 'Total product bugs',
  },
  AUTOMATION_BUG_title: {
    id: 'SuiteLevelEntities.AUTOMATION_BUG_title',
    defaultMessage: 'Automation bug',
  },
  AUTOMATION_BUG_totalTitle: {
    id: 'SuiteLevelEntities.AUTOMATION_BUG_totalTitle',
    defaultMessage: 'Total automation bugs',
  },
  SYSTEM_ISSUE_title: {
    id: 'SuiteLevelEntities.SYSTEM_ISSUE_title',
    defaultMessage: 'System issue',
  },
  SYSTEM_ISSUE_totalTitle: {
    id: 'SuiteLevelEntities.SYSTEM_ISSUE_totalTitle',
    defaultMessage: 'Total system issues',
  },
  TO_INVESTIGATE_title: {
    id: 'SuiteLevelEntities.TO_INVESTIGATE_title',
    defaultMessage: 'To investigate',
  },
  TO_INVESTIGATE_totalTitle: {
    id: 'SuiteLevelEntities.TO_INVESTIGATE_totalTitle',
    defaultMessage: 'Total to investigate',
  },
  NO_DEFECT_title: {
    id: 'SuiteLevelEntities.NO_DEFECT_title',
    defaultMessage: 'No defects',
  },
  NO_DEFECT_totalTitle: {
    id: 'SuiteLevelEntities.NO_DEFECT_totalTitle',
    defaultMessage: 'Total no defects',
  },
  LAUNCH_NUMBER_PLACEHOLDER: {
    id: 'SuiteLevelEntities.launchNumberPlaceholder',
    defaultMessage: 'Enter number',
  },
  DESCRIPTION_PLACEHOLDER: {
    id: 'SuiteLevelEntities.descriptionPlaceholder',
    defaultMessage: 'Enter description',
  },
  ATTRIBUTE_KEYS_PLACEHOLDER: {
    id: 'SuiteLevelEntities.entityItemAttributeKeys.placeholder',
    defaultMessage: 'Enter attribute keys',
  },
  ATTRIBUTE_VALUES_PLACEHOLDER: {
    id: 'SuiteLevelEntities.entityItemAttributeValues.placeholder',
    defaultMessage: 'Enter attribute values',
  },
  STATS_PLACEHOLDER: {
    id: 'SuiteLevelEntities.entityItemStatistics.placeholder',
    defaultMessage: 'Enter quantity',
  },
  SUITE_NAME_PLACEHOLDER: {
    id: 'SuiteLevelEntities.suiteName.placeholder',
    defaultMessage: 'Enter name',
  },
});

const DEFECT_ENTITY_ID_BASE = 'statistics$defects$';

@injectIntl
@connect((state) => ({
  defectTypes: defectTypesSelector(state),
  projectId: activeProjectSelector(state),
  launchId: launchIdSelector(state),
}))
export class SuiteLevelEntities extends Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    defectTypes: PropTypes.object.isRequired,
    filterValues: PropTypes.object,
    render: PropTypes.func.isRequired,
    projectId: PropTypes.string.isRequired,
    launchId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    visibleFilters: PropTypes.array,
  };
  static defaultProps = {
    filterValues: {},
    visibleFilters: [],
  };

  getStaticEntities = () => {
    const { intl, filterValues, projectId, launchId, visibleFilters } = this.props;
    return [
      {
        id: ENTITY_NAME,
        component: EntityInputConditional,
        value: this.bindDefaultValue(ENTITY_NAME, {
          condition: CONDITION_CNT,
        }),
        validationFunc: commonValidators.itemNameEntity,
        title: intl.formatMessage(messages.NameTitle),
        active: true,
        removable: false,
        static: true,
        eventInfo: SUITES_PAGE_EVENTS.REFINE_BY_NAME,
        customProps: {
          placeholder: intl.formatMessage(messages.SUITE_NAME_PLACEHOLDER),
        },
      },
      {
        id: ENTITY_START_TIME,
        component: EntityItemStartTime,
        value: this.bindDefaultValue(ENTITY_START_TIME, {
          value: '',
          condition: CONDITION_BETWEEN,
        }),
        title: intl.formatMessage(messages.StartTimeTitle),
        active: visibleFilters.includes(ENTITY_START_TIME),
        removable: true,
      },
      {
        id: ENTITY_DESCRIPTION,
        component: EntityInputConditional,
        value: this.bindDefaultValue(ENTITY_DESCRIPTION, {
          condition: CONDITION_CNT,
        }),
        title: intl.formatMessage(messages.DescriptionTitle),
        validationFunc: commonValidators.descriptionEntity,
        active: visibleFilters.includes(ENTITY_DESCRIPTION),
        removable: true,
        customProps: {
          placeholder: intl.formatMessage(messages.DESCRIPTION_PLACEHOLDER),
          maxLength: 18,
        },
      },
      {
        id: ENTITY_ATTRIBUTE_KEYS,
        component: EntityInputConditionalTags,
        value: this.bindDefaultValue(ENTITY_ATTRIBUTE_KEYS, {
          condition: CONDITION_HAS,
        }),
        title: intl.formatMessage(messages.AttributeKeysTitle),
        active: visibleFilters.includes(ENTITY_ATTRIBUTE_KEYS),
        removable: true,
        customProps: {
          getURI: URLS.testItemAttributeKeysSearch(projectId, launchId),
          placeholder: intl.formatMessage(messages.ATTRIBUTE_KEYS_PLACEHOLDER),
        },
      },
      {
        id: ENTITY_ATTRIBUTE_VALUES,
        component: EntityInputConditionalTags,
        value: this.bindDefaultValue(ENTITY_ATTRIBUTE_VALUES, {
          condition: CONDITION_HAS,
        }),
        title: intl.formatMessage(messages.AttributeValuesTitle),
        active: visibleFilters.includes(ENTITY_ATTRIBUTE_VALUES),
        removable: true,
        customProps: {
          getURI: URLS.testItemAttributeValuesSearch(
            projectId,
            launchId,
            (filterValues[ENTITY_ATTRIBUTE_KEYS] || {}).value || '',
          ),
          placeholder: intl.formatMessage(messages.ATTRIBUTE_VALUES_PLACEHOLDER),
        },
      },
      {
        id: STATS_TOTAL,
        component: EntityInputConditional,
        value: this.bindDefaultValue(STATS_TOTAL, {
          condition: CONDITION_GREATER_EQ,
        }),
        validationFunc: commonValidators.launchNumericEntity,
        title: intl.formatMessage(messages.TotalTitle),
        active: visibleFilters.includes(STATS_TOTAL),
        removable: true,
        customProps: {
          conditions: [CONDITION_GREATER_EQ, CONDITION_LESS_EQ, CONDITION_EQ],
          placeholder: intl.formatMessage(messages.STATS_PLACEHOLDER),
        },
      },
      {
        id: STATS_PASSED,
        component: EntityInputConditional,
        value: this.bindDefaultValue(STATS_PASSED, {
          condition: CONDITION_GREATER_EQ,
        }),
        validationFunc: commonValidators.launchNumericEntity,
        title: intl.formatMessage(messages.PassedTitle),
        active: visibleFilters.includes(STATS_PASSED),
        removable: true,
        customProps: {
          conditions: [CONDITION_GREATER_EQ, CONDITION_LESS_EQ, CONDITION_EQ],
          placeholder: intl.formatMessage(messages.STATS_PLACEHOLDER),
        },
      },
      {
        id: STATS_UNTESTED,
        component: EntityInputConditional,
        value: this.bindDefaultValue(STATS_UNTESTED, {
          condition: CONDITION_GREATER_EQ,
        }),
        validationFunc: commonValidators.launchNumericEntity,
        title: intl.formatMessage(messages.UntestedTitle),
        active: visibleFilters.includes(STATS_UNTESTED),
        removable: true,
        customProps: {
          conditions: [CONDITION_GREATER_EQ, CONDITION_LESS_EQ, CONDITION_EQ],
          placeholder: intl.formatMessage(messages.STATS_PLACEHOLDER),
        },
      },
      {
        id: STATS_FAILED,
        component: EntityInputConditional,
        value: this.bindDefaultValue(STATS_FAILED, {
          condition: CONDITION_GREATER_EQ,
        }),
        validationFunc: commonValidators.launchNumericEntity,
        title: intl.formatMessage(messages.FailedTitle),
        active: visibleFilters.includes(STATS_FAILED),
        removable: true,
        customProps: {
          conditions: [CONDITION_GREATER_EQ, CONDITION_LESS_EQ, CONDITION_EQ],
          placeholder: intl.formatMessage(messages.STATS_PLACEHOLDER),
        },
      },
      {
        id: STATS_SKIPPED,
        component: EntityInputConditional,
        value: this.bindDefaultValue(STATS_SKIPPED, {
          condition: CONDITION_GREATER_EQ,
        }),
        validationFunc: commonValidators.launchNumericEntity,
        title: intl.formatMessage(messages.SkippedTitle),
        active: visibleFilters.includes(STATS_SKIPPED),
        removable: true,
        customProps: {
          conditions: [CONDITION_GREATER_EQ, CONDITION_LESS_EQ, CONDITION_EQ],
          placeholder: intl.formatMessage(messages.STATS_PLACEHOLDER),
        },
      },
    ];
  };

  getDynamicEntities = () => {
    const { intl, visibleFilters } = this.props;
    let defectTypeEntities = [];
    DEFECT_TYPES_SEQUENCE.forEach((defectTypeRef) => {
      if (defectTypeRef.toLowerCase() === NO_DEFECT) {
        return;
      }
      const defectTypeGroup = this.props.defectTypes[defectTypeRef];
      const hasSubtypes = defectTypeGroup.length > 1;
      const defectTitle = `${defectTypeRef}_${hasSubtypes ? 'totalTitle' : 'title'}`;

      defectTypeEntities.push({
        id: `${DEFECT_ENTITY_ID_BASE}${defectTypeRef.toLowerCase()}$total`,
        component: EntityInputConditional,
        value: this.bindDefaultValue(
          `${DEFECT_ENTITY_ID_BASE}${defectTypeRef.toLowerCase()}$total`,
          {
            condition: CONDITION_GREATER_EQ,
          },
        ),
        validationFunc: commonValidators.launchNumericEntity,
        title: messages[defectTitle] ? intl.formatMessage(messages[defectTitle]) : '',
        active: visibleFilters.includes(
          `${DEFECT_ENTITY_ID_BASE}${defectTypeRef.toLowerCase()}$total`,
        ),
        removable: true,
        customProps: {
          conditions: [CONDITION_GREATER_EQ, CONDITION_LESS_EQ, CONDITION_EQ],
          placeholder: intl.formatMessage(messages.STATS_PLACEHOLDER),
        },
      });
      if (hasSubtypes) {
        defectTypeEntities = defectTypeEntities.concat(
          defectTypeGroup.map((defectType) => ({
            id: `${DEFECT_ENTITY_ID_BASE}${defectType.typeRef.toLowerCase()}$${defectType.locator}`,
            component: EntityInputConditional,
            value: this.bindDefaultValue(
              `${DEFECT_ENTITY_ID_BASE}${defectType.typeRef.toLowerCase()}$${defectType.locator}`,
              {
                condition: CONDITION_GREATER_EQ,
              },
            ),
            validationFunc: commonValidators.launchNumericEntity,
            title: `${intl.formatMessage(messages[`${defectTypeRef}_title`])} ${
              defectType.shortName
            }`,
            active: visibleFilters.includes(
              `${DEFECT_ENTITY_ID_BASE}${defectType.typeRef.toLowerCase()}$${defectType.locator}`,
            ),
            removable: true,
            meta: {
              longName: defectType.longName,
              subItem: true,
            },
            customProps: {
              conditions: [CONDITION_GREATER_EQ, CONDITION_LESS_EQ, CONDITION_EQ],
              placeholder: intl.formatMessage(messages.STATS_PLACEHOLDER),
            },
          })),
        );
      }
    });
    return defectTypeEntities;
  };
  bindDefaultValue = bindDefaultValue;
  render() {
    const { render, ...rest } = this.props;

    return render({
      ...rest,
      filterEntities: this.getStaticEntities().concat(this.getDynamicEntities()),
    });
  }
}
