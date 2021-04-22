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
import { FormattedMessage } from 'react-intl';
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
  SYSTEM_ISSUE,
  AUTOMATION_BUG,
  NO_DEFECT,
} from 'common/constants/defectTypes';
import { STATS_AB, STATS_ND, STATS_PB, STATS_SI, STATS_TI } from './constants';

export const totalColumnFullTitle = (
  <FormattedMessage id={'TableWidgets.totalColumnFull'} defaultMessage={'Total'} />
);
export const totalColumnShortTitle = (
  <FormattedMessage id={'TableWidgets.totalColumnShort'} defaultMessage={'Ttl'} />
);
export const passedColumnFullTitle = (
  <FormattedMessage id={'TableWidgets.passedColumnFull'} defaultMessage={'Passed'} />
);
export const passedColumnShortTitle = (
  <FormattedMessage id={'TableWidgets.passedColumnShort'} defaultMessage={'ps'} />
);
export const untestedColumnFullTitle = (
  <FormattedMessage id={'TableWidgets.untestedColumnFull'} defaultMessage={'Untested'} />
);
export const untestedColumnShortTitle = (
  <FormattedMessage id={'TableWidgets.untestedColumnShort'} defaultMessage={'un'} />
);
export const failedColumnFullTitle = (
  <FormattedMessage id={'TableWidgets.failedColumnFull'} defaultMessage={'Failed'} />
);
export const failedColumnShortTitle = (
  <FormattedMessage id={'TableWidgets.failedColumnShort'} defaultMessage={'fl'} />
);
export const skippedColumnFullTitle = (
  <FormattedMessage id={'TableWidgets.skippedColumnFull'} defaultMessage={'Skipped'} />
);
export const skippedColumnShortTitle = (
  <FormattedMessage id={'TableWidgets.skippedColumnShort'} defaultMessage={'skp'} />
);

export const defaultDefectsMessages = {
  [STATS_TI]: 'To investigate',
  [STATS_PB]: 'Product bug',
  [STATS_AB]: 'Automation bug',
  [STATS_ND]: 'No defect',
  [STATS_SI]: 'System issue',
  [TO_INVESTIGATE]: 'To investigate',
  [PRODUCT_BUG]: 'Product bug',
  [AUTOMATION_BUG]: 'Automation bug',
  [NO_DEFECT]: 'No defect',
  [SYSTEM_ISSUE]: 'System issue',
};

export const defaultStatisticsMessages = {
  [STATS_TOTAL]: totalColumnFullTitle,
  [STATS_PASSED]: passedColumnFullTitle,
  [STATS_FAILED]: failedColumnFullTitle,
  [STATS_SKIPPED]: skippedColumnFullTitle,
  [STATS_UNTESTED]: untestedColumnFullTitle,
};
