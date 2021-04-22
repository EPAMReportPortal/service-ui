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
import { URLS } from 'common/urls';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { fetch } from 'common/utils';
import { connect } from 'react-redux';
import { injectIntl, defineMessages } from 'react-intl';
import {
  STATS_AB_TOTAL,
  STATS_ND_TOTAL,
  STATS_PB_TOTAL,
  STATS_SI_TOTAL,
  STATS_TI_TOTAL,
  STATS_FAILED,
  STATS_PASSED,
  STATS_SKIPPED,
  STATS_UNTESTED,
} from 'common/constants/statistics';
import { withModal, ModalLayout } from 'components/main/modal';
import { SpinningPreloader } from 'components/preloaders/spinningPreloader';
import { COMMON_LOCALE_KEYS } from 'common/constants/localization';
import { defectColorsSelector } from 'controllers/project';
import { activeProjectSelector } from 'controllers/user';
import { LaunchesComparisonChart } from 'components/widgets/singleLevelWidgets/charts';
import styles from './launchCompareModal.scss';

const cx = classNames.bind(styles);
const messages = defineMessages({
  compareLaunchHeader: {
    id: 'CompareLaunchDialog.compareLaunchHeader',
    defaultMessage: 'Compare launches',
  },
});

const contentParameters = {
  contentFields: [
    STATS_PASSED,
    STATS_FAILED,
    STATS_SKIPPED,
    STATS_UNTESTED,
    STATS_PB_TOTAL,
    STATS_AB_TOTAL,
    STATS_SI_TOTAL,
    STATS_ND_TOTAL,
    STATS_TI_TOTAL,
  ],
};

@withModal('launchCompareModal')
@injectIntl
@connect((state) => ({
  defectColors: defectColorsSelector(state),
  activeProject: activeProjectSelector(state),
}))
export class LaunchCompareModal extends Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    activeProject: PropTypes.string.isRequired,
    defectColors: PropTypes.object.isRequired,
    data: PropTypes.shape({
      ids: PropTypes.array,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      chartData: null,
    };
  }

  componentDidMount() {
    const { activeProject, data } = this.props;
    fetch(URLS.launchesCompare(activeProject, data.ids.join(','))).then(this.prepareConfig);
  }

  prepareConfig = (content) => {
    this.setState({
      chartData: {
        content,
        contentParameters,
      },
    });
  };

  containerRef = React.createRef();

  render() {
    const { intl } = this.props;
    const { chartData } = this.state;
    const cancelButton = {
      text: intl.formatMessage(COMMON_LOCALE_KEYS.CANCEL),
    };

    return (
      <ModalLayout
        className={cx('launch-compare-modal')}
        title={intl.formatMessage(messages.compareLaunchHeader)}
        cancelButton={cancelButton}
      >
        <div ref={this.containerRef} className={cx('chart-container')}>
          {this.state.chartData ? (
            <LaunchesComparisonChart
              widget={chartData}
              container={this.containerRef.current}
              clickable={false}
            />
          ) : (
            <SpinningPreloader />
          )}
        </div>
      </ModalLayout>
    );
  }
}
