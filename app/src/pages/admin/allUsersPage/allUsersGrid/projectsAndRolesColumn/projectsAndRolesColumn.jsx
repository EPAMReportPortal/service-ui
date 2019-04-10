import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import { Manager, Reference, Popper } from 'react-popper';
import track from 'react-tracking';
import { injectIntl, intlShape, defineMessages, FormattedMessage } from 'react-intl';
import { showNotification, NOTIFICATION_TYPES } from 'controllers/notification';
import { ADMIN_ALL_USERS_PAGE_MODAL_EVENTS } from 'components/main/analytics/events';
import { showModalAction } from 'controllers/modal';
import { URLS } from 'common/urls';
import { fetch } from 'common/utils';
import { fetchAllUsersAction, toggleUserRoleForm } from 'controllers/administrate/allUsers';
import { COMMON_LOCALE_KEYS } from 'common/constants/localization';
import { SCREEN_XS_MAX } from 'common/constants/screenSizeVariables';
import { RolesRow } from './rolesRow';
import styles from './projectsAndRolesColumn.scss';

const cx = classNames.bind(styles);
const messages = defineMessages({
  anassignUser: {
    id: 'projectsAndRolesColumn.anassignUser',
    defaultMessage: 'User has been unassigned from project!',
  },
  updateUserRole: {
    id: 'projectsAndRolesColumn.updateUserRole',
    defaultMessage: 'User "{user}" has been updated',
  },
  btnTitle: {
    id: 'projectsAndRolesColumn.anassignBtn',
    defaultMessage: 'Unassign',
  },
  unAssignTitle: {
    id: 'projectsAndRolesColumn.unAssignTitle',
    defaultMessage: 'Unassign user from the project',
  },
  addProject: {
    id: 'projectsAndRolesColumn.addProject',
    defaultMessage: '+ Add Project',
  },
});
@connect(() => ({}), { showNotification, showModalAction, fetchAllUsersAction, toggleUserRoleForm })
@track()
@injectIntl
export class ProjectsAndRolesColumn extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    className: PropTypes.string.isRequired,
    value: PropTypes.object,
    tracking: PropTypes.shape({
      trackEvent: PropTypes.func,
      getTrackingData: PropTypes.func,
    }).isRequired,
    showNotification: PropTypes.func.isRequired,
    showModalAction: PropTypes.func.isRequired,
    fetchAllUsersAction: PropTypes.func,
    toggleUserRoleForm: PropTypes.func,
  };
  static defaultProps = {
    value: {},
    fetchAllUsersAction: () => {},
    toggleUserRoleForm: () => {},
  };
  state = {
    assignRole: false,
    isMobileView: false,
  };

  componentDidMount() {
    this.match = window.matchMedia(SCREEN_XS_MAX);
    this.match.addListener(this.setMobileView);
    this.setMobileView(this.match);
  }

  componentWillUnmount() {
    if (!this.match) {
      return;
    }
    this.match.removeListener(this.setMobileView);
  }
  onChange = (project, role) => {
    const {
      intl,
      value: { userId },
    } = this.props;
    fetch(URLS.project(project), {
      method: 'put',
      data: { users: { [userId]: role } },
    })
      .then(() => {
        this.props.showNotification({
          message: intl.formatMessage(messages.updateUserRole, {
            user: userId,
          }),
          type: NOTIFICATION_TYPES.SUCCESS,
        });
        this.props.fetchAllUsersAction();
      })
      .catch((err) => {
        this.props.showNotification({
          message: err.message,
          type: NOTIFICATION_TYPES.ERROR,
        });
      });
  };
  onAssignProjectRole = (project, role) => {
    const {
      intl,
      value: { userId },
    } = this.props;
    fetch(URLS.userInviteInternal(project), {
      method: 'put',
      data: { userNames: { [userId]: role } },
    })
      .then(() => {
        this.props.showNotification({
          message: intl.formatMessage(messages.updateUserRole, {
            user: userId,
          }),
          type: NOTIFICATION_TYPES.SUCCESS,
        });
        this.props.fetchAllUsersAction();
      })
      .catch((err) => {
        this.props.showNotification({
          message: err.message,
          type: NOTIFICATION_TYPES.ERROR,
        });
      });
  };
  onDelete = (project) => {
    const {
      value: { userId },
    } = this.props;
    this.showUnassignModal(project, userId);
  };
  setMobileView = (media) =>
    media.matches !== this.state.isMobileView &&
    this.setState({
      isMobileView: media.matches,
    });
  getProjectsList = () => {
    const {
      value: { assignedProjects = {} },
    } = this.props;
    return Object.keys(assignedProjects);
  };
  getVisibleProjects = () => this.getProjectsList().slice(0, 2);
  getHiddenProjects = () => this.getProjectsList().slice(2);
  toggleExpand = () => {
    const {
      value: { userId, expandRoleSelection = false },
    } = this.props;
    this.props.toggleUserRoleForm(userId, !expandRoleSelection);
  };
  toggleAssignRole = () => {
    this.setState({
      assignRole: true,
    });
  };
  countHiddenProjects = () => this.getHiddenProjects().length;
  showHiddenCounter = () => this.countHiddenProjects() > 0;
  showUnassignModal = (project, user) => {
    const { tracking } = this.props;
    tracking.trackEvent(ADMIN_ALL_USERS_PAGE_MODAL_EVENTS.UNASSIGN_BTN_CLICK);
    const unassignAction = () => this.unassignAction(project, user);
    this.props.showModalAction({
      id: 'unassignModal',
      data: {
        unassignAction,
        user,
        project,
      },
    });
  };

  unassignAction = (projectId, userId) => {
    const { intl } = this.props;
    fetch(URLS.userUnasign(projectId), {
      method: 'put',
      data: { userNames: [userId] },
    })
      .then(() => {
        this.toggleExpand();
        this.props.showNotification({
          message: intl.formatMessage(messages.anassignUser),
          type: NOTIFICATION_TYPES.SUCCESS,
        });
        this.props.fetchAllUsersAction();
      })
      .catch((err) => {
        this.props.showNotification({
          message: err.message,
          type: NOTIFICATION_TYPES.ERROR,
        });
      });
  };
  renderVisibleProjectsList = () => {
    const arr = this.getVisibleProjects();
    return arr.map((project) => (
      <span key={project} className={cx('project')} onClick={this.toggleExpand}>
        {project}
      </span>
    ));
  };
  renderVisibleProjectsListMobile = () => {
    const arr = this.getVisibleProjects();
    return this.renderProjectListMobile(arr);
  };
  renderFullProjectsListMobile = () => {
    const arr = this.getProjectsList();
    return this.renderProjectListMobile(arr);
  };
  renderProjectListMobile = (arr = []) => {
    const {
      value: { assignedProjects = {} },
    } = this.props;
    return arr.map((project) => (
      <div key={project}>
        {project}, {assignedProjects[project].projectRole}
      </div>
    ));
  };
  renderDropdown = () => {
    const {
      value: { assignedProjects = {}, userId, accountType },
    } = this.props;
    return this.getProjectsList().map((key) => {
      const { projectRole, entryType } = assignedProjects[key];
      return (
        <RolesRow
          key={key}
          project={key}
          value={projectRole}
          onChange={this.onChange}
          onDelete={this.onDelete}
          userId={userId}
          entryType={entryType}
          accountType={accountType}
        />
      );
    });
  };
  renderHiddenProjectsCounter = () => (
    <span className={cx('show-more-projects')} onClick={this.toggleExpand}>
      + {this.countHiddenProjects()}
      <span className={cx('mobile-label')}>
        <FormattedMessage id={'ProjectsAndRolesColumn.more'} defaultMessage={'more'} />
      </span>
    </span>
  );
  render() {
    const {
      className,
      value: { expandRoleSelection },
    } = this.props;
    const { assignRole, isMobileView } = this.state;
    return (
      <div className={cx('projects-and-roles-col', className)}>
        <span className={cx('mobile-label', 'projects-and-roles-mobile-label')}>
          <FormattedMessage
            id={'AllUsersGrid.projectsAndRolesCol'}
            defaultMessage={'Projects and roles'}
          />
        </span>
        {isMobileView ? (
          <div className={cx('mobile-projects-list')}>
            {expandRoleSelection ? (
              this.renderFullProjectsListMobile()
            ) : (
              <React.Fragment>
                {this.renderVisibleProjectsListMobile()}
                {this.showHiddenCounter() && this.renderHiddenProjectsCounter()}
              </React.Fragment>
            )}
          </div>
        ) : (
          <Manager>
            <Reference>
              {({ ref }) => (
                <div ref={ref}>
                  {this.renderVisibleProjectsList()}
                  {this.showHiddenCounter() && this.renderHiddenProjectsCounter()}
                </div>
              )}
            </Reference>
            {expandRoleSelection &&
              ReactDOM.createPortal(
                <Popper
                  positionFixed={false}
                  modifiers={{ preventOverflow: { enabled: false } }}
                  placement="bottom"
                  hide={false}
                >
                  {({ placement, ref, style }) => (
                    <div
                      ref={ref}
                      style={style}
                      data-placement={placement}
                      className={cx('projects-and-roles-popover')}
                    >
                      {this.renderDropdown()}
                      {assignRole && (
                        <RolesRow
                          onAssignProjectRole={this.onAssignProjectRole}
                          onDelete={this.onDelete}
                          createNew
                        />
                      )}
                      <div className={cx('projects-and-roles-toolbar')}>
                        <div
                          className={cx(
                            'projects-and-roles-toolbar-item',
                            'projects-and-roles-toolbar-cancel-button',
                          )}
                          onClick={this.toggleExpand}
                        >
                          <FormattedMessage {...COMMON_LOCALE_KEYS.CANCEL} />
                        </div>
                        <div
                          onClick={this.toggleAssignRole}
                          className={cx(
                            'projects-and-roles-toolbar-item',
                            'projects-and-roles-toolbar-add-button',
                            {
                              'projects-and-roles-toolbar-add-button-disabled': assignRole,
                            },
                          )}
                        >
                          <FormattedMessage {...messages.addProject} />
                        </div>
                      </div>
                    </div>
                  )}
                </Popper>,
                document.querySelector('#popover-root'),
              )}
          </Manager>
        )}
      </div>
    );
  }
}
