import { defineMessages, injectIntl } from 'react-intl';
import track from 'react-tracking';
import { connect } from 'react-redux';
import { InputSwitcher } from 'components/inputs/inputSwitcher';
import { connectRouter } from 'common/utils';
import {
  namespaceSelector,
  setPredefinedFilterStateToStorage,
  getPredefinedFilterStateFromStorage,
} from 'controllers/testItem';
import { userIdSelector } from 'controllers/user/selectors';
import { PREDEFINED_FILTER_KEY, FILTER_COLLAPSED } from 'controllers/step';
import { STEP_PAGE_EVENTS } from 'components/main/analytics/events';

const messages = defineMessages({
  collapse: {
    id: 'StepGrid.showPreconditionMethods',
    defaultMessage: 'Collapse precondition methods',
  },
  expand: {
    id: 'StepGrid.hidePreconditionMethods',
    defaultMessage: 'Expand precondition methods',
  },
});

export const PredefinedFilterSwitcher = track()(
  connect((state) => ({
    userId: userIdSelector(state),
  }))(
    connectRouter(
      (query) => ({
        predefinedFilter: query[PREDEFINED_FILTER_KEY],
      }),
      {
        setPredefinedFilterState: (userId, value) => {
          setPredefinedFilterStateToStorage(userId, value);
          return { [PREDEFINED_FILTER_KEY]: value ? FILTER_COLLAPSED : undefined };
        },
      },
      {
        namespaceSelector,
      },
    )(
      injectIntl(({ predefinedFilter, setPredefinedFilterState, intl, tracking, userId }) => {
        const predefinedFilterState =
          predefinedFilter !== undefined
            ? predefinedFilter
            : getPredefinedFilterStateFromStorage(userId);
        const isCollapsed = predefinedFilterState === FILTER_COLLAPSED;
        const title = isCollapsed
          ? intl.formatMessage(messages.expand)
          : intl.formatMessage(messages.collapse);
        return (
          <div title={title}>
            <InputSwitcher
              value={isCollapsed}
              onChange={(val) => {
                tracking.trackEvent(STEP_PAGE_EVENTS.METHOD_TYPE_SWITCHER);
                setPredefinedFilterState(userId, val);
              }}
            />
          </div>
        );
      }),
    ),
  ),
);
