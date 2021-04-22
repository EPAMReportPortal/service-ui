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
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import * as d3 from 'd3-selection';
import { injectIntl } from 'react-intl';
import { statisticsLinkSelector } from 'controllers/testItem';
import { activeProjectSelector } from 'controllers/user';
import { createFilterAction } from 'controllers/filter';
import * as STATUSES from 'common/constants/testStatuses';
import { CHART_MODES, MODES_VALUES } from 'common/constants/chartModes';
import { ALL } from 'common/constants/reservedFilterIds';
import { ChartContainer } from 'components/widgets/common/c3chart';
import {
  getUpdatedFilterWithTime,
  getChartDefaultProps,
  getDefaultTestItemLinkParams,
} from 'components/widgets/common/utils';
import { getConfig } from './config/getConfig';
import styles from './testCasesGrowthTrendChart.scss';

const cx = classNames.bind(styles);

@connect(
  (state) => ({
    projectId: activeProjectSelector(state),
    getStatisticsLink: statisticsLinkSelector(state),
  }),
  {
    createFilterAction,
    navigate: (linkAction) => linkAction,
  },
)
@injectIntl
export class TestCasesGrowthTrendChart extends Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    widget: PropTypes.object.isRequired,
    container: PropTypes.instanceOf(Element).isRequired,
    projectId: PropTypes.string.isRequired,
    getStatisticsLink: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    createFilterAction: PropTypes.func.isRequired,
    isPreview: PropTypes.bool,
    height: PropTypes.number,
    observer: PropTypes.object,
  };

  static defaultProps = {
    isPreview: false,
    height: 0,
    observer: {},
  };

  onChartCreated = (element) => {
    this.node = element;
    this.restoreBars();
  };

  onChartClick = (data) =>
    this.isTimeline ? this.timeLineModeClickHandler(data) : this.launchModeClickHandler(data);

  getConfigData = () => {
    const {
      intl: { formatMessage },
      widget: { contentParameters },
    } = this.props;

    this.isTimeline =
      contentParameters &&
      contentParameters.widgetOptions.timeline === MODES_VALUES[CHART_MODES.TIMELINE_MODE];

    return {
      getConfig,
      formatMessage,
      isTimeline: this.isTimeline,
      onChartClick: this.onChartClick,
      onRendered: this.restoreBars,
    };
  };

  restoreBars = () => {
    if (!this.node) {
      return;
    }

    const barPathSelector = '.c3-bars-bar path';
    const barPaths = d3.select(this.node).selectAll(barPathSelector);
    barPaths.each((pathData, i) => {
      const elem = d3.select(this.node).select(`${barPathSelector}.c3-bar-${i}`);
      if (pathData.value === 0) {
        elem
          .style('stroke-width', '1px')
          .style('stroke', '#464547')
          .style('shape-rendering', 'initial');
      }
    });
  };

  timeLineModeClickHandler = (data) => {
    const chartFilter = this.props.widget.appliedFilters[0];
    const arrResult = Object.keys(this.props.widget.content.result).map((item) => item);
    const itemDate = arrResult[data.index];
    const newFilter = getUpdatedFilterWithTime(chartFilter, itemDate);

    this.props.createFilterAction(newFilter);
  };

  launchModeClickHandler = (data) => {
    const { widget, getStatisticsLink, projectId } = this.props;
    const id = widget.content.result[data.index].id;
    const defaultParams = getDefaultTestItemLinkParams(projectId, ALL, id);
    const statisticsLink = getStatisticsLink({
      statuses: [
        STATUSES.PASSED,
        STATUSES.FAILED,
        STATUSES.SKIPPED,
        STATUSES.INTERRUPTED,
        STATUSES.UNTESTED,
      ],
    });
    this.props.navigate(Object.assign(statisticsLink, defaultParams));
  };

  render() {
    return (
      <ChartContainer
        {...getChartDefaultProps(this.props)}
        configData={this.getConfigData()}
        className={cx('test-cases-growth-trend-chart')}
        legendConfig={{
          showLegend: false,
        }}
        chartCreatedCallback={this.onChartCreated}
      />
    );
  }
}
