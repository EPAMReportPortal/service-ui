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
import { ChartContainer } from 'components/widgets/common/c3chart';
import {
  getChartDefaultProps,
  getDefaultTestItemLinkParams,
} from 'components/widgets/common/utils';
import { connect } from 'react-redux';
import { statisticsLinkSelector } from 'controllers/testItem';
import { activeProjectSelector } from 'controllers/user';
import { FAILED, SKIPPED, INTERRUPTED, UNTESTED } from 'common/constants/testStatuses';
import { getConfig } from './config/getConfig';
import styles from './nonPassedTestCasesTrendChart.scss';

const cx = classNames.bind(styles);

const FAILED_SKIPPED_UNTESTED_STATISTICS_KEY = 'statistics$executions$failedSkippedUntestedTotal';

@injectIntl
@connect(
  (state) => ({
    project: activeProjectSelector(state),
    getStatisticsLink: statisticsLinkSelector(state),
  }),
  {
    navigate: (linkAction) => linkAction,
  },
)
export class NonPassedTestCasesTrendChart extends Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    widget: PropTypes.object.isRequired,
    container: PropTypes.instanceOf(Element).isRequired,
    getStatisticsLink: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    project: PropTypes.string.isRequired,
    isPreview: PropTypes.bool,
    height: PropTypes.number,
    observer: PropTypes.object,
  };

  static defaultProps = {
    isPreview: false,
    height: 0,
    observer: {},
  };

  onChartClick = (data) => {
    const { widget, getStatisticsLink, project } = this.props;
    const launchIds = widget.content.result.map((item) => item.id);
    const link = getStatisticsLink({
      statuses: [FAILED, SKIPPED, INTERRUPTED, UNTESTED],
      types: null,
    });
    const navigationParams = getDefaultTestItemLinkParams(
      project,
      widget.appliedFilters[0].id,
      launchIds[data.index],
    );

    this.props.navigate(Object.assign(link, navigationParams));
  };

  configData = {
    getConfig,
    onChartClick: this.onChartClick,
    formatMessage: this.props.intl.formatMessage,
  };

  legendConfig = {
    showLegend: true,
    legendProps: {
      items: [FAILED_SKIPPED_UNTESTED_STATISTICS_KEY],
      disabled: true,
    },
  };

  render() {
    return (
      <div className={cx('non-passed-cases-trend-chart')}>
        <ChartContainer
          {...getChartDefaultProps(this.props)}
          configData={this.configData}
          legendConfig={this.legendConfig}
        />
      </div>
    );
  }
}
