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

import * as React from 'react';
import { FormattedMessage } from 'react-intl';

const issueTypes = {
  failed: <FormattedMessage id="MostFailedTests.header.issueType.failed" defaultMessage="Failed" />,
  skipped: (
    <FormattedMessage id="MostFailedTests.header.issueType.skipped" defaultMessage="Skipped" />
  ),
  untested: (
    <FormattedMessage id="MostFailedTests.header.issueType.untested" defaultMessage="Untested" />
  ),
  product_bug: (
    <FormattedMessage
      id="MostFailedTests.header.issueType.product_bug"
      defaultMessage="Product Bug"
    />
  ),
  automation_bug: (
    <FormattedMessage
      id="MostFailedTests.header.issueType.automation_bug"
      defaultMessage="Automation Bug"
    />
  ),
  system_issue: (
    <FormattedMessage
      id="MostFailedTests.header.issueType.system_issue"
      defaultMessage="System Issue"
    />
  ),
  no_defect: (
    <FormattedMessage id="MostFailedTests.header.issueType.no_defect" defaultMessage="No Defect" />
  ),
};

const columns = {
  name: {
    header: (
      <FormattedMessage id="MostFailedTests.table.header.testCase" defaultMessage="Test case" />
    ),
    nameKey: 'name',
  },
  count: {
    header: (
      <FormattedMessage
        id="MostFailedTests.table.header.issuesInExec"
        defaultMessage="Issues in execution"
      />
    ),
    headerShort: (
      <FormattedMessage
        id="MostFailedTests.table.header.issuesInExecShort"
        defaultMessage="Issues"
      />
    ),
    countKey: 'criteria',
    matrixKey: 'status',
    renderAsBool: true,
  },
  percents: {
    header: (
      <FormattedMessage id="MostFailedTests.table.header.ofIssues" defaultMessage="% of issues" />
    ),
    headerShort: (
      <FormattedMessage id="MostFailedTests.table.header.ofIssuesShort" defaultMessage="% issues" />
    ),
  },
  date: {
    header: (
      <FormattedMessage id="MostFailedTests.table.header.lastIssue" defaultMessage="Last issue" />
    ),
    dateKey: 'startTime',
  },
};

export { issueTypes, columns };
