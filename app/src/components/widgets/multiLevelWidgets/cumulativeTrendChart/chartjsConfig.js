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

import * as COLORS from 'common/constants/colors';
import { messages } from './messages';
import { EXECUTIONS, DEFECTS } from '../../common/constants';

const Color = require('color');

const getDefects = (fields) => fields.filter((item) => /defects/.test(item));

const getExecutions = () => [
  'statistics$executions$failed',
  'statistics$executions$skipped',
  'statistics$executions$passed',
  'statistics$executions$untested',
];

const getTotal = () => ['statistics$executions$total'];

const getPercentageValue = (value, datasets, label, index) => {
  const totalDataset = datasets[0];
  const isDefectType = /defects/.test(label);
  let totalValue = totalDataset && totalDataset.data[index];

  if (isDefectType) {
    const defects = datasets.filter((item) => /defects/.test(item.label));

    totalValue = defects.reduce((total, defect) => total + defect.data[index], 0);
  }

  return -((-value / totalValue) * 100).toFixed(2);
};

const convertIntoPercents = (datasets) => {
  return datasets.map((dataset) =>
    Object.assign(
      {
        absData: dataset.data,
      },
      dataset,
      {
        data: dataset.data.map((value, index) =>
          getPercentageValue(value, datasets, dataset.label, index),
        ),
      },
    ),
  );
};

const firstCapital = (string) => string.charAt(0).toUpperCase() + string.slice(1);

export const getColorForKey = (key) => COLORS[`COLOR_${key.split('$')[2].toUpperCase()}`];

export const generateChartColors = (widget) => {
  const colors = {};
  widget.contentParameters.contentFields.forEach((key) => {
    // gets colors for items
    colors[key] = getColorForKey(key);
  });
  return colors;
};
/* eslint func-names: ["error", "never" ] */
const createDataSet = (field, group, options) => {
  const { defectTypes, separate, showTotal, uncheckedLegendItems } = options;
  const isTotalDataset = /executions\$total/.test(field);
  const color = isTotalDataset ? 'transparent' : getColorForKey(field);

  return {
    label: field,
    hidden: uncheckedLegendItems.includes(field) || (isTotalDataset && !showTotal),
    data: [],
    borderColor: isTotalDataset ? '#000000' : color,
    borderWidth: isTotalDataset ? { left: 0, top: 0, right: 1, bottom: 0 } : 0,
    backgroundColor:
      group === DEFECTS && !defectTypes
        ? Color(color)
            .alpha(0.3)
            .string()
        : color,
    stack: separate ? field : group,
    datalabels: {
      display: isTotalDataset,
      align: 'end',
      anchor: 'end',
      offset: -5,
    },
  };
};

const getScaleName = (widget, options) => {
  const { attributes } = widget.contentParameters.widgetOptions;
  const { activeAttribute } = options;

  return activeAttribute && attributes[1] ? attributes[1] : attributes[0];
};

const getChartOptions = (widget, options) => {
  const { percentage, formatMessage, tooltipContents, showTotal, onResize } = options;

  return {
    responsive: true,
    maintainAspectRatio: true,
    onResize,
    legend: {
      display: false,
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 30,
        bottom: 0,
      },
    },
    scales: {
      yAxes: [
        {
          stacked: true,
          ticks: {
            max: percentage ? 100 : undefined,
            callback: (value) => `${value}${percentage ? '%' : ''}`,
          },
        },
      ],
      xAxes: [
        {
          id: DEFECTS,
          categoryPercentage: 0.4,
          gridLines: {
            display: false,
            offsetGridLines: true,
          },
          scaleLabel: {
            display: true,
            labelString: firstCapital(getScaleName(widget, options)),
            fontSize: 15,
          },
        },
      ],
    },
    tooltips: {
      intersect: true,
      mode: 'x',
      callbacks: {
        title(tooltipItem, data) {
          const titleName = getScaleName(widget, options);
          return `${firstCapital(titleName)}: ${data.labels[tooltipItem[0].index]}`;
        },
        afterTitle(tooltipItem) {
          return tooltipContents[tooltipItem[0].index];
        },
        label(tooltipItem, data) {
          const dataset = data.datasets[tooltipItem.datasetIndex];
          const label = messages[dataset.label]
            ? formatMessage(messages[dataset.label])
            : dataset.label;
          const value = dataset.data[tooltipItem.index];
          if (!value) {
            return '';
          }
          const percentageValue = getPercentageValue(
            value,
            data.datasets,
            dataset.label,
            tooltipItem.index,
          );
          if (percentage) {
            return ` ${label}: ${percentageValue}%`;
          }
          return ` ${label}: ${value}  (${percentageValue}%)`;
        },
      },
      backgroundColor: '#FFF',
      titleFontSize: 14,
      titleFontColor: '#464547',
      bodyFontColor: '#464547',
      bodyFontSize: 13,
      displayColors: true,
      borderColor: '#d4d4d4',
      borderWidth: 1,
      bodySpacing: 5,
    },
    hover: {
      mode: 'nearest',
      intersect: true,
    },
    plugins: {
      datalabels: {
        formatter: (value, context) =>
          showTotal && percentage ? context.dataset.absData[context.dataIndex] : value,
      },
    },
  };
};

export const getChartData = (widget, options) => {
  const { percentage, defectTypes } = options;
  const contentFields = widget.contentParameters.contentFields;
  const executions = getExecutions();
  const defects = getDefects(contentFields);
  const total = getTotal();
  const legendItems = defectTypes ? defects : executions;
  const filteredContentFields = Array.prototype.concat(
    total,
    defects,
    defectTypes ? [] : executions,
  );
  const tooltipContents = [];
  const labels = [];

  let datasets = Array.prototype.concat(
    total.map((field) => createDataSet(field, null, options)),
    executions.map((field) => createDataSet(field, EXECUTIONS, options)),
    defects.map((field) => createDataSet(field, DEFECTS, options)),
  );

  if (widget.content.result) {
    widget.content.result.forEach((item) => {
      tooltipContents.push(item.content.tooltipContent);
      labels.push(item.attributeValue);

      filteredContentFields.forEach((field) => {
        const totals = item.content.statistics[field] || 0;
        const column = datasets.find((entry) => entry.label === field);

        column.data.push(totals);
      });
    });
  }

  if (percentage) {
    datasets = convertIntoPercents(datasets);
  }

  const chartOptions = getChartOptions(widget, { tooltipContents, ...options });

  return { labels, datasets, chartOptions, legendItems };
};
