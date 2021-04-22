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
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  STATS_TOTAL,
  STATS_SKIPPED,
  STATS_PASSED,
  STATS_FAILED,
  STATS_UNTESTED,
} from 'common/constants/statistics';
import { changeActiveFilterAction } from 'controllers/filter';
import { ALL } from 'common/constants/reservedFilterIds';
import { activeProjectSelector } from 'controllers/user';
import { Grid } from 'components/main/grid';
import { ScrollWrapper } from 'components/main/scrollWrapper';
import { STATS_SI, STATS_PB, STATS_TI, STATS_ND, STATS_AB } from '../components/constants';
import {
  NAME,
  FILTER_NAME,
  START_TIME,
  STATUS,
  PASSING_RATE,
  NAME_COLUMN_KEY,
  ATTRIBUTE_COLUMN_KEY,
  STATUS_COLUMN_KEY,
  TIME_COLUMN_KEY,
  STATISTICS_COLUMN_KEY,
  DEFECT_COLUMN_KEY,
  PASSING_RATE_COLUMN_KEY,
  FILTER_TITLE_TYPE,
  FILTER_TYPE,
  LAUNCH_TYPE,
  TOTAL_TYPE,
} from './constants';
import { COLUMN_NAMES_MAP } from './messages';
import {
  NameColumn,
  AttributeColumn,
  StatusColumn,
  TimeColumn,
  StatisticsColumn,
  DefectsColumn,
  PassingRateColumn,
} from './innerComponents';

const columnComponentsMap = {
  [NAME_COLUMN_KEY]: NameColumn,
  [ATTRIBUTE_COLUMN_KEY]: AttributeColumn,
  [STATUS_COLUMN_KEY]: StatusColumn,
  [TIME_COLUMN_KEY]: TimeColumn,
  [STATISTICS_COLUMN_KEY]: StatisticsColumn,
  [DEFECT_COLUMN_KEY]: DefectsColumn,
  [PASSING_RATE_COLUMN_KEY]: PassingRateColumn,
};

@connect(
  (state) => ({
    projectId: activeProjectSelector(state),
  }),
  {
    changeActiveFilterAction,
  },
)
@injectIntl
export class ProductStatus extends PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    widget: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    changeActiveFilterAction: PropTypes.func.isRequired,
  };

  getColumnParameters = () => {
    const {
      widget: {
        content: { result },
        contentParameters: {
          widgetOptions: { customColumns, group },
        },
      },
    } = this.props;

    if (!group) {
      return {
        attributesColumns: customColumns,
        hasStartTimeAndStatusColumns: true,
      };
    }

    const attributesColumns = {};

    Object.keys(customColumns).forEach((attributeKey) => {
      if (
        Object.keys(result).some(
          (key) => key !== TOTAL_TYPE && result[key].some((item) => item.attributes[attributeKey]),
        )
      ) {
        attributesColumns[attributeKey] = customColumns[attributeKey];
      }
    });

    const hasStartTimeAndStatusColumns = Object.keys(result).some(
      (key) => key !== TOTAL_TYPE && result[key].length === 1,
    );

    return {
      attributesColumns,
      hasStartTimeAndStatusColumns,
    };
  };

  getColumnKeysMap = ({ attributesColumns, hasStartTimeAndStatusColumns }) => {
    const ATTRIBUTES_MAP = {};
    if (hasStartTimeAndStatusColumns) {
      Object.keys(attributesColumns).forEach((key) => {
        ATTRIBUTES_MAP[key] = ATTRIBUTE_COLUMN_KEY;
      });
    }
    const START_TIME_AND_STATUS_MAP = hasStartTimeAndStatusColumns
      ? {
          [START_TIME]: TIME_COLUMN_KEY,
          [STATUS]: STATUS_COLUMN_KEY,
        }
      : {};

    return {
      [NAME]: NAME_COLUMN_KEY,
      ...ATTRIBUTES_MAP,
      ...START_TIME_AND_STATUS_MAP,
      [STATS_TOTAL]: STATISTICS_COLUMN_KEY,
      [STATS_PASSED]: STATISTICS_COLUMN_KEY,
      [STATS_UNTESTED]: STATISTICS_COLUMN_KEY,
      [STATS_FAILED]: STATISTICS_COLUMN_KEY,
      [STATS_SKIPPED]: STATISTICS_COLUMN_KEY,
      [STATS_PB]: DEFECT_COLUMN_KEY,
      [STATS_AB]: DEFECT_COLUMN_KEY,
      [STATS_SI]: DEFECT_COLUMN_KEY,
      [STATS_ND]: DEFECT_COLUMN_KEY,
      [STATS_TI]: DEFECT_COLUMN_KEY,
      [PASSING_RATE]: PASSING_RATE_COLUMN_KEY,
    };
  };

  getColumn = (name, customProps, columnKeysMap, group) => ({
    id: name,
    title: COLUMN_NAMES_MAP[group && name === NAME ? FILTER_NAME : name] || {
      full: name,
      short: name,
    },
    component: (data) => columnComponentsMap[columnKeysMap[name]](data, name, customProps),
  });

  getFieldsMap = ({ attributesColumns, hasStartTimeAndStatusColumns }) => {
    const {
      widget: {
        contentParameters: { contentFields },
      },
    } = this.props;
    const fieldsMap = contentFields.reduce((map, item) => ({ ...map, [item]: item }), {
      [NAME]: NAME,
      [PASSING_RATE]: PASSING_RATE,
    });
    if (hasStartTimeAndStatusColumns) {
      Object.keys(attributesColumns).forEach((key) => {
        fieldsMap[key] = key;
      });
    }

    return fieldsMap;
  };

  getCustomProps = () => {
    const { intl, projectId } = this.props;

    return {
      formatMessage: intl.formatMessage,
      onFilterSelect: this.handleFilterSelect,
      linkPayload: {
        projectId,
        filterId: ALL,
      },
      onFilterNameClick: this.props.changeActiveFilterAction,
    };
  };

  getColumns = () => {
    const {
      widget: { contentParameters },
    } = this.props;
    const columnParameters = this.getColumnParameters();
    const columnKeysMap = this.getColumnKeysMap(columnParameters);
    const fieldsMap = this.getFieldsMap(columnParameters);
    const customProps = this.getCustomProps();

    return Object.keys(columnKeysMap).reduce(
      (columns, item) =>
        fieldsMap[item]
          ? [
              ...columns,
              this.getColumn(
                item,
                customProps,
                columnKeysMap,
                contentParameters.widgetOptions.group,
              ),
            ]
          : columns,
      [],
    );
  };

  getFilterIdByName = (filterName) => {
    const {
      widget: { appliedFilters },
    } = this.props;
    const filter = appliedFilters.find((item) => item.name === filterName);

    return (filter && filter.id) || ALL;
  };

  getFilterTotals = (launches) => {
    const values = {};
    let passingRateSum = 0;

    let attributes = [];
    let startTime = null;
    let status = '';
    if (launches.length === 1) {
      attributes = launches[0].attributes;
      startTime = launches[0].startTime;
      status = launches[0].status;
    }

    launches.forEach((item) => {
      passingRateSum += item.passingRate;
      Object.keys(item.values).forEach((itemKey) => {
        values[itemKey]
          ? (values[itemKey] += Number(item.values[itemKey]))
          : (values[itemKey] = Number(item.values[itemKey]));
      });
    });

    return { attributes, startTime, status, values, passingRate: passingRateSum / launches.length };
  };

  getData = () => {
    const {
      widget: {
        content: { result = {} },
        contentParameters: { widgetOptions = {} },
      },
    } = this.props;

    const data = [];

    Object.keys(result).forEach((key, index) => {
      const filterId = this.getFilterIdByName(key);
      if (key === TOTAL_TYPE) {
        data.push({
          attributes: widgetOptions.customColumns,
          id: `${TOTAL_TYPE}-${index}`,
          name: TOTAL_TYPE,
          filterId,
          passingRate: result[key][0].averagePassingRate,
          values: result[key][0].sum,
          type: TOTAL_TYPE,
        });
      } else if (widgetOptions.group) {
        const { attributes, startTime, status, values, passingRate } = this.getFilterTotals(
          result[key],
        );
        data.push({
          attributes,
          id: `${FILTER_TYPE}-${filterId}`,
          linkId: filterId,
          name: key,
          filterId,
          qty: result[key].length,
          startTime,
          status,
          passingRate,
          values,
          type: FILTER_TYPE,
        });
      } else {
        data.push({ id: key, name: key, values: {}, type: FILTER_TITLE_TYPE });
        result[key].forEach((item) => {
          data.push({
            ...item,
            linkId: item.id,
            id: `${filterId}-${item.id}`,
            filterId,
            type: LAUNCH_TYPE,
          });
        });
      }
    });

    return data;
  };

  render() {
    const columns = this.getColumns();
    const data = this.getData();

    return (
      <ScrollWrapper hideTracksWhenNotNeeded>
        <Grid columns={columns} data={data} />
      </ScrollWrapper>
    );
  }
}
