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

import { string, node, shape, arrayOf, bool, number, oneOf, oneOfType } from 'prop-types';
import { FAILED, PASSED, SKIPPED, UNTESTED } from 'common/constants/launchStatuses';

export const PTLaunch = shape({
  id: string.isRequired,
  name: string.isRequired,
  number: string.isRequired,
  issueType: string,
});

export const PTStatus = oneOf([
  FAILED.toUpperCase(),
  PASSED.toUpperCase(),
  SKIPPED.toUpperCase(),
  UNTESTED.toUpperCase(),
]);

export const PTTest = shape({
  name: string,
  itemName: string,
  uniqueId: string.isRequired,
  status: arrayOf(oneOfType([oneOf([FAILED, PASSED]), bool])),
  total: number,
  criteria: number,
  flakyCount: number,
  statuses: arrayOf(PTStatus),
});

export const PTColumns = shape({
  name: shape({
    header: node.isRequired,
    nameKey: string.isRequired,
  }).isRequired,
  date: shape({
    header: node.isRequired,
    dateKey: string.isRequired,
  }),
  count: shape({
    header: node.isRequired,
    headerShort: node.isRequired,
    countKey: string.isRequired,
    matrixKey: string.isRequired,
    renderAsBool: bool,
  }),
  percents: shape({
    header: node.isRequired,
    headerShort: node.isRequired,
  }),
  status: shape({
    header: node.isRequired,
    statusKey: string.isRequired,
  }),
  duration: shape({
    header: node.isRequired,
    durationKey: string.isRequired,
  }),
});

export const PTTests = arrayOf(PTTest);
