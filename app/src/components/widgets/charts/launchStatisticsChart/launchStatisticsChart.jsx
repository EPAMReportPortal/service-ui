import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import moment from 'moment/moment';
import { redirect } from 'redux-first-router';
import * as d3 from 'd3-selection';
import ReactDOMServer from 'react-dom/server';
import { TEST_ITEM_PAGE } from 'controllers/pages';
import { defectTypesSelector } from 'controllers/project';
import { defectLinkSelector, statisticsLinkSelector } from 'controllers/testItem';
import { activeProjectSelector } from 'controllers/user';
import { PASSED, FAILED, SKIPPED, INTERRUPTED } from 'common/constants/testStatuses';
import {
  getItemColor,
  getItemName,
  getLaunchAxisTicks,
  getTimelineAxisTicks,
  getItemNameConfig,
  getDefectTypeLocators,
} from '../common/utils';
import { C3Chart } from '../common/c3chart';
import { Legend } from '../common/legend';
import { TooltipWrapper, TooltipContent } from '../common/tooltip';
import { messages } from '../common/messages';
import {
  CHART_MODES,
  ZOOM_KEY,
  AREA_CHART_KEY,
  TIME_LINE_KEY,
  TOTAL_KEY,
  CHART_OFFSET,
} from './constants';
import styles from './launchStatisticsChart.scss';

const cx = classNames.bind(styles);

@injectIntl
@connect(
  (state) => ({
    project: activeProjectSelector(state),
    defectTypes: defectTypesSelector(state),
    getDefectLink: (params) => defectLinkSelector(state, params),
    getStatisticsLink: (params) => statisticsLinkSelector(state, params),
  }),
  {
    redirect,
  },
)
export class LaunchStatisticsChart extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    redirect: PropTypes.func,
    widget: PropTypes.object.isRequired,
    isPreview: PropTypes.bool,
    isFullscreen: PropTypes.bool,
    height: PropTypes.number,
    project: PropTypes.string.isRequired,
    defectTypes: PropTypes.object.isRequired,
    container: PropTypes.instanceOf(Element).isRequired,
    observer: PropTypes.object.isRequired,
    getDefectLink: PropTypes.func.isRequired,
    getStatisticsLink: PropTypes.func.isRequired,
  };

  static defaultProps = {
    redirect: () => {},
    getDefectLink: () => {},
    getStatisticsLink: () => {},
    isPreview: false,
    isFullscreen: false,
    height: 0,
  };

  state = {
    isConfigReady: false,
  };

  componentDidMount() {
    this.props.observer.subscribe('widgetResized', this.resizeChart);
    this.getConfig();
  }

  componentWillUnmount() {
    this.isCustomTooltipNeeded()
      ? this.removeChartListeners()
      : this.node && this.node.removeEventListener('mousemove', this.setupCoords);
    this.props.observer.unsubscribe('widgetResized', this.resizeChart);
  }

  onChartCreated = (chart, element) => {
    this.chart = chart;
    this.node = element;

    if (this.props.isPreview) {
      return;
    }

    this.isCustomTooltipNeeded() ? this.onCustomChartCreated() : this.onDefaultChartCreated();
  };

  onDefaultChartCreated = () => {
    this.node.addEventListener('mousemove', this.setupCoords);
  };

  onCustomChartCreated = () => {
    this.interactElems = d3.selectAll(
      this.node.querySelectorAll(this.isSingleColumn() ? '.c3-circle' : '.c3-area'),
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

  onMouseOut = () => {
    this.chart.revert();
  };

  onMouseOver = (id) => {
    this.chart.focus(id);
  };

  onClick = (id) => {
    this.chart.toggle(id);
  };

  onChartClick = (data) => {
    if (this.isTimeLine) {
      return; // TODO: do it when filters will be available on launches page
    }
    const { widget, getDefectLink, getStatisticsLink, defectTypes } = this.props;
    const nameConfig = getItemNameConfig(data.id);
    const id = widget.content.result[data.index].id;
    const defaultParams = this.getDefaultLinkParams(id);
    const locators = getDefectTypeLocators(nameConfig, defectTypes);

    const link = locators
      ? getDefectLink({ defects: locators, itemId: id })
      : getStatisticsLink({ statuses: this.getLinkParametersStatuses(nameConfig) });
    this.props.redirect(Object.assign(link, defaultParams));
  };

  onItemMouseOver = () => this.tooltip.style('display', 'block');

  onItemMouseOut = () => this.tooltip.style('display', 'none');

  onItemMouseMove = (data) => {
    const rectWidth = this.node.querySelectorAll('.c3-event-rect')[0].getAttribute('width');
    const currentMousePosition = d3.mouse(this.chart.element);
    const itemWidth = rectWidth / data.values.length;
    const dataIndex = Math.trunc((currentMousePosition[0] - CHART_OFFSET) / itemWidth);
    this.selectedLaunchData = data.values.find((item) => item.index === dataIndex);
    this.tooltip
      .html(() =>
        this.renderContents(
          [this.selectedLaunchData],
          null,
          null,
          (id) => this.configData.colors[id],
        ),
      )
      .style('left', `${currentMousePosition[0] - 108}px`)
      .style('top', `${currentMousePosition[1] - 72}px`);
  };

  getLinkParametersStatuses = ({ defectType }) => {
    if (defectType === TOTAL_KEY) {
      return [PASSED, FAILED, SKIPPED, INTERRUPTED];
    }
    return [defectType.toUpperCase()];
  };

  getDefaultLinkParams = (testItemIds) => ({
    payload: {
      projectId: this.props.project,
      filterId: 'all',
      testItemIds,
    },
    type: TEST_ITEM_PAGE,
  });

  setupCoords = ({ pageX, pageY }) => {
    this.x = pageX;
    this.y = pageY;
  };

  getConfig = () => {
    const { isPreview } = this.props;

    this.prepareChartData();

    this.config = {
      data: {
        columns: this.configData.chartDataOrdered,
        type: CHART_MODES[this.configData.widgetViewMode],
        onclick: !isPreview && !this.isCustomTooltipNeeded() ? this.onChartClick : null,
        order: null,
        colors: this.configData.colors,
        groups: [this.configData.itemNames],
      },
      point: {
        show: this.isSingleColumn() && this.configData.widgetViewMode === AREA_CHART_KEY,
        r: 3,
        focus: {
          expand: {
            r: 5,
          },
        },
      },
      axis: {
        x: {
          show: !isPreview,
          type: 'category',
          categories: this.configData.itemData.map((item) => {
            if (this.configData.isTimeLine) {
              const day = moment(item.date)
                .format('dddd')
                .substring(0, 3);
              return `${day}, ${item.date}`;
            }
            return `#${item.number}`;
          }),
          tick: {
            values: this.configData.isTimeLine
              ? getTimelineAxisTicks(this.configData.itemData.length)
              : getLaunchAxisTicks(this.configData.itemData.length),
            width: 60,
            centered: true,
            inner: true,
            multiline: this.configData.isTimeLine,
            outer: false,
          },
        },
        y: {
          show: !isPreview && this.props.isFullscreen,
          padding: {
            top: this.configData.widgetViewMode === AREA_CHART_KEY ? 3 : 0,
          },
        },
      },
      interaction: {
        enabled: !isPreview,
      },
      zoom: {
        enabled: !isPreview && this.configData.isZoomEnabled,
        rescale: !isPreview && this.configData.isZoomEnabled,
        onzoomend: () => {
          this.chart.flush();
        },
      },
      subchart: {
        show: !isPreview && this.configData.isZoomEnabled,
        size: {
          height: 30,
        },
      },
      padding: {
        top: isPreview ? 0 : 85,
        left: isPreview ? 0 : 40,
        right: isPreview ? 0 : 20,
        bottom: isPreview || !this.configData.isTimeLine ? 0 : 10,
      },
      legend: {
        show: false,
      },
      tooltip: {
        show: !isPreview && !this.isCustomTooltipNeeded(),
        grouped: false,
        position: this.getPosition,
        contents: this.renderContents,
      },
      size: {
        height: this.height,
      },
    };

    this.setState({
      isConfigReady: true,
    });
  };

  getPosition = (data, width, height) => {
    const rect = this.node.getBoundingClientRect();
    const left = this.x - rect.left - width / 2;
    const top = this.y - rect.top - height;

    return {
      top: top - 8,
      left,
    };
  };

  setupConfigData = (data, isTimeLine) => {
    const {
      defectTypes,
      widget: {
        content_parameters: { content_fields, widgetOptions },
      },
    } = this.props;
    const itemData = [];
    const chartData = {};
    const chartDataOrdered = [];
    const colors = {};

    Object.keys(data[0].values).forEach((key) => {
      const keyConfig = getItemNameConfig(key);
      chartData[key] = [key];
      colors[key] = getItemColor(keyConfig, defectTypes);
    });

    data.forEach((item) => {
      const currentItemData = {
        ...item,
      };
      delete currentItemData.values;
      itemData.push(currentItemData);
      Object.keys(item.values).forEach((key) => {
        const value = item.values[key];
        chartData[key].push(!Number(value) && isTimeLine ? null : Number(value));
      });
    });

    content_fields.forEach((key) => {
      chartDataOrdered.push(chartData[key]);
    });

    this.configData = {
      itemData,
      chartDataOrdered,
      itemNames: chartDataOrdered.map((item) => item[0]),
      colors,
      isTimeLine,
      isZoomEnabled: widgetOptions[ZOOM_KEY],
      widgetViewMode: widgetOptions.viewMode[0],
    };
  };

  prepareChartData = () => {
    const {
      container,
      widget: {
        content,
        content_parameters: { widgetOptions },
      },
    } = this.props;

    let data = [];
    const isTimeLine = widgetOptions[TIME_LINE_KEY];

    if (!Object.keys(content).length) {
      return;
    }

    if (isTimeLine) {
      Object.keys(content).forEach((item) => {
        data.push({
          date: item,
          values: content[item][0].values,
        });
      });
    } else {
      data = content.result;
    }

    this.height = container.offsetHeight;
    this.width = container.offsetWidth;
    this.setupConfigData(data, isTimeLine);
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

  isSingleColumn = () => this.configData.itemData.length < 2;

  isCustomTooltipNeeded = () =>
    this.configData.widgetViewMode === AREA_CHART_KEY && !this.configData.isTimeLine;

  resizeChart = () => {
    const newHeight = this.props.container.offsetHeight;
    const newWidth = this.props.container.offsetWidth;

    if (this.height !== newHeight) {
      this.chart.resize({
        height: newHeight,
      });
      this.height = newHeight;
    } else if (this.width !== newWidth) {
      this.chart.flush();
      this.width = newWidth;
    }
  };

  renderContents = (data, defaultTitleFormat, defaultValueFormat, color) => {
    const { name, number, startTime, date } = this.configData.itemData[data[0].index];
    const {
      intl: { formatMessage },
      defectTypes,
    } = this.props;
    const id = data[0].id;

    return ReactDOMServer.renderToStaticMarkup(
      <TooltipWrapper>
        <TooltipContent
          launchName={this.configData.isTimeLine ? date : name}
          launchNumber={this.configData.isTimeLine ? null : number}
          startTime={this.configData.isTimeLine ? null : Number(startTime)}
          itemCases={`${data[0].value} ${formatMessage(messages.cases)}`}
          color={color(id)}
          itemName={getItemName(getItemNameConfig(id), defectTypes, formatMessage)}
        />
      </TooltipWrapper>,
    );
  };

  render() {
    return (
      this.state.isConfigReady && (
        <C3Chart
          className={cx('launch-statistics-chart', {
            'area-view': this.configData.widgetViewMode === AREA_CHART_KEY,
            'full-screen': this.props.isFullscreen,
            preview: this.props.isPreview,
          })}
          config={this.config}
          onChartCreated={this.onChartCreated}
        >
          {!this.props.isPreview && (
            <Legend
              items={this.configData.itemNames}
              onClick={this.onClick}
              onMouseOver={this.onMouseOver}
              onMouseOut={this.onMouseOut}
            />
          )}
        </C3Chart>
      )
    );
  }
}
