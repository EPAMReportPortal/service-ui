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
import { injectIntl, defineMessages } from 'react-intl';
import Parser from 'html-react-parser';
import { InputCheckbox } from 'components/inputs/inputCheckbox';
import {
  PASSED,
  FAILED,
  SKIPPED,
  ALL_STATUSES,
  WARN,
  INFO,
  UNTESTED,
} from 'common/constants/testStatuses';
import { formatStatus } from 'common/utils/localizationUtils';
import ArrowIcon from 'common/img/arrow-down-inline.svg';

import styles from './logStatusBlock.scss';

const messages = defineMessages({
  [`status${PASSED}`]: {
    id: 'LogStatusBlock.statusPassed',
    defaultMessage: 'Passed',
  },
  [`status${FAILED}`]: {
    id: 'LogStatusBlock.statusFailed',
    defaultMessage: 'Failed',
  },
  [`status${UNTESTED}`]: {
    id: 'LogStatusBlock.statusUntested',
    defaultMessage: 'Untested',
  },
  [`status${SKIPPED}`]: {
    id: 'LogStatusBlock.statusSkipped',
    defaultMessage: 'Skipped',
  },
  [`status${ALL_STATUSES}`]: {
    id: 'LogStatusBlock.statusLabel',
    defaultMessage: 'All statuses',
  },
  statusAllLabel: {
    id: 'LogStatusBlock.statusAllLabel',
    defaultMessage: 'ALL',
  },
});

const cx = classNames.bind(styles);

@injectIntl
export class LogStatusBlock extends Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    onChangeLogStatusFilter: PropTypes.func.isRequired,
    logStatus: PropTypes.string,
  };

  static defaultProps = {
    logStatus: null,
  };

  state = {
    opened: false,
  };

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  }

  getLogStatusArray = () => {
    const { logStatus } = this.props;
    return logStatus ? logStatus.split(',') : [];
  };

  getStatusLabel = () => {
    const arr = this.getLogStatusArray();
    if (!arr.length || arr.length === this.statusArray.length) {
      return this.formatStatus(ALL_STATUSES).toUpperCase();
    }

    return arr
      .map(this.formatStatus)
      .join(', ')
      .toUpperCase();
  };

  formatStatus = (status) =>
    messages[`status${status}`]
      ? this.props.intl.formatMessage(messages[`status${status}`])
      : formatStatus(this.props.intl.formatMessage, status);

  node = React.createRef();

  statusArray = [PASSED, FAILED, SKIPPED, WARN, INFO, UNTESTED];

  toggleDropdown = () => {
    this.setState((prevState) => ({
      opened: !prevState.opened,
    }));
  };

  toggleCheckbox = (value) => {
    const { onChangeLogStatusFilter } = this.props;
    let arr = this.getLogStatusArray();
    if (this.isCheckboxActive(value)) {
      arr = arr.filter((status) => status !== value);
    } else {
      arr = [...arr, value];
    }
    const status = arr.length ? arr.join(',') : undefined;
    onChangeLogStatusFilter(status);
  };

  toggleAll = () => {
    const { onChangeLogStatusFilter } = this.props;
    const arr = this.getLogStatusArray();
    let status = this.statusArray.join(',');
    if (arr.length === this.statusArray.length) {
      status = undefined;
    }
    onChangeLogStatusFilter(status);
  };

  isCheckboxActive = (value) => this.getLogStatusArray().includes(value);

  handleClickOutside = (e) => {
    if (this.node.current && !this.node.current.contains(e.target) && this.state.opened) {
      this.setState({ opened: false });
    }
  };

  renderStatusList = () => {
    return this.statusArray.map((status) => (
      <div className={cx('status-list-item')} key={status}>
        <InputCheckbox
          value={this.isCheckboxActive(status)}
          onChange={() => {
            this.toggleCheckbox(status);
          }}
        >
          {this.formatStatus(status)}
        </InputCheckbox>
      </div>
    ));
  };

  render() {
    const { opened } = this.state;
    const { intl } = this.props;
    return (
      <div className={cx('status-cell')} ref={this.node}>
        <div
          className={cx('status-label', {
            opened,
          })}
          onClick={this.toggleDropdown}
        >
          {this.getStatusLabel()} {Parser(ArrowIcon)}
        </div>
        {opened && (
          <div className={cx('status-list')}>
            <div className={cx('select-all-block')} onClick={this.toggleAll}>
              {intl.formatMessage(messages.statusAllLabel)}
            </div>
            {this.renderStatusList()}
          </div>
        )}
      </div>
    );
  }
}
