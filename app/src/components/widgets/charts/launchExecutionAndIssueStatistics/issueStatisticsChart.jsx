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
import 'c3/c3.css';
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
export class IssueStatisticsChart extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    widget: PropTypes.object.isRequired,
    isPreview: PropTypes.bool,
    container: PropTypes.instanceOf(Element).isRequired,
    observer: PropTypes.object.isRequired,
  };

  static defaultProps = {
    isPreview: false,
    height: 0,
  };

  state = {
    isConfigReady: false,
  };

  componentDidMount() {
    this.props.observer.subscribe('widgetResized', this.resizeIssuesChart);
    this.getConfig();
  }
  componentWillUnmount() {
    this.issuesNode.removeEventListener('mousemove', this.setCoords);
    this.props.observer.unsubscribe('widgetResized', this.resizeIssuesChart);
  }

  onIssuesChartCreated = (chart, element) => {
    this.issuesChart = chart;
    this.issuesNode = element;
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
      .text('ISSUES');

    this.issuesNode.addEventListener('mousemove', this.setCoords);
  };

  onIssuesMouseOut = () => {
    this.issuesChart.revert();
  };

  onIssuesMouseOver = (id) => {
    this.issuesChart.focus(id);
  };

  onIssuesClick = (id) => {
    this.issuesChart.toggle(id);
  };

  getConfig = () => {
    const { widget, container } = this.props;
    const defectTypesChartData = {};
    const defectTypesChartDataOrdered = [];
    const defectTypesChartColors = {};
    const values = widget.content.result[0].values;

    this.height = container.offsetHeight;
    this.width = container.offsetWidth;
    this.noAvailableData = false;

    Object.keys(values).forEach((key) => {
      if (!key.includes('$executions$')) {
        const defectStatus = key.split('$')[2].toUpperCase();
        defectTypesChartData[key] = +values[key];
        defectTypesChartColors[key] = COLORS[`COLOR_${defectStatus}`];
      }
    });

    widget.contentParameters.contentFields.forEach((field) => {
      Object.keys(defectTypesChartData).forEach((key) => {
        if (field === key) {
          defectTypesChartDataOrdered.push([field, defectTypesChartData[field]]);
        }
      });
    });

    if (!defectTypesChartDataOrdered.length) {
      this.noAvailableData = true;
      return;
    }

    this.rightChartHidden = !defectTypesChartDataOrdered.length;
    this.defectItems = getDefectItems(defectTypesChartDataOrdered);
    this.issueConfig = {
      data: {
        columns: defectTypesChartDataOrdered,
        type: 'donut',
        order: null,
        colors: defectTypesChartColors,
      },
      interaction: {
        enabled: !self.isPreview,
      },
      padding: {
        top: self.isPreview ? 0 : 85,
      },
      legend: {
        show: false, // we use custom legend
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
        position: this.getIssuesPosition,
        contents: this.renderIssuesContents,
      },
      onrendered: () => {
        let total = 0;
        if (this.issuesChart) {
          this.issuesChart.data.shown().forEach((dataItem) => {
            total += dataItem.values[0].value;
          });
          this.issuesNode.querySelector('.c3-chart-arcs-title').childNodes[0].textContent = total;
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

  getIssuesPosition = (d, width, height) => {
    const rect = this.issuesNode.getBoundingClientRect();
    const left = this.x - rect.left - width / 2;
    const top = this.y - rect.top - height;

    return {
      top: top - 8,
      left,
    };
  };

  resizeIssuesChart = () => {
    const newHeight = this.props.container.offsetHeight;
    const newWidth = this.props.container.offsetWidth;
    if (this.height !== newHeight) {
      this.issuesChart.resize({
        height: newHeight,
      });
      this.height = newHeight;
    } else if (this.width !== newWidth) {
      this.issuesChart.flush();
      this.width = newWidth;
    }
  };

  // This function is a reimplementation of its d3 counterpart, and it needs 4 arguments of which 2 are not used here.
  // These two are named a and b in the original implementation.
  renderIssuesContents = (data, a, b, color) => {
    const launchData = this.defectItems.find((item) => item.id === data[0].id);

    return ReactDOMServer.renderToStaticMarkup(
      <TooltipWrapper>
        <LaunchExecutionAndIssueStatisticsTooltip
          launchNumber={data[0].value}
          itemCases={getPercentage(data[0].ratio)}
          color={color(data[0].name)}
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
          <div className="issue-statistics-chart">
            {!this.rightChartHidden && (
              <div className="data-js-issue-statistics-chart-container">
                {!isPreview && (
                  <Legend
                    items={this.defectItems}
                    onClick={this.onIssuesClick}
                    onMouseOver={this.onIssuesMouseOver}
                    onMouseOut={this.onIssuesMouseOut}
                  />
                )}
                <C3Chart config={this.issueConfig} onChartCreated={this.onIssuesChartCreated} />
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}
