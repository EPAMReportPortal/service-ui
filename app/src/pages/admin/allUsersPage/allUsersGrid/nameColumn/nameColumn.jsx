import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, defineMessages, intlShape } from 'react-intl';
import classNames from 'classnames/bind';
import { fetch } from 'common/utils';
import { ADMINISTRATOR, USER } from 'common/constants/accountRoles';
import { userIdSelector, activeProjectSelector } from 'controllers/user';
import { URLS } from 'common/urls';
import { fetchAllUsersAction } from 'controllers/administrate/allUsers';
import { showNotification, NOTIFICATION_TYPES } from 'controllers/notification';
import { showModalAction } from 'controllers/modal';
import { UserAvatar } from 'pages/inside/common/userAvatar';
import styles from './nameColumn.scss';

const cx = classNames.bind(styles);

const messages = defineMessages({
  youLabel: { id: 'NameColumn.youLabel', defaultMessage: 'you' },
  adminLabel: { id: 'NameColumn.adminLabel', defaultMessage: 'admin' },
  makeAdminLabel: { id: 'NameColumn.makeAdminLabel', defaultMessage: 'make admin' },
  changeAccountRoleNotification: {
    id: 'NameColumn.changeAccountRoleNotification',
    defaultMessage: "User role for '{name}' was changed.",
  },
});

@connect(
  (state) => ({
    currentUser: userIdSelector(state),
    activeProject: activeProjectSelector(state),
  }),
  {
    showModal: showModalAction,
    fetchAllUsers: fetchAllUsersAction,
    showNotification,
  },
)
@injectIntl
export class NameColumn extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    showNotification: PropTypes.func.isRequired,
    className: PropTypes.string.isRequired,
    value: PropTypes.object,
    currentUser: PropTypes.string,
    activeProject: PropTypes.string,
    showModal: PropTypes.func,
    fetchAllUsers: PropTypes.func,
  };
  static defaultProps = {
    value: {},
    currentUser: '',
    activeProject: '',
    showModal: () => {},
    fetchAllUsers: () => {},
  };

  onChangeAccountRole = () => {
    const { intl, showModal, value, fetchAllUsers } = this.props;
    const onSubmit = () => {
      fetch(URLS.userInfo(value.userId), {
        method: 'PUT',
        data: {
          role: value.userRole === ADMINISTRATOR ? USER : ADMINISTRATOR,
        },
      }).then(() => {
        fetchAllUsers();
        this.props.showNotification({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: intl.formatMessage(messages.changeAccountRoleNotification, {
            name: value.fullName,
          }),
        });
      });
    };

    showModal({
      id: 'allUsersChangeProjectRoleModal',
      data: {
        name: value.fullName,
        onSubmit,
      },
    });
  };

  render() {
    const {
      intl: { formatMessage },
      activeProject,
      value,
      className,
      currentUser,
    } = this.props;
    return (
      <div className={cx('name-col', className)}>
        {value.photoLoaded && (
          <UserAvatar
            className={cx('avatar-wrapper')}
            projectId={activeProject}
            userId={value.userId}
          />
        )}
        <span className={cx('name')} title={value.fullName}>
          {value.fullName}
        </span>
        {value.userId === currentUser && (
          <span className={cx('label', 'you-label')}>{formatMessage(messages.youLabel)}</span>
        )}
        {value.userRole === ADMINISTRATOR ? (
          <span
            className={cx('label', 'admin-label')}
            onClick={value.userId !== currentUser ? this.onChangeAccountRole : undefined}
          >
            {formatMessage(messages.adminLabel)}
          </span>
        ) : (
          <span className={cx('label', 'make-admin-label')} onClick={this.onChangeAccountRole}>
            {formatMessage(messages.makeAdminLabel)}
          </span>
        )}
      </div>
    );
  }
}
