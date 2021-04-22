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

import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import {
  STATS_TOTAL,
  STATS_PASSED,
  STATS_FAILED,
  STATS_SKIPPED,
  STATS_UNTESTED,
} from 'common/constants/statistics';
import {
  PRODUCT_BUG,
  TO_INVESTIGATE,
  AUTOMATION_BUG,
  SYSTEM_ISSUE,
} from 'common/constants/defectTypes';
import { STATS_SI, STATS_AB, STATS_TI, STATS_PB } from '../components/constants';
import {
  defaultDefectsMessages,
  totalColumnFullTitle,
  skippedColumnShortTitle,
  skippedColumnFullTitle,
  passedColumnShortTitle,
  passedColumnFullTitle,
  failedColumnShortTitle,
  failedColumnFullTitle,
  untestedColumnShortTitle,
  untestedColumnFullTitle,
  totalColumnShortTitle,
} from '../components/messages';
import { END_TIME, NAME, START_TIME, STATUS } from './constants';

const nameColumnTitle = (
  <FormattedMessage id={'LaunchesTable.nameColumn'} defaultMessage={'Name'} />
);
const statusColumnTitle = (
  <FormattedMessage id={'LaunchesTable.statusColumn'} defaultMessage={'Status'} />
);
const startTimeColumnFullTitle = (
  <FormattedMessage id={'LaunchesTable.startTimeColumnFull'} defaultMessage={'Start time'} />
);
const startTimeColumnShortTitle = (
  <FormattedMessage id={'LaunchesTable.startTimeColumnShort'} defaultMessage={'Start'} />
);
const endTimeColumnFullTitle = (
  <FormattedMessage id={'LaunchesTable.endTimeColumnFull'} defaultMessage={'Finish time'} />
);
const endTimeColumnShortTitle = (
  <FormattedMessage id={'LaunchesTable.endTimeColumnShort'} defaultMessage={'Finish'} />
);

export const hintMessages = defineMessages({
  statusHint: {
    id: 'LaunchesTable.statusHint',
    defaultMessage: 'Status:',
  },
  startTimeHint: {
    id: 'LaunchesTable.startTimeHint',
    defaultMessage: 'Start time:',
  },
  endTimeHint: {
    id: 'LaunchesTable.endTimeHint',
    defaultMessage: 'Finish time:',
  },
});

export const COLUMN_NAMES_MAP = {
  [NAME]: {
    full: nameColumnTitle,
    short: nameColumnTitle,
  },
  [STATUS]: {
    full: statusColumnTitle,
    short: statusColumnTitle,
  },
  [START_TIME]: {
    full: startTimeColumnFullTitle,
    short: startTimeColumnShortTitle,
  },
  [END_TIME]: {
    full: endTimeColumnFullTitle,
    short: endTimeColumnShortTitle,
  },
  [STATS_TOTAL]: {
    full: totalColumnFullTitle,
    short: totalColumnShortTitle,
  },
  [STATS_PASSED]: {
    full: passedColumnFullTitle,
    short: passedColumnShortTitle,
  },
  [STATS_FAILED]: {
    full: failedColumnFullTitle,
    short: failedColumnShortTitle,
  },
  [STATS_UNTESTED]: {
    full: untestedColumnFullTitle,
    short: untestedColumnShortTitle,
  },
  [STATS_SKIPPED]: {
    full: skippedColumnFullTitle,
    short: skippedColumnShortTitle,
  },
  [STATS_TI]: {
    full: defaultDefectsMessages[STATS_TI],
    short: 'to invest',
  },
  [STATS_AB]: {
    full: 'Auto bug',
  },
  [STATS_PB]: {
    full: defaultDefectsMessages[STATS_PB],
  },
  [STATS_SI]: {
    full: defaultDefectsMessages[STATS_SI],
  },
  [TO_INVESTIGATE]: {
    full: defaultDefectsMessages[STATS_TI],
    short: 'to invest',
  },
  [AUTOMATION_BUG]: {
    full: 'Auto bug',
  },
  [PRODUCT_BUG]: {
    full: defaultDefectsMessages[STATS_PB],
  },
  [SYSTEM_ISSUE]: {
    full: defaultDefectsMessages[STATS_SI],
  },
};
