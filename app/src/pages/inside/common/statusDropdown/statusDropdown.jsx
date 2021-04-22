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
import { connect } from 'react-redux';
import className from 'classnames/bind';
import { injectIntl, defineMessages } from 'react-intl';
import { activeProjectSelector } from 'controllers/user';
import { fetchTestItemsAction } from 'controllers/testItem';
import { NOTIFICATION_TYPES, showNotification } from 'controllers/notification';
import { fetch } from 'common/utils/fetch';
import { URLS } from 'common/urls';
import { InputDropdown } from 'components/inputs/inputDropdown';
import { formatStatus } from 'common/utils/localizationUtils';
import { PASSED, FAILED, SKIPPED, IN_PROGRESS, UNTESTED } from 'common/constants/testStatuses';
import { ATTRIBUTE_KEY_MANUALLY } from './constants';
import styles from './statusDropdown.scss';

const cx = className.bind(styles);

const messages = defineMessages({
  itemUpdateSuccess: {
    id: 'EditItemsModal.itemUpdateSuccess',
    defaultMessage: 'Completed successfully!',
  },
  itemUpdateError: {
    id: 'EditItemsModal.itemUpdateError',
    defaultMessage: 'Completed with error!',
  },
});

@connect(
  (state) => ({
    currentProject: activeProjectSelector(state),
  }),
  {
    fetchFunc: fetchTestItemsAction,
    showMessage: showNotification,
  },
)
@injectIntl
export class StatusDropdown extends Component {
  static propTypes = {
    currentProject: PropTypes.string.isRequired,
    intl: PropTypes.object.isRequired,
    itemId: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    attributes: PropTypes.array,
    description: PropTypes.string,
    fetchFunc: PropTypes.func,
    showMessage: PropTypes.func,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    attributes: [],
    description: '',
    fetchFunc: () => {},
    showMessage: () => {},
    onChange: () => {},
  };

  updateItem = (newStatus) => {
    const {
      intl: { formatMessage },
      currentProject,
      status: oldStatus,
      itemId,
      attributes,
      description,
      fetchFunc,
      showMessage,
      onChange,
    } = this.props;
    const newAttribute = { key: ATTRIBUTE_KEY_MANUALLY, value: newStatus.toLowerCase() };
    const newAttributes = attributes
      .filter((item) => item.key !== ATTRIBUTE_KEY_MANUALLY)
      .concat(newAttribute);
    const data = {
      attributes: newAttributes,
      description,
      status: newStatus,
    };

    if (newStatus === oldStatus) return;

    onChange(oldStatus, newStatus);

    fetch(URLS.testItemUpdate(currentProject, itemId), { method: 'put', data })
      .then(() => {
        showMessage({
          message: formatMessage(messages.itemUpdateSuccess),
          type: NOTIFICATION_TYPES.SUCCESS,
        });
        fetchFunc();
      })
      .catch(() => {
        showMessage({
          message: formatMessage(messages.itemUpdateError),
          type: NOTIFICATION_TYPES.ERROR,
        });
      });
  };

  generateOptions = (status) => {
    const { intl } = this.props;

    const STATUS_TYPES = status === IN_PROGRESS ? [] : [PASSED, FAILED, SKIPPED, UNTESTED];

    if (STATUS_TYPES.indexOf(status) < 0) STATUS_TYPES.push(status);

    return STATUS_TYPES.map((item) => ({
      label: formatStatus(intl.formatMessage, item),
      value: item,
    }));
  };

  render() {
    const { status } = this.props;
    return (
      <div className={cx('status-dropdown')}>
        <InputDropdown
          options={this.generateOptions(status)}
          value={status}
          onChange={this.updateItem}
          customClasses={{
            dropdown: cx('dropdown'),
            selectBlock: cx('select-block'),
            arrow: cx('arrow'),
            value: cx('value'),
            selectList: cx('select-list'),
          }}
          mobileDisabled
        />
      </div>
    );
  }
}
