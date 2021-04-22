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

import { FAILED, INTERRUPTED, PASSED, SKIPPED, UNTESTED } from 'common/constants/launchStatuses';
import {
  STATS_TOTAL,
  STATS_SKIPPED,
  STATS_PASSED,
  STATS_FAILED,
  STATS_UNTESTED,
} from 'common/constants/statistics';
import { getItemNameConfig } from 'components/widgets/common/utils';

export const getStatisticsStatuses = (type) => {
  switch (type) {
    case STATS_TOTAL:
      return [
        PASSED.toUpperCase(),
        FAILED.toUpperCase(),
        SKIPPED.toUpperCase(),
        UNTESTED.toUpperCase(),
        INTERRUPTED.toUpperCase(),
      ];
    case STATS_PASSED:
      return [PASSED.toUpperCase()];
    case STATS_FAILED:
      return [FAILED.toUpperCase(), INTERRUPTED.toUpperCase()];
    case STATS_SKIPPED:
      return [SKIPPED.toUpperCase()];
    case STATS_UNTESTED:
      return [UNTESTED.toUpperCase()];
    default:
      break;
  }
  return [];
};

export const getPassingRate = (passed = 0, total) => `${Math.round((100 * passed) / total)}%`;

export const groupFieldsWithDefectTypes = (contentFields) =>
  contentFields.reduce((acc, item) => {
    const { defectType, locator } = getItemNameConfig(item);
    const itemKey = locator && defectType ? defectType : item;

    if (acc[itemKey]) {
      acc[itemKey].push(item);
    } else {
      acc[itemKey] = [item];
    }

    return acc;
  }, {});
