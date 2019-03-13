import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import { injectIntl, defineMessages, intlShape } from 'react-intl';
import Parser from 'html-react-parser';
import { fetch } from 'common/utils';
import { URLS } from 'common/urls';
import { showModalAction } from 'controllers/modal';
import { COMMON_LOCALE_KEYS } from 'common/constants/localization';
import { showScreenLockAction, hideScreenLockAction } from 'controllers/screenLock';
import { projectIdSelector } from 'controllers/pages';
import { fetchProjectIntegrationsAction } from 'controllers/project';
import {
  showNotification,
  showDefaultErrorNotification,
  NOTIFICATION_TYPES,
} from 'controllers/notification';
import InfoIcon from 'common/img/info-inline.svg';
import CheckIcon from 'common/img/check-inline.svg';
import TrashIcon from 'common/img/trashcan-inline.svg';
import styles from './connectionSection.scss';

const cx = classNames.bind(styles);

const messages = defineMessages({
  connectionTitle: {
    id: 'ConnectionSection.connectionTitle',
    defaultMessage: 'Connection',
  },
  connectedMessage: {
    id: 'ConnectionSection.connectedMessage',
    defaultMessage: 'Connected',
  },
  connectionFailedMessage: {
    id: 'ConnectionSection.connectionFailedMessage',
    defaultMessage: 'Connection Failed',
  },
  removeIntegrationTitle: {
    id: 'ConnectionSection.removeIntegrationTitle',
    defaultMessage: 'Remove Integration',
  },
  removeIntegrationMessage: {
    id: 'ConnectionSection.removeIntegrationMessage',
    defaultMessage: 'Do you really want to remove the integration?',
  },
  removeIntegrationSuccess: {
    id: 'ConnectionSection.removeIntegrationSuccess',
    defaultMessage: 'Integration successfully deleted',
  },
});

@connect(
  (state) => ({
    projectId: projectIdSelector(state),
  }),
  {
    showModalAction,
    showScreenLockAction,
    hideScreenLockAction,
    showNotification,
    showDefaultErrorNotification,
    fetchProjectIntegrationsAction,
  },
)
@injectIntl
export class ConnectionSection extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    projectId: PropTypes.string.isRequired,
    integrationId: PropTypes.number.isRequired,
    onRemoveConfirmation: PropTypes.func.isRequired,
    showModalAction: PropTypes.func.isRequired,
    showScreenLockAction: PropTypes.func.isRequired,
    hideScreenLockAction: PropTypes.func.isRequired,
    showNotification: PropTypes.func.isRequired,
    showDefaultErrorNotification: PropTypes.func.isRequired,
    fetchProjectIntegrationsAction: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    failedConnectionMessage: PropTypes.string,
  };

  static defaultProps = {
    disabled: false,
    failedConnectionMessage: null,
  };

  removeIntegration = () => {
    const {
      intl: { formatMessage },
      projectId,
      onRemoveConfirmation,
      integrationId,
    } = this.props;
    this.props.showScreenLockAction();
    fetch(URLS.projectIntegration(projectId, integrationId), { method: 'delete' })
      .then(() => {
        this.props.fetchProjectIntegrationsAction(projectId); // TODO: rewrite it with redux
        this.props.hideScreenLockAction();
        this.props.showNotification({
          message: formatMessage(messages.removeIntegrationSuccess),
          type: NOTIFICATION_TYPES.SUCCESS,
        });
        onRemoveConfirmation();
      })
      .catch((error) => {
        this.props.hideScreenLockAction();
        this.props.showDefaultErrorNotification(error);
      });
  };

  removeIntegrationHandler = () => {
    const {
      intl: { formatMessage },
    } = this.props;

    this.props.showModalAction({
      id: 'confirmationModal',
      data: {
        message: formatMessage(messages.removeIntegrationMessage),
        onConfirm: this.removeIntegration,
        title: formatMessage(messages.removeIntegrationTitle),
        confirmText: formatMessage(COMMON_LOCALE_KEYS.DELETE),
        cancelText: formatMessage(COMMON_LOCALE_KEYS.CANCEL),
        dangerConfirm: true,
      },
    });
  };

  render() {
    const {
      intl: { formatMessage },
      disabled,
      failedConnectionMessage,
    } = this.props;
    const isConnectionFailed = !!failedConnectionMessage;

    return (
      <div className={cx('connection-section')}>
        <div className={cx('settings-block')}>
          <h3 className={cx('block-header')}>{formatMessage(messages.connectionTitle)}</h3>
          <div
            className={cx('connection-status-block', { 'connection-failed': isConnectionFailed })}
          >
            <span className={cx('connection-status')}>
              <span className={cx('status-icon')}>
                {Parser(isConnectionFailed ? InfoIcon : CheckIcon)}
              </span>
              {formatMessage(
                isConnectionFailed ? messages.connectionFailedMessage : messages.connectedMessage,
              )}
            </span>
            {isConnectionFailed && (
              <span className={cx('failed-connection-message')}>{failedConnectionMessage}</span>
            )}
          </div>
          <button
            className={cx('remove-integration-button', { disabled })}
            onClick={disabled ? null : this.removeIntegrationHandler}
          >
            <span className={cx('remove-icon')}>{Parser(TrashIcon)}</span>
            {formatMessage(messages.removeIntegrationTitle)}
          </button>
        </div>
      </div>
    );
  }
}
