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

import { getChartData } from '../common/config/utils';

export const getColumns = (content) => {
  const values = (content[0] || content).values;
  const { itemTypes: chartData, itemColors: colors } = getChartData(values, '$executions$');
  const columns = [];

  chartData.statistics$executions$passed &&
    columns.push(['statistics$executions$passed', chartData.statistics$executions$passed]);
  chartData.statistics$executions$failed &&
    columns.push(['statistics$executions$failed', chartData.statistics$executions$failed]);
  chartData.statistics$executions$skipped &&
    columns.push(['statistics$executions$skipped', chartData.statistics$executions$skipped]);
  chartData.statistics$executions$untested &&
    columns.push(['statistics$executions$untested', chartData.statistics$executions$untested]);

  return {
    columns,
    colors,
  };
};
