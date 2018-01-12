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
import classNames from 'classnames/bind';
import { FormattedMessage } from 'react-intl';
import { state, signal } from 'cerebral/tags';
import PropTypes from 'prop-types';
import styles from './serviceVersionsBlock.scss';
import ServiceVersionItem from './serviceVersionItem/serviceVersionItem';

const cx = classNames.bind(styles);

class ServiceVersionsBlock extends Component {
  componentWillMount() {
    this.props.getLastServiceVersions();
  }
  render() {
    return (
      <div className={cx('service-versions-block')}>
        <span className={cx('current-version')}>
          <FormattedMessage id={'ServiceVersionsBlock.currentVersion'} defaultMessage={'Current version'} />:
        </span>
        <span className={cx('versions-list')}>
          {
            Object.values(this.props.serviceVersions).map(
              (val, id) => (
                <ServiceVersionItem
                  // eslint-disable-next-line react/no-array-index-key
                  key={id}
                  serviceName={val.build.name}
                  serviceVersion={val.build.version}
                />
              ),
            )
          }
        </span>
      </div>
    );
  }
}

ServiceVersionsBlock.propTypes = {
  serviceVersions: PropTypes.object,
  getLastServiceVersions: PropTypes.func,
};
ServiceVersionsBlock.defaultProps = {
  serviceVersions: {},
  getLastServiceVersions: () => {},
};

export default Utils.connectToState({
  serviceVersions: state`app.info.data`,
  getLastServiceVersions: signal`other.modules.lastServiceVersions.getData`,
}, ServiceVersionsBlock);
