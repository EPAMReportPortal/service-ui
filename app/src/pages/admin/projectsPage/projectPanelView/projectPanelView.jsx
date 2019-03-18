import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, defineMessages, intlShape } from 'react-intl';
import classNames from 'classnames/bind';
import { ProjectInfo } from './project/projectInfo';
import styles from './projectsPanelView.scss';

const cx = classNames.bind(styles);

const messages = defineMessages({
  noProjects: {
    id: 'ProjectsPage.noProjects',
    defaultMessage: 'No projects',
  },
});

@injectIntl
export class ProjectPanelView extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    projects: PropTypes.array,
  };

  static defaultProps = {
    projects: [],
  };

  getPanelList = (projects) =>
    projects.map((project) => (
      <div className={cx('panel')}>
        <ProjectInfo project={project} />
      </div>
    ));

  render() {
    const { intl, projects } = this.props;
    return (
      <Fragment>
        {projects.length ? (
          <div className={cx('panel-list')}>{this.getPanelList(projects)}</div>
        ) : (
          <div className={cx('no-projects')}>{intl.formatMessage(messages.noProjects)}</div>
        )}
      </Fragment>
    );
  }
}