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

import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { ProgressBar } from './progressBar';
import styles from './totalStatistics.scss';

const cx = classNames.bind(styles);

export class TotalStatistics extends React.PureComponent {
  static propTypes = {
    values: PropTypes.object.isRequired,
    onChartClick: PropTypes.func.isRequired,
  };

  render() {
    const { values, onChartClick } = this.props;
    const total = values.statistics$executions$total;
    const passed = values.statistics$executions$passed;
    const failed = values.statistics$executions$failed;
    const skipped = values.statistics$executions$skipped;
    const untested = values.statistics$executions$untested;
    const progressData = { total, passed, failed, skipped, untested };

    return (
      <div className={cx('container')}>
        {total >= 0 && (
          <div>
            <div className={cx('total')}>
              <div className={cx('amount')}>{total}</div>

              <div>Total</div>
            </div>
            <ProgressBar onChartClick={onChartClick} progressData={progressData} />
          </div>
        )}

        <div className={cx('details')}>
          {passed >= 0 && (
            <div className={cx('details-item')}>
              <div className={cx('amount')}>{passed}</div>

              <div className={cx('label')}>
                <div className={cx('marker', 'passed')} /> Passed
              </div>
            </div>
          )}
          {failed >= 0 && (
            <div className={cx('details-item')}>
              <div className={cx('amount')}>{failed}</div>

              <div className={cx('label')}>
                <div className={cx('marker', 'failed')} /> Failed
              </div>
            </div>
          )}
          {skipped >= 0 && (
            <div className={cx('details-item')}>
              <div className={cx('amount')}>{skipped}</div>

              <div className={cx('label')}>
                <div className={cx('marker')} /> Skipped
              </div>
            </div>
          )}
          {untested >= 0 && (
            <div className={cx('details-item')}>
              <div className={cx('amount')}>{untested}</div>

              <div className={cx('label')}>
                <div className={cx('marker')} /> Untested
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
