/*
 * Copyright 2017 EPAM Systems
 *
 *
 * This file is part of EPAM Report Portal.
 * https://github.com/reportportal/service-ui
 *
 * Report Portal is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Report Portal is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Report Portal.  If not, see <http://www.gnu.org/licenses/>.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import * as d3 from 'd3-selection';
import classNames from 'classnames/bind';
import * as COLORS from 'common/constants/colors';
import ReactDOMServer from 'react-dom/server';
import { TooltipWrapper } from '../common/tooltip';
import { C3Chart } from '../common/c3chart';
import styles from './launchExecutionAndIssueStatistics.scss';
import { Legend } from './launchExecutionAndIssuesChartLegend';
import { LaunchExecutionAndIssueStatisticsTooltip } from './launchExecutionAndIssueStatisticsTooltip';
import { getPercentage, getDefectItems, messages } from './chartUtils';

const cx = classNames.bind(styles);

@injectIntl
export class LaunchExecutionChart extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    widget: PropTypes.object.isRequired,
    isPreview: PropTypes.bool.isRequired,
    container: PropTypes.instanceOf(Element).isRequired,
    observer: PropTypes.object.isRequired,
  };

  static defaultProps = {
    height: 0,
  };

  state = {
    isConfigReady: false,
  };

  componentDidMount() {
    this.props.observer.subscribe('widgetResized', this.resizeStatusChart);
    this.getConfig();
  }
  componentWillUnmount() {
    this.statusNode.removeEventListener('mousemove', this.setCoords);
    this.props.observer.unsubscribe('widgetResized', this.resizeStatusChart);
  }

  onStatusChartCreated = (chart, element) => {
    this.statusChart = chart;
    this.statusNode = element;
    if (!this.props.widget.content.result || this.props.isPreview) {
      return;
    }

    d3
      .select(chart.element)
      .select('.c3-chart-arcs-title')
      .attr('dy', -15)
      .append('tspan')
      .attr('dy', 30)
      .attr('x', 0)
      .attr('fill', '#666')
      .text('SUM');

    this.statusNode.addEventListener('mousemove', this.setCoords);
  };

  onStatusMouseOut = () => {
    this.statusChart.revert();
  };

  onStatusMouseOver = (id) => {
    this.statusChart.focus(id);
  };

  onStatusClick = (id) => {
    this.statusChart.toggle(id);
  };

  getConfig = () => {
    const { widget, container } = this.props;
    const statusChartData = {};
    const statusChartDataOrdered = [];
    const statusChartColors = {};
    const values = widget.content.result[0].values;

    this.height = container.offsetHeight;
    this.width = container.offsetWidth;
    this.noAvailableData = false;

    Object.keys(values).forEach((key) => {
      if (key.indexOf('$executions$') > -1) {
        const testStatus = key.split('$')[2].toUpperCase();
        statusChartData[key] = +values[key];
        statusChartColors[key] = COLORS[`COLOR_${testStatus}`];
      }
    });

    statusChartData.statistics$executions$passed &&
      statusChartDataOrdered.push([
        'statistics$executions$passed',
        statusChartData.statistics$executions$passed,
      ]);
    statusChartData.statistics$executions$failed &&
      statusChartDataOrdered.push([
        'statistics$executions$failed',
        statusChartData.statistics$executions$failed,
      ]);
    statusChartData.statistics$executions$skipped &&
      statusChartDataOrdered.push([
        'statistics$executions$skipped',
        statusChartData.statistics$executions$skipped,
      ]);

    if (
      +statusChartDataOrdered.statistics$executions$total === 0 ||
      !statusChartDataOrdered.length
    ) {
      this.noAvailableData = true;
      return;
    }

    this.leftChartHidden = !statusChartDataOrdered.length;
    this.statusItems = getDefectItems(statusChartDataOrdered);
    this.statusConfig = {
      data: {
        columns: statusChartDataOrdered,
        type: 'donut',
        order: null,
        colors: statusChartColors,
      },
      interaction: {
        enabled: !self.isPreview,
      },
      padding: {
        top: self.isPreview ? 0 : 85,
      },
      legend: {
        show: false, // we use custom legend
        position: 'bottom',
      },
      donut: {
        title: 0,
        label: {
          show: false,
          threshold: 0.05,
        },
      },
      tooltip: {
        grouped: false,
        position: this.getStatusPosition,
        contents: this.renderStatusContents,
      },
      onrendered: () => {
        let total = 0;
        if (this.statusChart) {
          this.statusChart.data.shown().forEach((dataItem) => {
            total += dataItem.values[0].value;
          });
          this.statusNode.querySelector('.c3-chart-arcs-title').childNodes[0].textContent = total;
        }
      },
    };

    this.setState({
      isConfigReady: true,
    });
  };

  setCoords = ({ pageX, pageY }) => {
    this.x = pageX;
    this.y = pageY;
  };

  getStatusPosition = (d, width, height) => {
    const rect = this.statusNode.getBoundingClientRect();
    const left = this.x - rect.left - width / 2;
    const top = this.y - rect.top - height;

    return {
      top: top - 8,
      left,
    };
  };

  resizeStatusChart = () => {
    const newHeight = this.props.container.offsetHeight;
    const newWidth = this.props.container.offsetWidth;
    if (this.height !== newHeight) {
      this.statusChart.resize({
        height: newHeight,
      });
      this.height = newHeight;
    } else if (this.width !== newWidth) {
      this.statusChart.flush();
      this.width = newWidth;
    }
  };

  // This function is a reimplementation of its d3 counterpart, and it needs 4 arguments of which 2 are not used here.
  // These two are named a and b in the original implementation.

  renderStatusContents = (data, a, b, color) => {
    const launchData = this.statusItems.find((item) => item.id === data[0].id);

    return ReactDOMServer.renderToStaticMarkup(
      <TooltipWrapper>
        <LaunchExecutionAndIssueStatisticsTooltip
          launchNumber={data[0].value}
          itemCases={getPercentage(data[0].ratio)}
          color={color(launchData.name)}
          itemName={this.props.intl.formatMessage(messages[launchData.name.split('$total')[0]])}
        />
      </TooltipWrapper>,
    );
  };

  render() {
    const { isPreview } = this.props;
    const classes = cx({ 'preview-view': isPreview });
    const { isConfigReady } = this.state;
    return (
      <div className={classes}>
        {isConfigReady && (
          <div className="launch-execution-chart">
            {!this.leftChartHidden && (
              <div className="data-js-launch-execution-chart-container">
                {!isPreview && (
                  <Legend
                    items={this.statusItems}
                    onClick={this.onStatusClick}
                    onMouseOver={this.onStatusMouseOver}
                    onMouseOut={this.onStatusMouseOut}
                  />
                )}
                <C3Chart config={this.statusConfig} onChartCreated={this.onStatusChartCreated} />
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}
