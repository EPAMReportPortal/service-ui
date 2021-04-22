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

import { defineMessages } from 'react-intl';
import { COLOR_FAILEDSKIPPEDUNTESTEDTOTAL } from 'common/constants/colors';
import { createTooltipRenderer } from 'components/widgets/common/tooltip';
import { getLaunchAxisTicks } from 'components/widgets/common/utils';
import { IssueTypeStatTooltip } from '../../common/issueTypeStatTooltip';
import { calculateTooltipParams } from './utils';

const localMessages = defineMessages({
  nonPassedCases: {
    id: 'NonPassedTestCasesTrendChart.nonPassedCases',
    defaultMessage: 'of non-passed cases',
  },
});
const FAILED_SKIPPED_UNTESTED_TOTAL = '% (Failed+Skipped+Untested)/Total';

export const getConfig = ({
  content,
  isPreview,
  formatMessage,
  positionCallback,
  size,
  onChartClick,
}) => {
  const chartData = ['notPassed'];
  const itemsData = [];

  content.forEach((item) => {
    const value = parseFloat(item.values[FAILED_SKIPPED_UNTESTED_TOTAL]);
    const { id, name, number, startTime } = item;
    itemsData.push({ id, name, number, startTime });
    chartData.push(value);
  });

  return {
    data: {
      columns: [chartData],
      colors: {
        notPassed: COLOR_FAILEDSKIPPEDUNTESTEDTOTAL,
      },
      onclick: isPreview ? undefined : onChartClick,
      itemsData,
    },
    point: {
      sensitivity: 1000,
      r: itemsData.length === 1 ? 5 : 1,
      focus: {
        expand: {
          r: 5,
        },
      },
    },
    grid: {
      y: {
        show: !isPreview,
      },
    },
    axis: {
      x: {
        show: !isPreview,
        type: 'category',
        categories: itemsData.map((item) => `# ${item.number}`),
        tick: {
          values: getLaunchAxisTicks(itemsData.length),
          width: 60,
          centered: true,
          inner: true,
          multiline: false,
          outer: false,
        },
      },
      y: {
        show: !isPreview,
        max: 100,
        min: 0,
        padding: {
          top: 5,
          bottom: 0,
        },
        label: {
          text: `% ${formatMessage(localMessages.nonPassedCases)}`,
          position: 'outer-middle',
        },
      },
    },
    interaction: {
      enabled: !isPreview,
    },
    padding: {
      top: isPreview ? 0 : 85,
      left: isPreview ? 0 : 60,
      right: isPreview ? 0 : 20,
      bottom: 0,
    },
    legend: {
      show: false, // we use custom legend
    },
    tooltip: {
      grouped: true,
      position: positionCallback,
      contents: createTooltipRenderer(IssueTypeStatTooltip, calculateTooltipParams, {
        itemsData,
        formatMessage,
      }),
    },
    size,
  };
};
