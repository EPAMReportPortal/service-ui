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
import { defineMessages, injectIntl } from 'react-intl';
import { reduxForm } from 'redux-form';
import { SETTINGS_PAGE_EVENTS } from 'components/main/analytics/events';
import { InputBigSwitcher } from 'components/inputs/inputBigSwitcher';
import { FormField } from 'components/fields/formField';
import { LABEL_WIDTH, ENABLED_FIELD_KEY } from '../constants';

const messages = defineMessages({
  toggleNotificationsLabel: {
    id: 'NotificationsEnableForm.toggleNotificationsLabel',
    defaultMessage: 'E-mail notification',
  },
  toggleNotificationsNote: {
    id: 'NotificationsEnableForm.toggleNotificationsNote',
    defaultMessage: 'Send e-mail notifications about launches finished',
  },
  title: {
    id: 'NotificationsEnableForm.title',
    defaultMessage: 'No integrations with E-mail',
  },
});

@reduxForm({
  form: 'notificationsEnableForm',
})
@injectIntl
export class NotificationsEnableForm extends Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    initialize: PropTypes.func.isRequired,
    initialValues: PropTypes.object,
    readOnly: PropTypes.bool,
    isEmailIntegrationAvailable: PropTypes.bool,
  };

  static defaultProps = {
    initialValues: {},
    readOnly: true,
    isEmailIntegrationAvailable: true,
  };

  componentDidMount() {
    this.props.initialize(this.props.initialValues);
  }

  getCustomBlock = () => ({
    node: <p>{this.props.intl.formatMessage(messages.toggleNotificationsNote)}</p>,
  });

  render() {
    const { intl, readOnly, isEmailIntegrationAvailable } = this.props;
    const titleMessage = !isEmailIntegrationAvailable ? intl.formatMessage(messages.title) : '';

    return (
      <Fragment>
        <FormField
          label={intl.formatMessage(messages.toggleNotificationsLabel)}
          labelWidth={LABEL_WIDTH}
          customBlock={this.getCustomBlock()}
          name={ENABLED_FIELD_KEY}
          disabled={readOnly}
          format={Boolean}
          parse={Boolean}
        >
          <InputBigSwitcher
            title={titleMessage}
            onChangeEventInfo={SETTINGS_PAGE_EVENTS.EDIT_INPUT_NOTIFICATIONS}
            mobileDisabled
          />
        </FormField>
      </Fragment>
    );
  }
}
