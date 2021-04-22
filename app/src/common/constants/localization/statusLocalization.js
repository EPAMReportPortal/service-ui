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
import * as statuses from '../testStatuses';

export const statusLocalization = defineMessages({
  [statuses.PASSED]: {
    id: 'TestStatuses.passed',
    defaultMessage: 'Passed',
  },
  [statuses.FAILED]: {
    id: 'TestStatuses.failed',
    defaultMessage: 'Failed',
  },
  [statuses.IN_PROGRESS]: {
    id: 'TestStatuses.inProgress',
    defaultMessage: 'In progress',
  },
  [statuses.INTERRUPTED]: {
    id: 'TestStatuses.interrupted',
    defaultMessage: 'Interrupted',
  },
  [statuses.UNTESTED]: {
    id: 'TestStatuses.untested',
    defaultMessage: 'Untested',
  },
  [statuses.SKIPPED]: {
    id: 'TestStatuses.skipped',
    defaultMessage: 'Skipped',
  },
  [statuses.STOPPED]: {
    id: 'TestStatuses.stopped',
    defaultMessage: 'Stopped',
  },
  [statuses.RESETED]: {
    id: 'TestStatuses.reseted',
    defaultMessage: 'Reseted',
  },
  [statuses.CANCELLED]: {
    id: 'TestStatuses.cancelled',
    defaultMessage: 'Cancelled',
  },
  [statuses.NOT_FOUND]: {
    id: 'TestStatuses.notFound',
    defaultMessage: 'No item in launch',
  },
  [statuses.WARN]: {
    id: 'TestStatuses.warn',
    defaultMessage: 'Warn',
  },
  [statuses.INFO]: {
    id: 'TestStatuses.info',
    defaultMessage: 'Info',
  },
});
