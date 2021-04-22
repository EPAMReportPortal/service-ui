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
import classNames from 'classnames/bind';
import { SKIPPED, RESETED, FAILED, NOT_FOUND, UNTESTED } from 'common/constants/testStatuses';
import Parser from 'html-react-parser';
import NoItemIcon from './img/noItem-inline.svg';
import EmptyItemIcon from './img/emptyItem-inline.svg';
import styles from './historyLineItemBadge.scss';

const cx = classNames.bind(styles);

export class HistoryLineItemBadge extends Component {
  static propTypes = {
    active: PropTypes.bool,
    status: PropTypes.string,
    issue: PropTypes.object,
    defects: PropTypes.object,
    defectTypes: PropTypes.object.isRequired,
  };

  static defaultProps = {
    active: false,
    status: '',
    issue: {},
    defects: {},
  };

  getDefectBadge = () => {
    const {
      defects,
      defectTypes,
      issue: { issueType: issueLocator },
    } = this.props;
    let badge = '';
    const defectType = Object.keys(defects).find((key) => defects[key].total);

    if (defectType) {
      const allDefectsList = Object.values(defectTypes).reduce(
        (allDefects, nextGroup) => [...allDefects, ...nextGroup],
        [],
      );
      const { shortName, color: defectColor } =
        allDefectsList.find((el) => el.locator === issueLocator) || {};

      badge = (
        <Fragment key={defectType}>
          <span className={cx('defect-badge')} style={{ backgroundColor: defectColor }} />
          <span className={cx('defect-name')}>{shortName}</span>
        </Fragment>
      );
    }

    return badge;
  };

  getBadge = () => {
    const { status } = this.props;
    let badge = null;

    switch (status) {
      case FAILED:
      case UNTESTED:
      case SKIPPED: {
        badge = this.getDefectBadge();
        break;
      }
      case RESETED: {
        badge = (
          <i key={status} className={cx('empty-item-icon')}>
            {Parser(EmptyItemIcon)}
          </i>
        );
        break;
      }
      case NOT_FOUND: {
        badge = (
          <i key={status} className={cx('no-item-icon')}>
            {Parser(NoItemIcon)}
          </i>
        );
        break;
      }
      default:
        break;
    }

    return badge;
  };

  render() {
    return <div className={cx('badge-container')}>{this.getBadge()}</div>;
  }
}
