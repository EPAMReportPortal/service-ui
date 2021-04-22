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
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import classNames from 'classnames/bind';
import { CHART_MODES, MODES_VALUES } from 'common/constants/chartModes';
import {
  PRODUCT_BUG,
  AUTOMATION_BUG,
  SYSTEM_ISSUE,
  NO_DEFECT,
  TO_INVESTIGATE,
} from 'common/constants/defectTypes';
import { defectLinkSelector, statisticsLinkSelector } from 'controllers/testItem';
import { activeProjectSelector } from 'controllers/user';
import { createFilterAction } from 'controllers/filter';
import { defectTypesSelector } from 'controllers/project';
import {
  getUpdatedFilterWithTime,
  getChartDefaultProps,
  getDefaultTestItemLinkParams,
} from 'components/widgets/common/utils';
import * as STATUSES from 'common/constants/testStatuses';
import { ALL } from 'common/constants/reservedFilterIds';
import { ChartContainer } from 'components/widgets/common/c3chart';
import { getConfig as getStatusPageModeConfig } from '../common/statusPageChartConfig';
import { selectConfigFunction } from './config';
import styles from './investigatedTrendChart.scss';

const cx = classNames.bind(styles);

@injectIntl
@connect(
  (state) => ({
    projectId: activeProjectSelector(state),
    defectTypes: defectTypesSelector(state),
    getDefectLink: defectLinkSelector(state),
    getStatisticsLink: statisticsLinkSelector(state),
  }),
  {
    navigate: (linkAction) => linkAction,
    createFilterAction,
  },
)
export class InvestigatedTrendChart extends Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    navigate: PropTypes.func.isRequired,
    projectId: PropTypes.string.isRequired,
    widget: PropTypes.object.isRequired,
    defectTypes: PropTypes.object.isRequired,
    getDefectLink: PropTypes.func.isRequired,
    getStatisticsLink: PropTypes.func.isRequired,
    isPreview: PropTypes.bool,
    container: PropTypes.instanceOf(Element).isRequired,
    observer: PropTypes.object,
    height: PropTypes.number,
    onStatusPageMode: PropTypes.bool,
    interval: PropTypes.string,
    createFilterAction: PropTypes.func,
    integerValueType: PropTypes.bool,
    uncheckedLegendItems: PropTypes.array,
    onChangeLegend: PropTypes.func,
  };

  static defaultProps = {
    navigate: () => {},
    getDefectLink: () => {},
    createFilterAction: () => {},
    isPreview: false,
    height: 0,
    observer: {
      subscribe: () => {},
      unsubscribe: () => {},
    },
    onStatusPageMode: false,
    interval: null,
    integerValueType: false,
    uncheckedLegendItems: [],
    onChangeLegend: () => {},
  };

  onChartClick = (data) =>
    this.isTimeline ? this.timeLineModeClickHandler(data) : this.launchModeClickHandler(data);

  getDefectTypeLocators = (id) => {
    const { defectTypes } = this.props;
    const investigatedDefectType = [PRODUCT_BUG, AUTOMATION_BUG, SYSTEM_ISSUE, NO_DEFECT];
    const toInvestigateDefectType = [TO_INVESTIGATE];
    const defectType = id === 'toInvestigate' ? toInvestigateDefectType : investigatedDefectType;

    return defectType
      .reduce((acc, currentValue) => acc.concat(defectTypes[currentValue.toUpperCase()]), [])
      .map((item) => item.locator);
  };

  getConfigData = () => {
    const {
      intl: { formatMessage },
      widget: { contentParameters },
      interval,
      onStatusPageMode,
      integerValueType,
    } = this.props;

    this.isTimeline =
      contentParameters &&
      contentParameters.widgetOptions.timeline === MODES_VALUES[CHART_MODES.TIMELINE_MODE];

    if (onStatusPageMode) {
      return {
        formatMessage,
        getConfig: getStatusPageModeConfig,
        interval,
        chartType: MODES_VALUES[CHART_MODES.BAR_VIEW],
        integerValueType,
        wrapperClassName: cx('tooltip-container'),
      };
    }

    return {
      formatMessage,
      getConfig: selectConfigFunction(this.isTimeline),
      onChartClick: this.onChartClick,
    };
  };

  timeLineModeClickHandler = (data) => {
    const chartFilter = this.props.widget.appliedFilters[0];
    const arrResult = Object.keys(this.props.widget.content.result).map((item) => item);
    const itemDate = arrResult[data.index];
    const newFilter = getUpdatedFilterWithTime(chartFilter, itemDate);

    this.props.createFilterAction(newFilter);
  };

  launchModeClickHandler = (data) => {
    const { widget, getDefectLink, getStatisticsLink, projectId } = this.props;
    const id = widget.content.result[data.index].id;
    const defaultParams = getDefaultTestItemLinkParams(projectId, ALL, id);
    const defectTypeLocators = this.getDefectTypeLocators(data.id, projectId);
    const link = defectTypeLocators
      ? getDefectLink({ defects: defectTypeLocators, itemId: id })
      : getStatisticsLink({
          statuses: [
            STATUSES.PASSED,
            STATUSES.FAILED,
            STATUSES.SKIPPED,
            STATUSES.INTERRUPTED,
            STATUSES.UNTESTED,
          ],
        });

    this.props.navigate(Object.assign(link, defaultParams));
  };

  render() {
    const { onChangeLegend, uncheckedLegendItems, onStatusPageMode } = this.props;
    const legendConfig = {
      onChangeLegend,
      showLegend: !onStatusPageMode,
      uncheckedLegendItems,
    };

    return (
      <div className={cx('investigated-trend-chart', { 'timeline-mode': this.isTimeline })}>
        <ChartContainer
          {...getChartDefaultProps(this.props)}
          className={cx('widget-wrapper')}
          legendConfig={legendConfig}
          configData={this.getConfigData()}
        />
      </div>
    );
  }
}
