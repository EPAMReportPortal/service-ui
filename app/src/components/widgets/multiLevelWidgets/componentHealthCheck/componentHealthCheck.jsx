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
import { injectIntl, defineMessages } from 'react-intl';
import isEqual from 'fast-deep-equal';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import {
  COLOR_BURGUNDY,
  COLOR_CHERRY,
  COLOR_DEEP_RED,
  COLOR_DULL_RED,
  COLOR_PASSED,
  COLOR_DULL_GREEN,
} from 'common/constants/colors';
import { formatAttribute } from 'common/utils';
import { PASSED, FAILED, SKIPPED, INTERRUPTED, UNTESTED } from 'common/constants/testStatuses';
import {
  statisticsLinkSelector,
  TEST_ITEMS_TYPE_LIST,
  DEFAULT_LAUNCHES_LIMIT,
} from 'controllers/testItem';
import { activeProjectSelector } from 'controllers/user';
import { TEST_ITEM_PAGE } from 'controllers/pages';
import { ScrollWrapper } from 'components/main/scrollWrapper';
import { NoDataAvailable } from 'components/widgets/noDataAvailable';
import { SpinningPreloader } from 'components/preloaders/spinningPreloader/spinningPreloader';
import {
  getNewActiveAttributes,
  getBreadcrumbs,
  getNewActiveBreadcrumbs,
} from 'components/widgets/multiLevelWidgets/common/utils';
import { MAX_PASSING_RATE_VALUE } from './constants';
import { ComponentHealthCheckLegend } from './legend/componentHealthCheckLegend';
import { GroupsSection } from './groupsSection';
import styles from './componentHealthCheck.scss';

const cx = classNames.bind(styles);

const messages = defineMessages({
  failedGroupsTitle: {
    id: 'ComponentHealthCheck.failedGroupsTitle',
    defaultMessage: 'Failed',
  },
  passedGroupsTitle: {
    id: 'ComponentHealthCheck.passedGroupsTitle',
    defaultMessage: 'Passed',
  },
});

@injectIntl
@connect((state) => ({
  project: activeProjectSelector(state),
  getStatisticsLink: statisticsLinkSelector(state),
}))
export class ComponentHealthCheck extends Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    widget: PropTypes.object.isRequired,
    fetchWidget: PropTypes.func,
    clearQueryParams: PropTypes.func,
    container: PropTypes.instanceOf(Element).isRequired,
    getStatisticsLink: PropTypes.func.isRequired,
    project: PropTypes.string.isRequired,
  };

  static defaultProps = {
    clearQueryParams: () => {},
    fetchWidget: () => {},
  };

  state = {
    activeBreadcrumbs: null,
    activeBreadcrumbId: 0,
    activeAttributes: [],
    isLoading: false,
  };

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.widget.contentParameters, this.props.widget.contentParameters)) {
      this.clearState();
    }
  }

  onClickBreadcrumbs = (id) => {
    const { activeBreadcrumbs, activeAttributes, activeBreadcrumbId } = this.state;
    const {
      widget: { contentParameters },
    } = this.props;
    const attributes = contentParameters && contentParameters.widgetOptions.attributeKeys;
    const newActiveAttributes = getNewActiveAttributes(
      activeBreadcrumbs[id].key,
      activeBreadcrumbs[id].additionalProperties.value,
      activeAttributes,
    );
    const newActiveBreadcrumbs = getNewActiveBreadcrumbs(
      id,
      activeBreadcrumbs,
      activeBreadcrumbId,
      attributes,
    );

    this.setState({
      activeBreadcrumbs: newActiveBreadcrumbs,
      activeBreadcrumbId: id,
      activeAttributes: newActiveAttributes,
      isLoading: true,
    });
    this.props
      .fetchWidget({
        attributes: newActiveAttributes.map((item) => item.value),
      })
      .then(() => {
        this.setState({
          isLoading: false,
        });
      });
  };

  onClickGroupItem = (value, passingRate, color) => {
    const { activeBreadcrumbId, activeBreadcrumbs, activeAttributes } = this.state;
    const {
      widget: { contentParameters },
    } = this.props;
    const attributes = contentParameters && contentParameters.widgetOptions.attributeKeys;
    const newActiveBreadcrumbId = activeBreadcrumbId + 1;
    const additionalProperties = {
      value,
      passingRate,
      color,
    };
    const newActiveBreadcrumbs = getNewActiveBreadcrumbs(
      newActiveBreadcrumbId,
      activeBreadcrumbs,
      activeBreadcrumbId,
      attributes,
      additionalProperties,
    );
    const newActiveAttributes = getNewActiveAttributes(
      newActiveBreadcrumbs[activeBreadcrumbId].key,
      value,
      activeAttributes,
    );

    this.setState({
      activeBreadcrumbs: newActiveBreadcrumbs,
      activeBreadcrumbId: newActiveBreadcrumbId,
      activeAttributes: newActiveAttributes,
      isLoading: true,
    });
    this.props
      .fetchWidget({
        attributes: newActiveAttributes.map((item) => item.value),
      })
      .then(() => {
        this.setState({
          isLoading: false,
        });
      });
  };

  getSpecificTestListLink = (value) => {
    const { widget, getStatisticsLink } = this.props;
    const { activeBreadcrumbId, activeAttributes } = this.state;
    const attributes =
      widget.contentParameters && widget.contentParameters.widgetOptions.attributeKeys;
    const breadcrumbs = getBreadcrumbs(attributes, activeBreadcrumbId)[activeBreadcrumbId];
    const compositeAttributes =
      breadcrumbs && getNewActiveAttributes(breadcrumbs.key, value, activeAttributes);
    const link = getStatisticsLink({
      statuses: [PASSED, FAILED, SKIPPED, INTERRUPTED, UNTESTED],
      launchesLimit: DEFAULT_LAUNCHES_LIMIT,
      compositeAttribute: compositeAttributes && compositeAttributes.map(formatAttribute).join(','),
      isLatest: widget.contentParameters.widgetOptions.latest,
    });
    const navigationParams = this.getDefaultLinkParams(widget.appliedFilters[0].id);

    return Object.assign(link, navigationParams);
  };

  getDefaultLinkParams = (filterId) => ({
    payload: {
      projectId: this.props.project,
      filterId,
      testItemIds: TEST_ITEMS_TYPE_LIST,
    },
    type: TEST_ITEM_PAGE,
  });

  getPassingRateValue = () =>
    Number(this.props.widget.contentParameters.widgetOptions.minPassingRate);

  getGroupItems = () => {
    const { widget } = this.props;
    const passingRate = this.getPassingRateValue();
    const failedGroupItems = [];
    const passedGroupItems = [];

    if (!widget.content.result) {
      return null;
    }

    widget.content.result.forEach((item) => {
      if (item.passingRate < passingRate) {
        failedGroupItems.push(item);
      } else {
        passedGroupItems.push(item);
      }
    });

    return {
      failedGroupItems,
      passedGroupItems,
    };
  };

  colorCalculator = (value) => {
    const passingRate = this.getPassingRateValue();
    const intervalPiece = passingRate / 4;

    if (value === MAX_PASSING_RATE_VALUE) {
      return COLOR_PASSED;
    } else if (value >= passingRate) {
      return COLOR_DULL_GREEN;
    } else if (value < 4 * intervalPiece && value > 3 * intervalPiece) {
      return COLOR_DULL_RED;
    } else if (value <= 3 * intervalPiece && value > 2 * intervalPiece) {
      return COLOR_DEEP_RED;
    } else if (value <= 2 * intervalPiece && value > intervalPiece) {
      return COLOR_CHERRY;
    }
    return COLOR_BURGUNDY;
  };

  clearState = () => {
    this.setState({
      activeBreadcrumbs: null,
      activeBreadcrumbId: 0,
      activeAttributes: [],
    });

    this.props.clearQueryParams();
  };

  render() {
    const { intl } = this.props;
    const { activeBreadcrumbs, activeBreadcrumbId, isLoading } = this.state;
    const {
      widget: { contentParameters },
    } = this.props;
    const attributes = contentParameters && contentParameters.widgetOptions.attributeKeys;
    const groupItems = this.getGroupItems();
    const breadcrumbs = getBreadcrumbs(attributes, activeBreadcrumbId);
    const isClickableGroupItem =
      breadcrumbs.length > 1 &&
      activeBreadcrumbId !== (activeBreadcrumbs && activeBreadcrumbs.length - 1);

    return (
      <ScrollWrapper hideTracksWhenNotNeeded>
        <ComponentHealthCheckLegend
          breadcrumbs={breadcrumbs}
          activeBreadcrumbs={activeBreadcrumbs}
          onClickBreadcrumbs={this.onClickBreadcrumbs}
          passingRate={this.getPassingRateValue()}
          colorCalculator={this.colorCalculator}
        />
        {groupItems && !isLoading ? (
          <Fragment>
            {!!groupItems.failedGroupItems.length && (
              <GroupsSection
                sectionTitle={intl.formatMessage(messages.failedGroupsTitle)}
                itemsCount={groupItems.failedGroupItems.length}
                groups={groupItems.failedGroupItems}
                colorCalculator={this.colorCalculator}
                onClickGroupItem={this.onClickGroupItem}
                getSpecificTestListLink={this.getSpecificTestListLink}
                isClickable={isClickableGroupItem}
              />
            )}
            {!!groupItems.passedGroupItems.length && (
              <GroupsSection
                sectionTitle={intl.formatMessage(messages.passedGroupsTitle)}
                itemsCount={groupItems.passedGroupItems.length}
                groups={groupItems.passedGroupItems}
                colorCalculator={this.colorCalculator}
                onClickGroupItem={this.onClickGroupItem}
                getSpecificTestListLink={this.getSpecificTestListLink}
                isClickable={isClickableGroupItem}
              />
            )}
          </Fragment>
        ) : (
          <div className={cx('no-data-wrapper')}>
            {isLoading ? <SpinningPreloader /> : <NoDataAvailable />}
          </div>
        )}
      </ScrollWrapper>
    );
  }
}
