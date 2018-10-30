import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Fullscreen from 'react-full-screen';
import Parser from 'html-react-parser';
import { injectIntl, defineMessages, intlShape } from 'react-intl';
import { activeDashboardIdSelector } from 'controllers/pages';
import { dashboardItemsSelector } from 'controllers/dashboard';
import { activeProjectSelector } from 'controllers/user';
import classNames from 'classnames/bind';
import { showModalAction } from 'controllers/modal';
import { GhostButton } from 'components/buttons/ghostButton';
import { PageLayout, PageHeader, PageSection } from 'layouts/pageLayout';
import { PROJECT_DASHBOARD_PAGE } from 'controllers/pages/constants';
import { AddDashboardButton } from '../common/addDashboardButton';
import AddWidgetIcon from './img/add-inline.svg';
import AddSharedWidgetIcon from './img/add-shared-inline.svg';
import EditIcon from './img/edit-inline.svg';
import CancelIcon from './img/cancel-inline.svg';
import FullscreenIcon from './img/full-screen-inline.svg';
import styles from './dashboardItemPage.scss';
import { WidgetsGrid } from './widgetsGrid';

const cx = classNames.bind(styles);

const messages = defineMessages({
  pageTitle: {
    id: 'DashboardPage.title',
    defaultMessage: 'All Dashboards',
  },
  addNewWidget: {
    id: 'DashboardItemPage.addNewWidget',
    defaultMessage: 'Add new widget',
  },
  addSharedWidget: {
    id: 'DashboardItemPage.addSharedWidget',
    defaultMessage: 'Add shared widget',
  },
  editDashboard: {
    id: 'DashboardItemPage.editDashboard',
    defaultMessage: 'Edit',
  },
  deleteWidget: {
    id: 'DashboardItemPage.deleteWidget',
    defaultMessage: 'Delete',
  },
  fullscreen: {
    id: 'DashboardItemPage.fullscreen',
    defaultMessage: 'Full screen',
  },
});

@injectIntl
@connect(
  (state) => ({
    activeProject: activeProjectSelector(state),
    dashboardId: activeDashboardIdSelector(state),
    dashboardItems: dashboardItemsSelector(state),
  }),
  {
    showModalAction,
  },
)
export class DashboardItemPage extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    showModalAction: PropTypes.func.isRequired,
    dashboardId: PropTypes.number,
    dashboardItems: PropTypes.array,
    activeProject: PropTypes.string.isRequired,
  };

  static defaultProps = {
    dashboardId: undefined,
    dashboardItems: [],
  };

  state = {
    isFullscreen: false,
  };

  onChangeFullscreen = (isFullscreen) => {
    this.setState({ isFullscreen });
  };

  getBreadcrumbs = () => {
    const { activeProject, intl } = this.props;
    const breadcrumbs = [
      {
        title: intl.formatMessage(messages.pageTitle),
        link: {
          type: PROJECT_DASHBOARD_PAGE,
          payload: { projectId: activeProject },
        },
      },
      {
        title: this.getDashboardName(),
      },
    ];
    return breadcrumbs;
  };

  getDashboardName = () => (this.dashboard && this.dashboard.name) || '';

  getDashboard = () => {
    if (this.dashboard && this.dashboard.id === this.props.dashboardId) {
      return;
    }
    const { dashboardItems, dashboardId } = this.props;
    this.dashboard = dashboardItems.find((item) => item.id === dashboardId);
  };

  toggleFullscreen = () => {
    this.setState({ isFullscreen: !this.state.isFullscreen });
  };
  showWidgetWizard = () => {
    this.props.showModalAction({
      id: 'widgetWizardModal',
      data: { onConfirm: () => {} },
    });
  };

  render() {
    const {
      intl: { formatMessage },
    } = this.props;
    this.getDashboard();

    return (
      <PageLayout>
        <PageHeader breadcrumbs={this.getBreadcrumbs()}>
          <AddDashboardButton />
        </PageHeader>
        <PageSection>
          <div className={cx('dashboard-item')}>
            <div className={cx('buttons-container')}>
              <div className={cx('nav-left')}>
                <GhostButton icon={AddWidgetIcon} onClick={this.showWidgetWizard}>
                  {formatMessage(messages.addNewWidget)}
                </GhostButton>
                <GhostButton icon={AddSharedWidgetIcon}>
                  {formatMessage(messages.addSharedWidget)}
                </GhostButton>
              </div>
              <div className={cx('nav-right')}>
                <GhostButton icon={EditIcon}>{formatMessage(messages.editDashboard)}</GhostButton>
                <GhostButton icon={FullscreenIcon} onClick={this.toggleFullscreen}>
                  {formatMessage(messages.fullscreen)}
                </GhostButton>
                <GhostButton icon={CancelIcon}>{formatMessage(messages.deleteWidget)}</GhostButton>
              </div>
            </div>
            <Fullscreen enabled={this.state.isFullscreen} onChange={this.onChangeFullscreen}>
              <WidgetsGrid
                dashboardId={this.props.dashboardId}
                isFullscreen={this.state.isFullscreen}
              />
              {this.state.isFullscreen && (
                <i className={cx('icon-close')} onClick={this.toggleFullscreen}>
                  {Parser(CancelIcon)}
                </i>
              )}
            </Fullscreen>
          </div>
        </PageSection>
      </PageLayout>
    );
  }
}
