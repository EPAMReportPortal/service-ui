import { createSelector } from 'reselect';
import { OWNER } from 'common/constants/permissions';
import { DEFECT_TYPES_SEQUENCE } from 'common/constants/defectTypes';
import { JIRA, RALLY, EMAIL, SAUCE_LABS } from 'common/constants/integrationNames';
import {
  ANALYZER_ATTRIBUTE_PREFIX,
  JOB_ATTRIBUTE_PREFIX,
  PROJECT_ATTRIBUTES_DELIMITER,
} from './constants';
import { filterIntegrationsByName, sortItemsByGroupType, groupItems } from './utils';

const projectSelector = (state) => state.project || {};

const projectInfoSelector = (state) => projectSelector(state).info || {};

export const projectConfigSelector = (state) => projectInfoSelector(state).configuration || {};

export const projectMembersSelector = (state) => projectInfoSelector(state).users || [];

export const projectCreationDateSelector = (state) => projectInfoSelector(state).creationDate || 0;

export const projectIntegrationsSelector = (state) => projectInfoSelector(state).integrations || [];

export const projectPreferencesSelector = (state) => projectSelector(state).preferences || {};

export const userFiltersSelector = (state) => projectPreferencesSelector(state).filters || [];

export const subTypesSelector = (state) => projectConfigSelector(state).subTypes || [];

export const defectTypesSelector = createSelector(subTypesSelector, (subTypes) =>
  DEFECT_TYPES_SEQUENCE.reduce(
    (types, type) => (subTypes[type] ? { ...types, [type]: subTypes[type] } : types),
    {},
  ),
);

const attributesSelector = (state) => projectConfigSelector(state).attributes || {};

const createPrefixedAttributesSelector = (prefix) =>
  createSelector(attributesSelector, (attributes) =>
    Object.keys(attributes).reduce(
      (result, attribute) =>
        attribute.match(`${prefix}${PROJECT_ATTRIBUTES_DELIMITER}`)
          ? {
              ...result,
              [attribute.replace(`${prefix}${PROJECT_ATTRIBUTES_DELIMITER}`, '')]: attributes[
                attribute
              ],
            }
          : result,
      {},
    ),
  );

export const analyzerAttributesSelector = createPrefixedAttributesSelector(
  ANALYZER_ATTRIBUTE_PREFIX,
);

export const jobAttributesSelector = createPrefixedAttributesSelector(JOB_ATTRIBUTE_PREFIX);

export const externalSystemSelector = (state) => projectConfigSelector(state).externalSystem || [];

export const projectNotificationsConfigurationSelector = (state) =>
  projectConfigSelector(state).notificationsConfiguration || {};

export const projectNotificationsCasesSelector = createSelector(
  projectNotificationsConfigurationSelector,
  ({ cases = [] }) =>
    cases.map((notificationCase) => ({
      ...notificationCase,
      informOwner: notificationCase.recipients.includes(OWNER),
      recipients: notificationCase.recipients.filter((item) => item !== OWNER),
    })),
);

export const projectNotificationsEnabledSelector = (state) =>
  projectNotificationsConfigurationSelector(state).enabled || false;

export const defectColorsSelector = createSelector(projectConfigSelector, (config) => {
  const colors = {};
  Object.keys(config).length &&
    Object.keys(config.subTypes).forEach((key) => {
      colors[key.toLowerCase()] = config.subTypes[key][0].color;
      const defectGroup = config.subTypes[key];
      defectGroup.forEach((defect) => {
        colors[defect.locator] = defect.color;
      });
    });
  return colors;
});

/* INTEGRATIONS */

const createNamedIntegrationsSelector = (integrationName) =>
  createSelector(projectIntegrationsSelector, (integrations) =>
    filterIntegrationsByName(integrations, integrationName),
  );

export const projectIntegrationsSortedSelector = createSelector(
  projectIntegrationsSelector,
  sortItemsByGroupType,
);

export const groupedIntegrationsSelector = createSelector(
  projectIntegrationsSortedSelector,
  groupItems,
);

export const namedIntegrationsSelectorsMap = {
  [SAUCE_LABS]: createNamedIntegrationsSelector(SAUCE_LABS),
  [JIRA]: createNamedIntegrationsSelector(JIRA),
  [RALLY]: createNamedIntegrationsSelector(RALLY),
  [EMAIL]: createNamedIntegrationsSelector(EMAIL),
};
