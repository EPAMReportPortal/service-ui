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

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { PRODUCT_BUG, AUTOMATION_BUG, SYSTEM_ISSUE } from 'common/constants/defectTypes';
import { StatisticsLink } from 'pages/inside/common/statisticsLink';
import { isStepLevelSelector } from 'controllers/testItem';
import { DefectTypeBlock } from './defectTypeBlock';
import styles from './infoLine.scss';

const cx = classNames.bind(styles);

const messages = defineMessages({
  passed: {
    id: 'InfoLine.passed',
    defaultMessage: 'Passed {value}%',
  },
  total: {
    id: 'InfoLine.total',
    defaultMessage: 'Total:',
  },
});

const normalizeExecutions = (executions) => ({
  total: executions.total || 0,
  passed: executions.passed || 0,
  failed: executions.failed || 0,
  skipped: executions.skipped || 0,
  untested: executions.untested || 0,
});

@connect((state) => ({
  isStepLevel: isStepLevelSelector(state),
}))
@injectIntl
export class InfoLine extends Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    isStepLevel: PropTypes.bool.isRequired,
    detailedView: PropTypes.bool,
    detailedStatistics: PropTypes.object,
    events: PropTypes.object,
  };
  static defaultProps = {
    events: {},
    detailedView: false,
    detailedStatistics: {},
  };

  render() {
    const {
      intl: { formatMessage },
      events,
      data,
      detailedView,
      detailedStatistics,
      isStepLevel,
    } = this.props;
    const defects = data.statistics.defects;
    const executions = normalizeExecutions(data.statistics.executions);
    const passed = (executions.passed / executions.total) * 100 || 0;
    const tooltipEventsInfo = {
      [PRODUCT_BUG]: events.PB_TOOLTIP,
      [SYSTEM_ISSUE]: events.SI_TOOLTIP,
      [AUTOMATION_BUG]: events.AB_TOOLTIP,
    };
    return (
      <div className={cx('info-line', { 'detailed-view': detailedView })}>
        <div className={cx('passed')}>
          {formatMessage(messages.passed, { value: passed.toFixed(2) })}
        </div>
        <div className={cx('total')}>
          {formatMessage(messages.total)}
          {detailedView ? (
            <Fragment>
              <StatisticsLink className={cx('value')}>{executions.total}</StatisticsLink>
              {detailedStatistics.executions.total && isStepLevel ? (
                <StatisticsLink keepFilterParams className={cx('value-detailed')}>
                  {detailedStatistics.executions.total}
                </StatisticsLink>
              ) : (
                <span className={cx('value-detailed', { disabled: !isStepLevel })}>
                  {detailedStatistics.executions.total || 0}
                </span>
              )}
            </Fragment>
          ) : (
            <span className={cx('value')}>{executions.total}</span>
          )}
        </div>
        <div className={cx('defect-types')}>
          {Object.keys(defects).map((key) => (
            <div key={key} className={cx('defect-type')}>
              <DefectTypeBlock
                type={key}
                data={defects[key]}
                detailedView={detailedView}
                detailedData={detailedStatistics.defects[key]}
                isStepLevel={isStepLevel}
                tooltipEventInfo={tooltipEventsInfo[key]}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}
