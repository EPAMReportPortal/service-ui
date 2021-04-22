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
import { injectIntl } from 'react-intl';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import * as d3 from 'd3-selection';
import { defectTypesSelector, orderedContentFieldsSelector } from 'controllers/project';
import {
  defectLinkSelector,
  statisticsLinkSelector,
  TEST_ITEMS_TYPE_LIST,
} from 'controllers/testItem';
import { activeProjectSelector } from 'controllers/user';
import { createFilterAction } from 'controllers/filter';
import { PASSED, FAILED, SKIPPED, INTERRUPTED, UNTESTED } from 'common/constants/testStatuses';
import { CHART_MODES, MODES_VALUES } from 'common/constants/chartModes';
import { ALL } from 'common/constants/reservedFilterIds';
import { ChartContainer } from 'components/widgets/common/c3chart';
import {
  getDefaultTestItemLinkParams,
  getItemNameConfig,
  getDefectTypeLocators,
  getChartDefaultProps,
} from 'components/widgets/common/utils';
import { createTooltipRenderer } from 'components/widgets/common/tooltip';
import { CHART_OFFSET } from 'components/widgets/common/constants';
import { IssueTypeStatTooltip } from '../common/issueTypeStatTooltip';
import { isSingleColumnChart, calculateTooltipParams } from './config/utils';
import { getConfig } from './config/getConfig';
import { TOTAL_KEY } from './constants';
import styles from './launchStatisticsChart.scss';

const cx = classNames.bind(styles);

@injectIntl
@connect(
  (state) => ({
    projectId: activeProjectSelector(state),
    defectTypes: defectTypesSelector(state),
    orderedContentFields: orderedContentFieldsSelector(state),
    getDefectLink: defectLinkSelector(state),
    getStatisticsLink: statisticsLinkSelector(state),
  }),
  {
    navigate: (linkAction) => linkAction,
    createFilterAction,
  },
)
export class LaunchStatisticsChart extends Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    navigate: PropTypes.func,
    widget: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    defectTypes: PropTypes.object.isRequired,
    orderedContentFields: PropTypes.array.isRequired,
    getDefectLink: PropTypes.func.isRequired,
    getStatisticsLink: PropTypes.func.isRequired,
    container: PropTypes.instanceOf(Element).isRequired,
    createFilterAction: PropTypes.func,
    isPreview: PropTypes.bool,
    isFullscreen: PropTypes.bool,
    height: PropTypes.number,
    observer: PropTypes.object,
    uncheckedLegendItems: PropTypes.array,
    onChangeLegend: PropTypes.func,
  };

  static defaultProps = {
    navigate: () => {},
    getDefectLink: () => {},
    getStatisticsLink: () => {},
    createFilterAction: () => {},
    isPreview: false,
    isFullscreen: false,
    height: 0,
    observer: {},
    uncheckedLegendItems: [],
    onChangeLegend: () => {},
  };

  componentWillUnmount() {
    if (!this.props.isPreview && this.isCustomTooltipNeeded()) {
      this.removeChartListeners();
      this.chart = null;
    }
  }

  onDefaultChartCreated = (node, chart, chartData) => {
    this.chartData = chartData;
  };

  onCustomChartCreated = (node, chart, chartData) => {
    this.node = node;
    this.chart = chart;
    this.chartData = chartData;
    this.interactElems = d3.selectAll(
      node.querySelectorAll(this.isSingleColumn() ? '.c3-circle' : '.c3-area'),
    );

    if (this.isSingleColumn()) {
      // eslint-disable-next-line
      this.interactElems._groups[0].forEach(function (item) {
        if (!item.value) {
          d3.select(this).style('display', 'none');
        }
      });
    }

    this.createInteractiveTooltip();
  };

  onChartClick = (data) =>
    this.isTimeline() ? this.timeLineModeClickHandler(data) : this.launchModeClickHandler(data);

  onItemMouseOver = () => this.tooltip.style('display', 'block');

  onItemMouseOut = () => this.tooltip.style('display', 'none');

  onItemMouseMove = (data) => {
    const {
      intl: { formatMessage },
      defectTypes,
    } = this.props;
    const isTimeline = this.isTimeline();

    const rectWidth = this.node.querySelectorAll('.c3-event-rect')[0].getAttribute('width');
    const currentMousePosition = d3.mouse(this.chart.element);
    const itemWidth = rectWidth / data.values.length;
    const dataIndex = Math.trunc((currentMousePosition[0] - CHART_OFFSET) / itemWidth);
    this.selectedLaunchData = data.values.find((item) => item.index === dataIndex);
    const renderTooltip = createTooltipRenderer(IssueTypeStatTooltip, calculateTooltipParams, {
      itemsData: this.chartData.itemsData,
      isTimeline,
      formatMessage,
      defectTypes,
    });

    this.tooltip
      .html(() =>
        renderTooltip([this.selectedLaunchData], null, null, (id) => this.chartData.colors[id]),
      )
      .style('left', `${currentMousePosition[0] - (isTimeline ? 75 : 85)}px`)
      .style('top', `${currentMousePosition[1] - (isTimeline ? 60 : 75)}px`);
  };

  getLinkParametersStatuses = ({ defectType }) => {
    if (defectType === TOTAL_KEY) {
      return [PASSED, FAILED, SKIPPED, INTERRUPTED, UNTESTED];
    }
    return [defectType.toUpperCase()];
  };

  getWidgetViewMode = () => this.props.widget.contentParameters.widgetOptions.viewMode;

  getConfigData = () => {
    const {
      intl: { formatMessage },
      widget: { contentParameters: { widgetOptions, contentFields } = {} },
      orderedContentFields,
      defectTypes,
      isFullscreen,
    } = this.props;

    return {
      getConfig,
      formatMessage,
      contentFields,
      orderedContentFields,
      defectTypes,
      isFullscreen,
      isTimeline: this.isTimeline(),
      isZoomEnabled: widgetOptions.zoom,
      widgetViewMode: this.getWidgetViewMode(),
      isCustomTooltip: this.isCustomTooltipNeeded(),
      isSingleColumn: this.isSingleColumn(),
      onChartClick: this.onChartClick,
    };
  };

  isSingleColumn = () => isSingleColumnChart(this.props.widget.content, this.isTimeline());

  isTimeline = () =>
    this.props.widget.contentParameters.widgetOptions.timeline ===
    MODES_VALUES[CHART_MODES.TIMELINE_MODE];

  launchModeClickHandler = (data) => {
    const { widget, getDefectLink, getStatisticsLink, defectTypes, projectId } = this.props;
    const nameConfig = getItemNameConfig(data.id);
    const id = widget.content.result[data.index].id;
    const defaultParams = getDefaultTestItemLinkParams(projectId, ALL, id);
    const locators = getDefectTypeLocators(nameConfig, defectTypes);

    const link = locators
      ? getDefectLink({ defects: locators, itemId: id })
      : getStatisticsLink({ statuses: this.getLinkParametersStatuses(nameConfig) });
    this.props.navigate(Object.assign(link, defaultParams));
  };

  timeLineModeClickHandler = (data) => {
    const { widget, getDefectLink, getStatisticsLink, defectTypes, projectId } = this.props;
    const chartFilterId = widget.appliedFilters[0].id;
    const launchesLimit = widget.contentParameters.itemsCount;
    const nameConfig = getItemNameConfig(data.id);
    const defaultParams = getDefaultTestItemLinkParams(
      projectId,
      chartFilterId,
      TEST_ITEMS_TYPE_LIST,
    );
    const locators = getDefectTypeLocators(nameConfig, defectTypes);

    const link = locators
      ? getDefectLink({ defects: locators, itemId: TEST_ITEMS_TYPE_LIST, launchesLimit })
      : getStatisticsLink({ statuses: this.getLinkParametersStatuses(nameConfig), launchesLimit });
    this.props.navigate(Object.assign(link, defaultParams));
  };

  createInteractiveTooltip = () => {
    this.tooltip = d3.select(this.node.querySelector('.c3-tooltip-container'));

    this.interactElems &&
      this.interactElems
        .on('mousemove', this.onItemMouseMove)
        .on('mouseover', this.onItemMouseOver)
        .on('mouseout', this.onItemMouseOut)
        .on('click', () => this.onChartClick(this.selectedLaunchData));
  };

  removeChartListeners = () => {
    this.interactElems && this.interactElems.on('click mousemove mouseover mouseout', null);
  };

  isCustomTooltipNeeded = () =>
    this.getWidgetViewMode() === MODES_VALUES[CHART_MODES.AREA_VIEW] && !this.isSingleColumn();

  render() {
    const { isFullscreen, isPreview, uncheckedLegendItems, onChangeLegend } = this.props;
    const legendConfig = {
      onChangeLegend,
      showLegend: true,
      uncheckedLegendItems,
    };
    const isCustomTooltipNeeded = this.isCustomTooltipNeeded();

    return (
      <div
        className={cx('launch-statistics-chart', {
          'area-view': this.getWidgetViewMode() === MODES_VALUES[CHART_MODES.AREA_VIEW],
          'full-screen': isFullscreen,
          'time-line': this.isTimeline(),
          preview: isPreview,
        })}
      >
        <ChartContainer
          {...getChartDefaultProps(this.props)}
          legendConfig={legendConfig}
          configData={this.getConfigData()}
          chartCreatedCallback={
            isCustomTooltipNeeded ? this.onCustomChartCreated : this.onDefaultChartCreated
          }
          isCustomTooltip={isCustomTooltipNeeded}
        />
      </div>
    );
  }
}
