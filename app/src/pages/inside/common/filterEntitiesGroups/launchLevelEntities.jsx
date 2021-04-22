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
import { commonValidators } from 'common/utils/validation';
import { URLS } from 'common/urls';
import { activeProjectSelector } from 'controllers/user';
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
  EntitySearch,
  EntityContains,
} from 'components/filterEntities';
import { bindDefaultValue } from 'components/filterEntities/utils';
import {
  CONDITION_CNT,
  CONDITION_GREATER_EQ,
  CONDITION_IN,
  CONDITION_BETWEEN,
  CONDITION_HAS,
  ENTITY_NAME,
  ENTITY_NUMBER,
  ENTITY_USER,
  ENTITY_START_TIME,
  ENTITY_DESCRIPTION,
  ENTITY_ATTRIBUTE_KEYS,
  ENTITY_ATTRIBUTE_VALUES,
  CONDITION_LESS_EQ,
  CONDITION_EQ,
} from 'components/filterEntities/constants';
import { defectTypesSelector } from 'controllers/project';

const messages = defineMessages({
  NameTitle: {
    id: 'LaunchLevelEntities.NameTitle',
    defaultMessage: 'Launch name',
  },
  NumberTitle: {
    id: 'LaunchLevelEntities.NumberTitle',
    defaultMessage: 'Launch number',
  },
  DescriptionTitle: {
    id: 'LaunchLevelEntities.DescriptionTitle',
    defaultMessage: 'Description',
  },
  StartTimeTitle: {
    id: 'LaunchLevelEntities.StartTimeTitle',
    defaultMessage: 'Start time',
  },
  OwnerTitle: {
    id: 'LaunchLevelEntities.OwnerTitle',
    defaultMessage: 'Owner',
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
    id: 'LaunchLevelEntities.TotalTitle',
    defaultMessage: 'Total',
  },
  PassedTitle: {
    id: 'LaunchLevelEntities.PassedTitle',
    defaultMessage: 'Passed',
  },
  UntestedTitle: {
    id: 'LaunchLevelEntities.UntestedTitle',
    defaultMessage: 'Untested',
  },
  FailedTitle: {
    id: 'LaunchLevelEntities.FailedTitle',
    defaultMessage: 'Failed',
  },
  SkippedTitle: {
    id: 'LaunchLevelEntities.SkippedTitle',
    defaultMessage: 'Skipped',
  },
  PRODUCT_BUG_title: {
    id: 'LaunchLevelEntities.PRODUCT_BUG_title',
    defaultMessage: 'Product bug',
  },
  PRODUCT_BUG_totalTitle: {
    id: 'LaunchLevelEntities.PRODUCT_BUG_totalTitle',
    defaultMessage: 'Total product bugs',
  },
  AUTOMATION_BUG_title: {
    id: 'LaunchLevelEntities.AUTOMATION_BUG_title',
    defaultMessage: 'Automation bug',
  },
  AUTOMATION_BUG_totalTitle: {
    id: 'LaunchLevelEntities.AUTOMATION_BUG_totalTitle',
    defaultMessage: 'Total automation bugs',
  },
  SYSTEM_ISSUE_title: {
    id: 'LaunchLevelEntities.SYSTEM_ISSUE_title',
    defaultMessage: 'System issue',
  },
  SYSTEM_ISSUE_totalTitle: {
    id: 'LaunchLevelEntities.SYSTEM_ISSUE_totalTitle',
    defaultMessage: 'Total system issues',
  },
  TO_INVESTIGATE_title: {
    id: 'LaunchLevelEntities.TO_INVESTIGATE_title',
    defaultMessage: 'To investigate',
  },
  TO_INVESTIGATE_totalTitle: {
    id: 'LaunchLevelEntities.TO_INVESTIGATE_totalTitle',
    defaultMessage: 'Total to investigate',
  },
  NO_DEFECT_title: {
    id: 'LaunchLevelEntities.NO_DEFECT_title',
    defaultMessage: 'No Defect',
  },
  NO_DEFECT_totalTitle: {
    id: 'LaunchLevelEntities.NO_DEFECT_totalTitle',
    defaultMessage: 'No Defect Total',
  },
  LAUNCH_NUMBER_PLACEHOLDER: {
    id: 'LaunchLevelEntities.launchNumberPlaceholder',
    defaultMessage: 'Enter number',
  },
  DESCRIPTION_PLACEHOLDER: {
    id: 'LaunchLevelEntities.descriptionPlaceholder',
    defaultMessage: 'Enter description',
  },
  ATTRIBUTE_KEYS_PLACEHOLDER: {
    id: 'LaunchLevelEntities.entityItemAttributeKeys.placeholder',
    defaultMessage: 'Enter attribute keys',
  },
  ATTRIBUTE_VALUES_PLACEHOLDER: {
    id: 'LaunchLevelEntities.entityItemAttributeValues.placeholder',
    defaultMessage: 'Enter attribute values',
  },
  STATS_PLACEHOLDER: {
    id: 'LaunchLevelEntities.entityItemStatistics.placeholder',
    defaultMessage: 'Enter quantity',
  },
  LAUNCH_NAME_PLACEHOLDER: {
    id: 'LaunchLevelEntities.launchName.placeholder',
    defaultMessage: 'Enter name',
  },
  OWNER_NAME_PLACEHOLDER: {
    id: 'LaunchLevelEntities.ownerName.placeholder',
    defaultMessage: 'Enter owner name',
  },
});

const DEFECT_ENTITY_ID_BASE = 'statistics$defects$';

@injectIntl
@connect((state) => ({
  defectTypes: defectTypesSelector(state),
  activeProject: activeProjectSelector(state),
}))
export class LaunchLevelEntities extends Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    defectTypes: PropTypes.object.isRequired,
    filterValues: PropTypes.object,
    render: PropTypes.func.isRequired,
    activeProject: PropTypes.string.isRequired,
    visibleFilters: PropTypes.array,
  };
  static defaultProps = {
    filterValues: {},
    visibleFilters: [],
  };
  getStaticEntities = () => {
    const { intl, filterValues, activeProject, visibleFilters } = this.props;
    const attributeKey = (filterValues[ENTITY_ATTRIBUTE_KEYS] || {}).value;
    const normalizeValue = (value) => (Array.isArray(value) ? value.join(',') : value);
    const getLaunchAttributeValuesSearchURI = URLS.launchAttributeValuesSearch(
      activeProject,
      normalizeValue(attributeKey),
    );
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
        customProps: {
          placeholder: intl.formatMessage(messages.LAUNCH_NAME_PLACEHOLDER),
        },
      },
      {
        id: ENTITY_NUMBER,
        component: EntityInputConditional,
        value: this.bindDefaultValue(ENTITY_NUMBER, {
          condition: CONDITION_GREATER_EQ,
        }),
        validationFunc: commonValidators.launchNumericEntity,
        title: intl.formatMessage(messages.NumberTitle),
        active: visibleFilters.includes(ENTITY_NUMBER),
        removable: true,
        customProps: {
          conditions: [CONDITION_EQ, CONDITION_GREATER_EQ, CONDITION_LESS_EQ],
          placeholder: intl.formatMessage(messages.LAUNCH_NUMBER_PLACEHOLDER),
        },
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
        id: ENTITY_USER,
        component: EntitySearch,
        value: this.bindDefaultValue(ENTITY_USER, {
          condition: CONDITION_IN,
        }),
        title: intl.formatMessage(messages.OwnerTitle),
        active: visibleFilters.includes(ENTITY_USER),
        removable: true,
        customProps: {
          getURI: URLS.launchOwnersSearch(activeProject),
          placeholder: intl.formatMessage(messages.OWNER_NAME_PLACEHOLDER),
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
        id: ENTITY_ATTRIBUTE_KEYS,
        component: EntityInputConditionalTags,
        value: this.bindDefaultValue(ENTITY_ATTRIBUTE_KEYS, {
          condition: CONDITION_HAS,
        }),
        title: intl.formatMessage(messages.AttributeKeysTitle),
        active: visibleFilters.includes(ENTITY_ATTRIBUTE_KEYS),
        removable: true,
        customProps: {
          getURI: URLS.launchAttributeKeysSearch(activeProject),
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
          getURI: getLaunchAttributeValuesSearchURI,
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
      const hasSubtypes = defectTypeGroup && defectTypeGroup.length > 1;
      const totalEntityId = `${DEFECT_ENTITY_ID_BASE}${defectTypeRef.toLowerCase()}$total`;
      const defectTitle = `${defectTypeRef}_${hasSubtypes ? 'totalTitle' : 'title'}`;

      defectTypeEntities.push({
        id: totalEntityId,
        component: EntityInputConditional,
        value: this.bindDefaultValue(totalEntityId, {
          condition: CONDITION_GREATER_EQ,
        }),
        validationFunc: commonValidators.launchNumericEntity,
        title: messages[defectTitle] ? this.props.intl.formatMessage(messages[defectTitle]) : '',
        active: visibleFilters.includes(totalEntityId),
        removable: true,
        customProps: {
          conditions: [CONDITION_GREATER_EQ, CONDITION_LESS_EQ, CONDITION_EQ],
          placeholder: intl.formatMessage(messages.STATS_PLACEHOLDER),
        },
      });
      if (hasSubtypes) {
        defectTypeEntities = defectTypeEntities.concat(
          defectTypeGroup.map((defectType) => {
            const entityId = `${DEFECT_ENTITY_ID_BASE}${defectType.typeRef.toLowerCase()}$${
              defectType.locator
            }`;
            return {
              id: entityId,
              component: EntityInputConditional,
              value: this.bindDefaultValue(entityId, {
                condition: CONDITION_GREATER_EQ,
              }),
              validationFunc: commonValidators.launchNumericEntity,
              title: `${this.props.intl.formatMessage(messages[`${defectTypeRef}_title`])} ${
                defectType.shortName
              }`,
              active: visibleFilters.includes(entityId),
              removable: true,
              customProps: {
                conditions: [CONDITION_GREATER_EQ, CONDITION_LESS_EQ, CONDITION_EQ],
                placeholder: intl.formatMessage(messages.STATS_PLACEHOLDER),
              },
              meta: {
                longName: defectType.longName,
                subItem: true,
              },
            };
          }),
        );
      }
    });
    return defectTypeEntities;
  };

  collectLostEntities = (entities) => {
    const lostKeys = Object.keys(this.props.filterValues).filter(
      (key) => !entities.find((entity) => entity.id === key),
    );
    return lostKeys.map((key) => ({
      id: key,
      value: this.props.filterValues[key],
      active: true,
      static: true,
      title: key.split('$').pop(),
      component: EntityContains,
      removable: true,
      customProps: {
        disabled: true,
        error: 'error',
      },
    }));
  };

  bindDefaultValue = bindDefaultValue;

  render() {
    const { render, ...rest } = this.props;

    const entities = this.getStaticEntities().concat(this.getDynamicEntities());
    const lostEntities = this.collectLostEntities(entities);

    return render({
      ...rest,
      filterEntities: [...entities, ...lostEntities],
    });
  }
}
