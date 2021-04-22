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
import { defineMessages, FormattedMessage } from 'react-intl';
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
import {
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
} from 'components/widgets/singleLevelWidgets/tables/components/messages';
import { NAME, CUSTOM_COLUMN, STATUS, PASS_RATE } from './constants';

const statusColumnTitle = (
  <FormattedMessage id={'ComponentHealthCheckTable.statusColumn'} defaultMessage={'Status'} />
);
const passRateColumnTitle = (
  <FormattedMessage id={'ComponentHealthCheckTable.passRateColumn'} defaultMessage={'Pass rate'} />
);
const toInvestigateColumnTitle = (
  <FormattedMessage
    id={'ComponentHealthCheckTable.toInvestigateColumnTitle'}
    defaultMessage={'To investigate'}
  />
);
const productBugColumnTitle = (
  <FormattedMessage
    id={'ComponentHealthCheckTable.productBugColumnTitle'}
    defaultMessage={'Product bug'}
  />
);
const automationBugColumnTitle = (
  <FormattedMessage
    id={'ComponentHealthCheckTable.automationBugColumnTitle'}
    defaultMessage={'Automation bug'}
  />
);
const systemIssueColumnTitle = (
  <FormattedMessage
    id={'ComponentHealthCheckTable.systemIssueColumnTitle'}
    defaultMessage={'System issue'}
  />
);

export const COLUMN_NAMES_MAP = {
  [NAME]: () => ({
    full: '',
    short: '',
  }),
  [CUSTOM_COLUMN]: (name) => ({
    full: name,
    short: name,
  }),
  [STATUS]: () => ({
    full: statusColumnTitle,
    short: statusColumnTitle,
  }),
  [STATS_TOTAL]: () => ({
    full: totalColumnFullTitle,
    short: totalColumnShortTitle,
  }),
  [STATS_PASSED]: () => ({
    full: passedColumnFullTitle,
    short: passedColumnShortTitle,
  }),
  [STATS_FAILED]: () => ({
    full: failedColumnFullTitle,
    short: failedColumnShortTitle,
  }),
  [STATS_SKIPPED]: () => ({
    full: skippedColumnFullTitle,
    short: skippedColumnShortTitle,
  }),
  [STATS_UNTESTED]: () => ({
    full: untestedColumnFullTitle,
    short: untestedColumnShortTitle,
  }),
  [TO_INVESTIGATE]: () => ({
    full: toInvestigateColumnTitle,
    short: 'TI',
  }),
  [AUTOMATION_BUG]: () => ({
    full: automationBugColumnTitle,
    short: 'AB',
  }),
  [PRODUCT_BUG]: () => ({
    full: productBugColumnTitle,
    short: 'PB',
  }),
  [SYSTEM_ISSUE]: () => ({
    full: systemIssueColumnTitle,
    short: 'SI',
  }),
  [PASS_RATE]: () => ({
    full: passRateColumnTitle,
    short: passRateColumnTitle,
  }),
};

export const hintMessages = defineMessages({
  customColumnHint: {
    id: 'ComponentHealthCheckTable.customColumnHint',
    defaultMessage: 'Custom column:',
  },
  statusHint: {
    id: 'ComponentHealthCheckTable.statusHint',
    defaultMessage: 'Status:',
  },
  passingRateHint: {
    id: 'ComponentHealthCheckTable.passingRateHint',
    defaultMessage: 'Pass rate:',
  },
  nameTotal: {
    id: 'ComponentHealthCheckTable.nameTotal',
    defaultMessage: 'Total',
  },
});
