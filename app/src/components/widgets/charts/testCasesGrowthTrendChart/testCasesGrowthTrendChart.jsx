import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import ReactDOMServer from 'react-dom/server';
import { connect } from 'react-redux';
import { redirect } from 'redux-first-router';
import moment from 'moment';
import { injectIntl, defineMessages, intlShape } from 'react-intl';
import { dateFormat } from 'common/utils/timeDateUtils';
import { statisticsLinkSelector } from 'controllers/testItem';
import { activeProjectSelector } from 'controllers/user';
import { TEST_ITEM_PAGE } from 'controllers/pages';
import * as COLORS from 'common/constants/colors';
import * as STATUSES from 'common/constants/testStatuses';
import { CHART_MODES, MODES_VALUES } from 'common/constants/chartModes';
import { C3Chart } from '../common/c3chart';
import { TooltipWrapper } from '../common/tooltip';
import { getLaunchAxisTicks, getTimelineAxisTicks } from '../common/utils';
import styles from './testCasesGrowthTrendChart.scss';

const cx = classNames.bind(styles);

const messages = defineMessages({
  cases: {
    id: 'Widgets.cases',
    defaultMessage: 'cases',
  },
  growTestCases: {
    id: 'Widgets.growtestCases',
    defaultMessage: 'Grow test cases',
  },
  totalTestCases: {
    id: 'Widgets.totalTestCases',
    defaultMessage: 'Total test cases',
  },
});

@injectIntl
@connect(
  (state) => ({
    project: activeProjectSelector(state),
    statisticsLink: statisticsLinkSelector(state, {
      statuses: [STATUSES.PASSED, STATUSES.FAILED, STATUSES.SKIPPED, STATUSES.INTERRUPTED],
    }),
  }),
  {
    redirect,
  },
)
export class TestCasesGrowthTrendChart extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    widget: PropTypes.object.isRequired,
    isPreview: PropTypes.bool,
    height: PropTypes.number,
    container: PropTypes.instanceOf(Element).isRequired,
    observer: PropTypes.object.isRequired,
    project: PropTypes.string.isRequired,
    statisticsLink: PropTypes.object.isRequired,
    redirect: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isPreview: false,
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
    this.node.removeEventListener('mousemove', this.setupCoords);
    this.props.observer.unsubscribe('widgetResized', this.resizeChart);
  }

  onChartCreated = (chart, element) => {
    this.chart = chart;
    this.node = element;

    this.node.addEventListener('mousemove', this.setupCoords);
  };

  onChartClick = (d) => {
    if (this.isTimeLine) {
      return;
    }

    const { widget, statisticsLink } = this.props;
    const id = widget.content.result[d.index].id;
    const defaultParams = this.getDefaultLinkParams(id);

    this.props.redirect(Object.assign(statisticsLink, defaultParams));
  };

  setupCoords = ({ pageX, pageY }) => {
    this.x = pageX;
    this.y = pageY;
  };

  getDefaultLinkParams = (testItemIds) => ({
    payload: {
      projectId: this.props.project,
      filterId: 'all',
      testItemIds,
    },
    type: TEST_ITEM_PAGE,
  });

  getConfig = () => {
    const { widget, intl, isPreview, container } = this.props;
    this.isTimeLine =
      widget.contentParameters &&
      widget.contentParameters.widgetOptions.mode === MODES_VALUES[CHART_MODES.TIMELINE_MODE];

    let data;

    if (this.isTimeLine) {
      data = Object.keys(widget.content).map((key) => ({
        date: key,
        ...widget.content[key],
      }));
    } else {
      data = widget.content.result;
    }
    this.height = container.offsetHeight;
    this.width = container.offsetWidth;
    this.itemData = [];

    const offsets = ['offset'];
    const bars = ['bar'];
    this.positiveTrend = [];

    data.forEach((item) => {
      if (+item.delta < 0) {
        this.positiveTrend.push(false);
        offsets.push(+item.statistics$executions$total);
      } else {
        this.positiveTrend.push(true);
        offsets.push(+item.statistics$executions$total - +item.delta);
      }
      bars.push(Math.abs(+item.delta));

      if (this.isTimeLine) {
        this.itemData.push({ date: item.date });
      } else {
        this.itemData.push({
          id: item.id,
          name: item.name,
          number: item.number,
          startTime: item.startTime,
        });
      }
    });

    this.config = {
      data: {
        columns: [offsets, bars],
        type: MODES_VALUES[CHART_MODES.BAR_VIEW],
        order: null,
        groups: [['offset', 'bar']],
        onclick: this.onChartClick,
        color: (c, d) => {
          let color;
          switch (d.id) {
            case 'bar':
              if (this.positiveTrend[d.index]) {
                color = COLORS.COLOR_DARK_PASTEL_GREEN;
                break;
              }
              color = COLORS.COLOR_ORANGE_RED;
              break;
            default:
              color = null;
              break;
          }
          return color;
        },
        labels: {
          format: (v, id, i) => {
            let step = this.itemData.length < 20 ? 1 : 2;
            if (this.isTimeLine && this.itemData.length >= 20) {
              step = 6;
            }

            if (isPreview || id !== 'bar' || i % step !== 0) {
              return null;
            }
            return this.positiveTrend[i] ? v : -v;
          },
        },
      },
      grid: {
        y: {
          show: !isPreview,
        },
      },
      axis: {
        x: {
          show: !isPreview,
          type: 'category',
          categories: this.itemData.map((item) => {
            let day;
            if (this.isTimeLine) {
              day = moment(item.date)
                .format('dddd')
                .substring(0, 3);
              return `${day}, ${item.date}`;
            }
            return `#${item.number}`;
          }),
          tick: {
            values: this.isTimeLine
              ? getTimelineAxisTicks(this.itemData.length)
              : getLaunchAxisTicks(this.itemData.length),
            width: 60,
            centered: true,
            inner: true,
            outer: false,
            multiline: this.isTimeLine,
          },
        },
        y: {
          show: !isPreview,
          padding: {
            top: 10,
            bottom: 0,
          },
          label: {
            text: `${intl.formatMessage(messages.cases)}`,
            position: 'outer-middle',
          },
        },
      },
      interaction: {
        enabled: !isPreview,
      },
      padding: {
        top: isPreview ? 0 : 10,
        left: isPreview ? 0 : 60,
        right: isPreview ? 0 : 20,
        bottom: isPreview || !this.isTimeLine ? 0 : 10,
      },
      legend: {
        show: false,
      },
      size: {
        height: this.height,
      },
      tooltip: {
        grouped: true,
        position: this.getTooltipPosition,
        contents: this.renderTooltip,
      },
    };

    this.setState({
      isConfigReady: true,
    });
  };

  getTooltipPosition = (d, width, height) => {
    const rect = this.node.getBoundingClientRect();
    const left = this.x - rect.left - width / 2;
    const top = this.y - rect.top - height;

    return {
      top: top - 8,
      left,
    };
  };

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

  renderTooltip = (d) => {
    const { name, number, startTime, date } = this.itemData[d[0].index];

    let total;
    let growth;
    if (this.positiveTrend[d[0].index]) {
      growth = d[1].value;
      total = d[0].value + d[1].value;
    } else {
      growth = -d[1].value;
      total = d[0].value;
    }

    const growthClass = classNames({
      increase: growth > 0,
      decrease: growth < 0,
    });

    return ReactDOMServer.renderToStaticMarkup(
      <TooltipWrapper>
        {!this.isTimeLine && <div className={cx('launch-name')}>{`${name} #${number}`}</div>}
        <div className={cx('launch-start-time', { 'timeline-mode': this.isTimeLine })}>
          {this.isTimeLine ? date : dateFormat(Number(startTime))}
        </div>
        <div className={cx('item-wrapper')}>
          <div className={cx('item-cases')}>
            <div className={cx('item-cases-growth')}>
              {this.props.intl.formatMessage(messages.growTestCases)}:{' '}
              <span className={cx(growthClass)}>{growth}</span>
            </div>
            <div className={cx('item-cases-total')}>
              {this.props.intl.formatMessage(messages.totalTestCases)}: <span>{total}</span>
            </div>
          </div>
        </div>
      </TooltipWrapper>,
    );
  };

  render() {
    return (
      this.state.isConfigReady && (
        <C3Chart config={this.config} onChartCreated={this.onChartCreated} />
      )
    );
  }
}
