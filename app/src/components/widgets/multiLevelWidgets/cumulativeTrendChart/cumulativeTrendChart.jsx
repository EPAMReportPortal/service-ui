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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import isEqual from 'fast-deep-equal';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { NoDataAvailableMaterializedView } from 'components/widgets/multiLevelWidgets/common/noDataAvailableMaterializedView';
import { VirtualPopup } from 'components/main/virtualPopup';
import { ChartJS } from 'components/widgets/common/chartjs';
import {
  defectLinkSelector,
  statisticsLinkSelector,
  TEST_ITEMS_TYPE_LIST,
  PROVIDER_TYPE_WIDGET,
} from 'controllers/testItem';
import { defectTypesSelector } from 'controllers/project';
import { activeProjectSelector } from 'controllers/user';
import { SCREEN_XS_MAX } from 'common/constants/screenSizeVariables';
import { PASSED, FAILED, SKIPPED, INTERRUPTED, UNTESTED } from 'common/constants/testStatuses';
import { formatAttribute } from 'common/utils/attributeUtils';
import { BEFORE_AFTER_METHOD_TYPES_SEQUENCE } from 'common/constants/methodTypes';
import { STATE_READY, DEFECTS, TOTAL_KEY } from 'components/widgets/common/constants';
import SearchIcon from 'common/img/search-icon-inline.svg';
import FiltersIcon from 'common/img/filters-icon-inline.svg';
import { getChartData } from './chartjsConfig';
import { CumulativeChartLegend } from './legend/cumulativeChartLegend';
import { ActionsPopup } from './actionsPopup';
import {
  getDefectTypeLocators,
  getItemNameConfig,
  getDefaultTestItemLinkParams,
} from '../../common/utils';
import styles from './cumulativeTrendChart.scss';

const cx = classNames.bind(styles);

const LEGEND_HEIGHT = 45;
const PRINTED_LEGEND_HEIGHT = 80;

@injectIntl
@connect(
  (state) => ({
    project: activeProjectSelector(state),
    defectTypes: defectTypesSelector(state),
    getDefectLink: defectLinkSelector(state),
    getStatisticsLink: statisticsLinkSelector(state),
  }),
  {
    navigate: (linkAction) => linkAction,
  },
)
export class CumulativeTrendChart extends PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    widget: PropTypes.object.isRequired,
    defectTypes: PropTypes.object.isRequired,
    getDefectLink: PropTypes.func.isRequired,
    getStatisticsLink: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    project: PropTypes.string.isRequired,
    observer: PropTypes.object,
    fetchWidget: PropTypes.func,
    clearQueryParams: PropTypes.func,
    queryParameters: PropTypes.object,
    onChangeLegend: PropTypes.func,
    uncheckedLegendItems: PropTypes.array,
    userSettings: PropTypes.object,
    isPrintMode: PropTypes.bool,
    onChangeUserSettings: PropTypes.func,
    container: PropTypes.instanceOf(Element).isRequired,
  };

  static defaultProps = {
    observer: null,
    fetchWidget: () => {},
    clearQueryParams: () => {},
    queryParameters: {},
    onChangeLegend: () => {},
    uncheckedLegendItems: [],
    userSettings: {},
    isPrintMode: false,
    onChangeUserSettings: () => {},
  };

  state = {
    legendItems: [],
    activeAttributes: [],
    activeAttribute: null,
    isActionsPopupShown: false,
    selectedItem: null,
    isLegendControlsShown: true,
    isLoading: false,
  };

  componentDidMount = () => {
    this.getConfig();
    this.setLegendControlsShown(this.props.container.offsetWidth);
  };

  componentDidUpdate(prevProps) {
    if (
      !isEqual(
        prevProps.widget.contentParameters.widgetOptions,
        this.props.widget.contentParameters.widgetOptions,
      )
    ) {
      this.clearAttributes();
    }
    if (!isEqual(prevProps.widget, this.props.widget)) {
      this.getConfig();
    }
  }

  onChartElementClick = (element, event) => {
    if (!element) {
      if (this.state.isActionsPopupShown) {
        this.hideActionsPopup();
      }
      return;
    }
    /* eslint no-underscore-dangle: ['error', { 'allow': ['_model'] }] */
    const elementModel = element._model;
    this.left = event.offsetX;
    this.top = event.offsetY + this.getLegendHeight();
    const selectedItem = this.getSelectedItem(elementModel.label);

    this.setState({
      selectedItem,
      isActionsPopupShown: true,
    });
  };

  onLegendClick = (fieldName) => {
    this.props.onChangeLegend(fieldName, this.getConfig);
  };

  setLegendControlsShown = (chartContainerWidth) => {
    const isLegendControlsShown = !(chartContainerWidth < SCREEN_XS_MAX);

    this.setState({
      isLegendControlsShown,
    });
  };

  getConfig = (options = {}) => {
    const { uncheckedLegendItems, widget, userSettings } = this.props;

    const { labels, datasets, chartOptions, legendItems } = getChartData(widget, {
      ...userSettings,
      options,
      uncheckedLegendItems,
      formatMessage: this.props.intl.formatMessage,
      activeAttribute: this.state.activeAttribute,
      onResize: this.resizeChart,
    });

    this.setState({
      isActionsPopupShown: false,
      selectedItem: null,
      chartData: {
        labels,
        datasets,
      },
      chartOptions,
      legendItems,
    });
  };

  getLegendHeight = () => (this.props.isPrintMode ? PRINTED_LEGEND_HEIGHT : LEGEND_HEIGHT);

  getAttributes = () => this.props.widget.contentParameters.widgetOptions.attributes;

  getSelectedItem = (focusedAttributeValue) =>
    this.props.widget.content.result.find((item) => item.attributeValue === focusedAttributeValue);

  getPopupActionItems = () => [
    {
      id: 'drillDown',
      icon: SearchIcon,
      title: 'Drill down',
      onClick: this.drillDown,
      disabled: this.getAttributes().length <= this.state.activeAttributes.length + 1,
    },
    {
      id: 'showFilter',
      icon: FiltersIcon,
      title: 'Show filter',
      onClick: this.showFilter,
    },
  ];

  resizeChart = (chart) => {
    const newHeight = this.props.container.offsetHeight - this.getLegendHeight();
    const newWidth = this.props.container.offsetWidth;

    this.setLegendControlsShown(newWidth);

    /* eslint no-param-reassign: ["error", { "props": false }] */
    chart.width = newWidth;
    chart.canvas.width = newWidth;
    chart.height = newHeight;
    chart.canvas.height = newHeight;
    chart.canvas.style.height = `${newHeight}px`;
    chart.update();
  };

  updateActiveAttributes = (actionSuccessCallback) => {
    const { selectedItem, activeAttributes } = this.state;
    const activeAttribute = {
      key: this.getAttributes()[activeAttributes.length],
      value: selectedItem.attributeValue,
    };
    const newActiveAttributes = [...activeAttributes, activeAttribute];

    this.setState(
      {
        activeAttribute,
        activeAttributes: newActiveAttributes,
        isActionsPopupShown: false,
      },
      actionSuccessCallback,
    );
  };

  drillDown = () => this.updateActiveAttributes(this.fetchWidgetWithActiveAttributes);

  showFilter = () => this.updateActiveAttributes(this.navigateToTestListView);

  userSettingsChangeHandler = (data) => this.props.onChangeUserSettings(data, this.getConfig);

  hideActionsPopup = () =>
    this.setState({
      isActionsPopupShown: false,
      selectedItem: null,
    });

  fetchWidgetWithActiveAttributes = () => {
    this.setState({
      isLoading: true,
    });

    this.props
      .fetchWidget({
        attributes: this.state.activeAttributes,
      })
      .then(() => {
        this.setState({
          isLoading: false,
        });
      });
  };

  clearAttributes = () => {
    this.setState({
      activeAttribute: null,
      activeAttributes: [],
    });

    this.props.clearQueryParams();
  };

  closeDetails = () => {
    const { activeAttributes } = this.state;
    const newAttributes = activeAttributes.slice(0, -1);

    this.setState({
      activeAttribute: newAttributes.length > 0 ? newAttributes[newAttributes.length - 1] : null,
      activeAttributes: newAttributes,
    });
  };

  navigateToTestListView = () => {
    const { selectedItem, activeAttributes } = this.state;
    const {
      widget,
      userSettings,
      getStatisticsLink,
      getDefectLink,
      defectTypes,
      project,
    } = this.props;
    const navigationParams = getDefaultTestItemLinkParams(
      project,
      widget.appliedFilters[0].id,
      TEST_ITEMS_TYPE_LIST,
    );
    let link;

    if (userSettings.defectTypes) {
      const namesConfig = Object.keys(selectedItem.content.statistics)
        .map((item) => getItemNameConfig(item))
        .filter((item) => item.itemType === DEFECTS && item.locator !== TOTAL_KEY);
      const defectLocators = namesConfig.map((item) => getDefectTypeLocators(item, defectTypes));
      link = getDefectLink({
        defects: defectLocators,
        itemId: TEST_ITEMS_TYPE_LIST,
        providerType: PROVIDER_TYPE_WIDGET,
        widgetId: widget.id,
        compositeAttribute: activeAttributes.map(formatAttribute).join(','),
        launchesLimit: widget.contentParameters.itemsCount,
        filterTypes: BEFORE_AFTER_METHOD_TYPES_SEQUENCE,
        filterType: true,
      });
    } else {
      link = getStatisticsLink({
        statuses: [PASSED, FAILED, SKIPPED, INTERRUPTED, UNTESTED],
        compositeAttribute: activeAttributes.map(formatAttribute).join(','),
        launchesLimit: widget.contentParameters.itemsCount,
        providerType: PROVIDER_TYPE_WIDGET,
        widgetId: widget.id,
      });
    }

    this.props.navigate(Object.assign(link, navigationParams));
  };

  render() {
    const { uncheckedLegendItems, userSettings, container, isPrintMode, widget } = this.props;
    const {
      legendItems,
      chartData,
      activeAttribute,
      activeAttributes,
      isActionsPopupShown,
      isLegendControlsShown,
      isLoading,
    } = this.state;
    const height = container.offsetHeight - this.getLegendHeight();
    const width = container.offsetWidth;
    const isChartDataAvailable = chartData && !!chartData.labels.length;
    const widgetState = widget.contentParameters && widget.contentParameters.widgetOptions.state;

    return this.state.chartData ? (
      <div className={cx('cumulative-trend-chart')}>
        <CumulativeChartLegend
          items={legendItems}
          attributes={this.getAttributes()}
          activeAttribute={activeAttribute}
          activeAttributes={activeAttributes}
          clearAttributes={this.clearAttributes}
          onClick={this.onLegendClick}
          onChangeUserSettings={this.userSettingsChangeHandler}
          uncheckedLegendItems={uncheckedLegendItems}
          userSettings={userSettings}
          isChartDataAvailable={isChartDataAvailable}
          isPrintMode={isPrintMode}
          isLegendControlsShown={isLegendControlsShown}
        />
        {isChartDataAvailable && widgetState === STATE_READY && !isLoading ? (
          <ChartJS
            chartData={chartData}
            chartOptions={this.state.chartOptions}
            onChartElementClick={this.onChartElementClick}
            height={height}
            width={width}
          />
        ) : (
          <div className={cx('no-data-wrapper')}>
            <NoDataAvailableMaterializedView state={widgetState} isLoading={isLoading} />
          </div>
        )}
        {isActionsPopupShown && (
          <VirtualPopup
            boundariesElement={container}
            referenceConfig={{
              className: cx('popup-reference'),
              style: { left: this.left, top: this.top },
            }}
          >
            <ActionsPopup items={this.getPopupActionItems()} />
          </VirtualPopup>
        )}
      </div>
    ) : null;
  }
}
