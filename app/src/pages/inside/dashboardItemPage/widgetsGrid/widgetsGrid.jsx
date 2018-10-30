import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Responsive, WidthProvider } from 'react-grid-layout';
import classNames from 'classnames/bind';
import { redirect } from 'redux-first-router';
import { injectIntl, defineMessages, intlShape } from 'react-intl';
import ReactObserver from 'react-event-observer';
import { PROJECT_DASHBOARD_PAGE, activeDashboardIdSelector } from 'controllers/pages';
import { showNotification, NOTIFICATION_TYPES } from 'controllers/notification';
import { fetch } from 'common/utils';
import { ScrollWrapper } from 'components/main/scrollWrapper';
import PropTypes from 'prop-types';
import { SpinningPreloader } from 'components/preloaders/spinningPreloader';
import { userInfoSelector, activeProjectSelector } from 'controllers/user';
import { canResizeAndDragWidgets } from 'common/utils/permissions';
import { URLS } from 'common/urls';
import { EmptyWidgetGrid } from './emptyWidgetGrid';
import styles from './widgetsGrid.scss';
import { Widget } from './widget';

const cx = classNames.bind(styles);
const ResponsiveGridLayout = WidthProvider(Responsive);
const rowHeight = 63;
const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
const cols = { lg: 12, md: 12, sm: 4, xs: 4, xxs: 4 };
const messages = defineMessages({
  deleteWidgetSuccess: {
    id: 'WidgetsGrid.notification.deleteWidgetSuccess',
    defaultMessage: 'Widget has been deleted',
  },
});

@injectIntl
@connect(
  (state) => ({
    url: URLS.dashboard(activeProjectSelector(state), activeDashboardIdSelector(state)),
    userInfo: userInfoSelector(state),
    project: activeProjectSelector(state),
  }),
  {
    redirect,
    showNotification,
  },
)
export class WidgetsGrid extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    url: PropTypes.string.isRequired,
    isFullscreen: PropTypes.bool,
    project: PropTypes.string.isRequired,
    userInfo: PropTypes.object.isRequired,
    redirect: PropTypes.func.isRequired,
    showNotification: PropTypes.func.isRequired,
    dashboard: PropTypes.object,
  };

  static defaultProps = {
    isFullscreen: false,
    dashboard: {},
  };

  constructor(props) {
    super(props);
    this.observer = ReactObserver();
  }

  state = {
    widgets: [],
    isFetching: true,
    isMobile: false,
    isModifiable: false,
  };

  componentDidMount() {
    this.fetchWidgets();
  }

  componentDidUpdate({ url }) {
    if (this.props.url !== url) {
      this.fetchWidgets();
    }
  }

  onBreakpointChange = (newBreakpoint) => {
    this.setState({
      isMobile: /sm|xs/.test(newBreakpoint),
    });
  };

  onGridItemChange = (newLayout, oldWidgetPosition, newWidgetPosition) => {
    let newWidgets;
    const itemChanged = Object.keys(oldWidgetPosition).some(
      (prop) => oldWidgetPosition[prop] !== newWidgetPosition[prop],
    );

    if (itemChanged) {
      if (this.state.isMobile) {
        const oldWidgets = this.state.widgets;

        newWidgets = newLayout.map(({ i, y, h }, index) => ({
          widgetId: i,
          widgetPosition: [oldWidgets[index].widgetPosition[0], y],
          widgetSize: [oldWidgets[index].widgetSize[0], h],
        }));
      } else {
        newWidgets = newLayout.map(({ i, x, y, w, h }) => ({
          widgetId: i,
          widgetPosition: [x, y],
          widgetSize: [w, h],
        }));
      }
      this.setState({ widgets: newWidgets });
      this.updateWidgets(newWidgets);
    }
  };

  onResizeStop = (newLayout, oldWidgetPosition, newWidgetPosition) => {
    this.onGridItemChange(newLayout, oldWidgetPosition, newWidgetPosition);
    this.observer.publish('widgetResized');
  };

  onDeleteWidget = (id) => {
    const newWidgets = this.state.widgets.filter((widget) => widget.widgetId !== id);
    this.deleteWidget(id).then(() => {
      this.updateWidgets(newWidgets);
      this.setState({ widgets: newWidgets });
      this.props.showNotification({
        type: NOTIFICATION_TYPES.SUCCESS,
        message: this.props.intl.formatMessage(messages.deleteWidgetSuccess),
      });
    });
  };

  onWidgetsReady = (dashboard) => {
    const { userInfo, project } = this.props;
    const isOwner = dashboard.owner === userInfo.userId;
    const projectRole =
      userInfo.assigned_projects[project] && userInfo.assigned_projects[project].projectRole;
    this.setState({
      widgets: dashboard.widgets,
      isFetching: false,
      isModifiable: canResizeAndDragWidgets(userInfo.userRole, projectRole, isOwner),
    });
  };

  deleteWidget = (widget) =>
    fetch(this.props.url, {
      method: 'PUT',
      data: {
        deleteWidget: widget,
      },
    });

  fetchWidgets = () => {
    const { project, dashboard } = this.props;
    if (!dashboard) {
      return;
    }
    if (dashboard.widgets) {
      this.onWidgetsReady(dashboard);
    } else {
      fetch(this.props.url)
        .then(this.onWidgetsReady)
        .catch(() => {
          this.props.redirect({ type: PROJECT_DASHBOARD_PAGE, payload: { projectId: project } });
        });
    }
  };

  updateWidgets = (widgets) => {
    fetch(this.props.url, {
      method: 'PUT',
      data: {
        updateWidgets: widgets,
      },
    });
  };

  render() {
    const { widgets } = this.state;
    let Items = null;
    let height = 0; // we need to set large height to avoid double scroll

    if (widgets.length) {
      Items = widgets.map(
        ({
          widgetPosition: { position_x: x, position_y: y },
          widgetSize: { width: w, height: h },
          widgetId,
        }) => {
          height += h * (rowHeight + 20);
          return (
            <div
              key={widgetId}
              className={cx('widget-view')}
              data-grid={{ x, y, w, h, minW: 4, minH: 4, i: String(widgetId) }}
            >
              <Widget
                widgetId={widgetId}
                isModifiable={this.state.isModifiable}
                observer={this.observer}
                onDelete={() => {
                  this.onDeleteWidget(widgetId);
                }}
              />
            </div>
          );
        },
      );
    }

    return (
      <div className={this.state.isMobile ? 'mobile ' : ''}>
        {this.state.isFetching && (
          <div className={cx('preloader-container')}>
            <SpinningPreloader />
          </div>
        )}
        {!!widgets.length && (
          <ScrollWrapper
            autoHeight
            autoHeightMax={this.props.isFullscreen ? window.screen.height : height}
            hideTracksWhenNotNeeded
          >
            <ResponsiveGridLayout
              rowHeight={rowHeight}
              breakpoints={breakpoints}
              onBreakpointChange={this.onBreakpointChange}
              onDragStop={this.onGridItemChange}
              onResizeStop={this.onResizeStop}
              cols={cols}
              isDraggable={this.state.isModifiable}
              isResizable={this.state.isModifiable}
              draggableHandle=".draggable-field"
            >
              {Items}
            </ResponsiveGridLayout>
          </ScrollWrapper>
        )}

        {!this.state.isFetching &&
          !widgets.length && <EmptyWidgetGrid isFullscreen={this.props.isFullscreen} />}
      </div>
    );
  }
}
