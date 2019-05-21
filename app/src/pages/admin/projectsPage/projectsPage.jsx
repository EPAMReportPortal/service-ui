import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import classNames from 'classnames/bind';
import { PageLayout, PageHeader, PageSection } from 'layouts/pageLayout';
import {
  PROJECTS_PAGE,
  PROJECT_DETAILS_PAGE,
  projectIdSelector,
  projectSectionSelector,
} from 'controllers/pages';
import { showModalAction } from 'controllers/modal';
import { SETTINGS, MEMBERS, EVENTS } from 'common/constants/projectSections';
import { GhostButton } from 'components/buttons/ghostButton';
import AddProjectIcon from 'common/img/add-project-inline.svg';
import ProjectUsersIcon from 'common/img/project-users-inline.svg';
import ProjectSettingsIcon from 'common/img/project-settings-inline.svg';
import ProjectEventsIcon from 'common/img/project-events-inline.svg';
import { MembersPage } from 'pages/common/membersPage';
import {
  addProjectAction,
  navigateToProjectSectionAction,
} from 'controllers/administrate/projects';
import { ProjectStatusPage } from '../projectStatusPage';
import { ProjectEventsPage } from '../projectEventsPage';
import { Projects } from './projects';
import { AdminProjectSettingsPageContainer } from '../adminProjectSettingsPageContainer';
import { messages } from './messages';

import styles from './projectsPage.scss';

const cx = classNames.bind(styles);

const HEADER_BUTTONS = [
  {
    key: MEMBERS,
    icon: ProjectUsersIcon,
  },
  {
    key: SETTINGS,
    icon: ProjectSettingsIcon,
  },
  {
    key: EVENTS,
    icon: ProjectEventsIcon,
  },
];

@connect(
  (state) => ({
    projectId: projectIdSelector(state),
    section: projectSectionSelector(state),
  }),
  {
    addProject: addProjectAction,
    showModal: showModalAction,
    navigateToSection: navigateToProjectSectionAction,
  },
)
@injectIntl
export class ProjectsPage extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    section: PropTypes.string,
    projectId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    navigateToSection: PropTypes.func.isRequired,
    addProject: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,
  };

  static defaultProps = {
    section: undefined,
    projectId: undefined,
  };

  onHeaderButtonClick = (section) => () => {
    this.props.navigateToSection(this.props.projectId, section);
  };

  getBreadcrumbs = () => {
    const {
      intl: { formatMessage },
      projectId,
      section,
    } = this.props;

    const breadcrumbs = [
      {
        title: formatMessage(messages.pageTitle),
        link: {
          type: PROJECTS_PAGE,
        },
      },
    ];

    if (projectId) {
      breadcrumbs.push({
        title: projectId,
        link: {
          type: PROJECT_DETAILS_PAGE,
          payload: { projectId, projectSection: null },
        },
      });
    }

    if (section) {
      breadcrumbs.push({
        title: formatMessage(messages[`${section}Title`]),
      });
    }

    return breadcrumbs;
  };

  showAddProjectModal = () =>
    this.props.showModal({
      id: 'addProjectModal',
      data: {
        onSubmit: (values) => this.props.addProject(values.projectName),
      },
    });

  renderHeaderButtons = () => {
    const {
      intl: { formatMessage },
      projectId,
      section,
    } = this.props;

    if (!projectId) {
      return (
        <div className={cx('mobile-hide')}>
          <GhostButton icon={AddProjectIcon} onClick={this.showAddProjectModal}>
            {formatMessage(messages.addProject)}
          </GhostButton>
        </div>
      );
    }

    return (
      <div className={cx('header-buttons', 'mobile-hide')}>
        {HEADER_BUTTONS.map(({ key, icon }) => (
          <GhostButton
            key={key}
            disabled={section === key}
            icon={icon}
            onClick={this.onHeaderButtonClick(key)}
            title={formatMessage(messages[`${key}Title`])}
          >
            {formatMessage(messages[`${key}Title`])}
          </GhostButton>
        ))}
      </div>
    );
  };

  renderSection = () => {
    const { projectId, section } = this.props;

    if (!projectId) {
      return <Projects />;
    }

    switch (section) {
      case SETTINGS:
        return <AdminProjectSettingsPageContainer projectId={projectId} />;
      case MEMBERS:
        return <MembersPage />;
      case EVENTS:
        return <ProjectEventsPage />;
      default:
        return <ProjectStatusPage projectId={projectId} />;
    }
  };

  render() {
    return (
      <PageLayout>
        <PageHeader breadcrumbs={this.getBreadcrumbs()}>{this.renderHeaderButtons()}</PageHeader>
        <PageSection>{this.renderSection()}</PageSection>
      </PageLayout>
    );
  }
}
