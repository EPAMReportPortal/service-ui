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

import React, { PureComponent, Fragment } from 'react';
import { injectIntl } from 'react-intl';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import {
  PRODUCT_BUG,
  AUTOMATION_BUG,
  SYSTEM_ISSUE,
  TO_INVESTIGATE,
} from 'common/constants/defectTypes';
import { FAILED, INTERRUPTED, PASSED, SKIPPED, UNTESTED } from 'common/constants/launchStatuses';
import { COMMON_LOCALE_KEYS } from 'common/constants/localization';
import { Grid } from 'components/main/grid';
import { AbsRelTime } from 'components/main/absRelTime';
import { ItemInfo } from 'pages/inside/common/itemInfo';
import {
  ENTITY_START_TIME,
  ENTITY_NAME,
  ENTITY_ATTRIBUTE_KEYS,
  ENTITY_ATTRIBUTE_VALUES,
  CONDITION_HAS,
  CONDITION_IN,
  ENTITY_USER,
} from 'components/filterEntities/constants';
import { NoItemMessage } from 'components/main/noItemMessage';
import {
  STATS_TOTAL,
  STATS_SKIPPED,
  STATS_PASSED,
  STATS_UNTESTED,
  STATS_FAILED,
  STATS_AB_TOTAL,
  STATS_PB_TOTAL,
  STATS_SI_TOTAL,
  STATS_TI_TOTAL,
} from 'common/constants/statistics';
import { Hamburger } from './hamburger';
import { ExecutionStatistics } from './executionStatistics';
import { DefectStatistics } from './defectStatistics';
import styles from './launchSuiteGrid.scss';

const cx = classNames.bind(styles);

const HamburgerColumn = ({ className, ...rest }) => (
  <div className={cx('hamburger-col', className)}>
    <Hamburger launch={rest.value} customProps={rest.customProps} />
  </div>
);
HamburgerColumn.propTypes = {
  className: PropTypes.string.isRequired,
};

const NameColumn = ({ className, ...rest }) => (
  <div className={cx('name-col', className)}>
    <ItemInfo {...rest} />
  </div>
);
NameColumn.propTypes = {
  className: PropTypes.string.isRequired,
};

const StartTimeColumn = ({ className, ...rest }) => (
  <div className={cx('start-time-col', className)}>
    <AbsRelTime startTime={rest.value.startTime} />
  </div>
);
StartTimeColumn.propTypes = {
  className: PropTypes.string.isRequired,
};

const TotalColumn = ({ className, ...rest }) => (
  <div className={cx('total-col', className)}>
    <ExecutionStatistics
      itemId={rest.value.id}
      title={rest.title}
      value={rest.value.statistics.executions && rest.value.statistics.executions.total}
      bold
      statuses={[
        PASSED.toUpperCase(),
        FAILED.toUpperCase(),
        SKIPPED.toUpperCase(),
        INTERRUPTED.toUpperCase(),
        UNTESTED.toUpperCase(),
      ]}
    />
  </div>
);
TotalColumn.propTypes = {
  className: PropTypes.string.isRequired,
};

const PassedColumn = ({ className, ...rest }) => (
  <div className={cx('passed-col', className)}>
    <ExecutionStatistics
      itemId={rest.value.id}
      title={rest.title}
      value={rest.value.statistics.executions && rest.value.statistics.executions.passed}
      statuses={[PASSED.toUpperCase()]}
    />
  </div>
);
PassedColumn.propTypes = {
  className: PropTypes.string.isRequired,
};

const FailedColumn = ({ className, ...rest }) => (
  <div className={cx('failed-col', className)}>
    <ExecutionStatistics
      itemId={rest.value.id}
      title={rest.title}
      value={rest.value.statistics.executions && rest.value.statistics.executions.failed}
      statuses={[FAILED.toUpperCase(), INTERRUPTED.toUpperCase()]}
    />
  </div>
);
FailedColumn.propTypes = {
  className: PropTypes.string.isRequired,
};

const UntestedColumn = ({ className, ...rest }) => (
  <div className={cx('untested-col', className)}>
    <ExecutionStatistics
      itemId={rest.value.id}
      title={rest.title}
      value={rest.value.statistics.executions && rest.value.statistics.executions.untested}
      statuses={[UNTESTED.toUpperCase()]}
    />
  </div>
);
UntestedColumn.propTypes = {
  className: PropTypes.string.isRequired,
};

const SkippedColumn = ({ className, ...rest }) => (
  <div className={cx('skipped-col', className)}>
    <ExecutionStatistics
      itemId={rest.value.id}
      title={rest.title}
      value={rest.value.statistics.executions && rest.value.statistics.executions.skipped}
      statuses={[SKIPPED.toUpperCase()]}
    />
  </div>
);
SkippedColumn.propTypes = {
  className: PropTypes.string.isRequired,
};

const PbColumn = ({ className, ...rest }) => (
  <div className={cx('pb-col', className)}>
    <DefectStatistics
      type={PRODUCT_BUG}
      customProps={rest.customProps}
      data={rest.value.statistics.defects && rest.value.statistics.defects.product_bug}
      itemId={rest.value.id}
      eventInfo={rest.customProps.events.PB_CHART}
      tooltipEventInfo={rest.customProps.events.PB_TOOLTIP}
    />
  </div>
);
PbColumn.propTypes = {
  className: PropTypes.string.isRequired,
};

const AbColumn = ({ className, ...rest }) => (
  <div className={cx('ab-col', className)}>
    <DefectStatistics
      type={AUTOMATION_BUG}
      customProps={rest.customProps}
      data={rest.value.statistics.defects && rest.value.statistics.defects.automation_bug}
      itemId={rest.value.id}
      eventInfo={rest.customProps.events.AB_CHART}
      tooltipEventInfo={rest.customProps.events.AB_TOOLTIP}
    />
  </div>
);
AbColumn.propTypes = {
  className: PropTypes.string.isRequired,
};

const SiColumn = ({ className, ...rest }) => (
  <div className={cx('si-col', className)}>
    <DefectStatistics
      type={SYSTEM_ISSUE}
      customProps={rest.customProps}
      data={rest.value.statistics.defects && rest.value.statistics.defects.system_issue}
      itemId={rest.value.id}
      eventInfo={rest.customProps.events.SI_CHART}
      tooltipEventInfo={rest.customProps.events.SI_TOOLTIP}
    />
  </div>
);
SiColumn.propTypes = {
  className: PropTypes.string.isRequired,
};

const TiColumn = ({ className, ...rest }) => (
  <div className={cx('ti-col', className)}>
    <DefectStatistics
      type={TO_INVESTIGATE}
      customProps={rest.customProps}
      data={rest.value.statistics.defects && rest.value.statistics.defects.to_investigate}
      itemId={rest.value.id}
      eventInfo={rest.customProps.events.TI_CHART}
      tooltipEventInfo={rest.customProps.events.TI_TOOLTIP}
    />
  </div>
);
TiColumn.propTypes = {
  className: PropTypes.string.isRequired,
};

@injectIntl
export class LaunchSuiteGrid extends PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    data: PropTypes.array,
    sortingColumn: PropTypes.string,
    sortingDirection: PropTypes.string,
    onChangeSorting: PropTypes.func,
    onDeleteItem: PropTypes.func,
    onMove: PropTypes.func,
    onEditItem: PropTypes.func,
    onForceFinish: PropTypes.func,
    selectedItems: PropTypes.arrayOf(PropTypes.object),
    onItemSelect: PropTypes.func,
    onItemsSelect: PropTypes.func,
    onAllItemsSelect: PropTypes.func,
    withHamburger: PropTypes.bool,
    loading: PropTypes.bool,
    onFilterClick: PropTypes.func,
    events: PropTypes.object,
    onAnalysis: PropTypes.func,
    onPatternAnalysis: PropTypes.func,
    rowHighlightingConfig: PropTypes.shape({
      onGridRowHighlighted: PropTypes.func,
      isGridRowHighlighted: PropTypes.bool,
      highlightedRowId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
    noItemsBlock: PropTypes.element,
  };
  static defaultProps = {
    data: [],
    sortingColumn: null,
    sortingDirection: null,
    onChangeSorting: () => {},
    onDeleteItem: () => {},
    onMove: () => {},
    onEditItem: () => {},
    onForceFinish: () => {},
    selectedItems: [],
    onItemSelect: () => {},
    onItemsSelect: () => {},
    onAllItemsSelect: () => {},
    withHamburger: false,
    loading: false,
    onFilterClick: () => {},
    events: {},
    onAnalysis: () => {},
    onPatternAnalysis: () => {},
    rowHighlightingConfig: PropTypes.shape({
      onGridRowHighlighted: () => {},
      isGridRowHighlighted: false,
      highlightedRowId: null,
    }),
    noItemsBlock: null,
  };
  getColumns() {
    const {
      events,
      withHamburger,
      onEditItem,
      onDeleteItem,
      onMove,
      onForceFinish,
      onAnalysis,
      onPatternAnalysis,
    } = this.props;
    const hamburgerColumn = {
      component: HamburgerColumn,
      customProps: {
        onDeleteItem,
        onMove,
        onForceFinish,
        onAnalysis,
        onPatternAnalysis,
      },
    };
    const columns = [
      {
        id: ENTITY_NAME,
        title: {
          full: 'name',
          short: 'name',
        },
        maxHeight: 170,
        component: NameColumn,
        sortable: true,
        withFilter: true,
        filterEventInfo: events.NAME_FILTER,
        customProps: {
          onEditItem,
          onClickAttribute: this.handleAttributeFilterClick,
          onOwnerClick: this.handleOwnerFilterClick,
          events,
          withExtensions: withHamburger, // Use extensions for launch level only
        },
        sortingEventInfo: events.NAME_SORTING,
      },
      {
        id: ENTITY_START_TIME,
        title: {
          full: 'start time',
          short: 'start',
        },
        component: StartTimeColumn,
        sortable: true,
        withFilter: true,
        filterEventInfo: events.START_TIME_FILTER,
        sortingEventInfo: events.START_TIME_SORTING,
      },
      {
        id: STATS_TOTAL,
        title: {
          full: 'total',
          short: 'ttl',
        },
        component: TotalColumn,
        sortable: true,
        withFilter: true,
        filterEventInfo: events.TOTAL_FILTER,
        sortingEventInfo: events.TOTAL_SORTING,
      },
      {
        id: STATS_PASSED,
        title: {
          full: 'passed',
          short: 'ps',
        },
        component: PassedColumn,
        sortable: true,
        withFilter: true,
        filterEventInfo: events.PASSED_FILTER,
        sortingEventInfo: events.PASSED_SORTING,
      },
      {
        id: STATS_UNTESTED,
        title: {
          full: 'untested',
          short: 'un',
        },
        component: UntestedColumn,
        sortable: true,
        withFilter: true,
        filterEventInfo: events.UNTESTED_FILTER,
        sortingEventInfo: events.UNTESTED_SORTING,
      },
      {
        id: STATS_FAILED,
        title: {
          full: 'failed',
          short: 'fl',
        },
        component: FailedColumn,
        sortable: true,
        withFilter: true,
        filterEventInfo: events.FAILED_FILTER,
        sortingEventInfo: events.FAILED_SORTING,
      },
      {
        id: STATS_SKIPPED,
        title: {
          full: 'skipped',
          short: 'skp',
        },
        component: SkippedColumn,
        sortable: true,
        withFilter: true,
        filterEventInfo: events.SKIPPED_FILTER,
        sortingEventInfo: events.SKIPPED_SORTING,
      },
      {
        id: STATS_PB_TOTAL,
        title: {
          full: 'product bug',
          short: 'product bug',
        },
        component: PbColumn,
        customProps: {
          abbreviation: 'pb',
          events,
        },
        sortable: true,
        withFilter: true,
        filterEventInfo: events.PB_FILTER,
        sortingEventInfo: events.PB_SORTING,
      },
      {
        id: STATS_AB_TOTAL,
        title: {
          full: 'auto bug',
          short: 'auto bug',
        },
        component: AbColumn,
        customProps: {
          abbreviation: 'ab',
          events,
        },
        sortable: true,
        withFilter: true,
        filterEventInfo: events.AB_FILTER,
        sortingEventInfo: events.AB_SORTING,
      },
      {
        id: STATS_SI_TOTAL,
        title: {
          full: 'system issue',
          short: 'system issue',
        },
        component: SiColumn,
        customProps: {
          abbreviation: 'si',
          events,
        },
        sortable: true,
        withFilter: true,
        filterEventInfo: events.SI_FILTER,
        sortingEventInfo: events.SI_SORTING,
      },
      {
        id: STATS_TI_TOTAL,
        title: {
          full: 'to investigate',
          short: 'to invest',
        },
        component: TiColumn,
        customProps: {
          abbreviation: 'ti',
          events,
        },
        sortable: true,
        withFilter: true,
        filterEventInfo: events.TI_FILTER,
        sortingEventInfo: events.TI_SORTING,
      },
    ];
    if (withHamburger) {
      columns.splice(0, 0, hamburgerColumn);
    }
    return columns;
  }

  handleAttributeFilterClick = (attribute) => {
    this.props.onFilterClick(
      [
        {
          id: ENTITY_ATTRIBUTE_KEYS,
          value: {
            filteringField: ENTITY_ATTRIBUTE_KEYS,
            condition: CONDITION_HAS,
            value: attribute.key || '',
          },
        },
        {
          id: ENTITY_ATTRIBUTE_VALUES,
          value: {
            filteringField: ENTITY_ATTRIBUTE_VALUES,
            condition: CONDITION_HAS,
            value: attribute.value || '',
          },
        },
      ],
      true,
    );
  };

  handleOwnerFilterClick = (owner) =>
    this.props.onFilterClick({
      id: ENTITY_USER,
      value: {
        filteringField: ENTITY_NAME,
        condition: CONDITION_IN,
        value: owner || '',
      },
    });

  renderNoItemsBlock = () => {
    const {
      intl: { formatMessage },
      noItemsBlock,
    } = this.props;

    if (noItemsBlock) {
      return noItemsBlock;
    }

    return <NoItemMessage message={formatMessage(COMMON_LOCALE_KEYS.NO_RESULTS)} />;
  };

  render() {
    const {
      data,
      onChangeSorting,
      sortingColumn,
      sortingDirection,
      selectedItems,
      onItemSelect,
      onItemsSelect,
      onAllItemsSelect,
      loading,
      onFilterClick,
      rowHighlightingConfig,
    } = this.props;

    return (
      <Fragment>
        <Grid
          columns={this.getColumns()}
          data={data}
          sortingColumn={sortingColumn}
          sortingDirection={sortingDirection}
          onChangeSorting={onChangeSorting}
          selectedItems={selectedItems}
          selectable
          onToggleSelection={onItemSelect}
          onItemsSelect={onItemsSelect}
          onToggleSelectAll={onAllItemsSelect}
          loading={loading}
          onFilterClick={onFilterClick}
          rowHighlightingConfig={rowHighlightingConfig}
        />
        {!data.length && !loading && this.renderNoItemsBlock()}
      </Fragment>
    );
  }
}
