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

import { ALIGN_CENTER } from './constants';

export const SIMPLE_DATA = [
  {
    id: 'id1',
    name: 'foo 1',
    description: 'some description',
    total: 100,
    passed: 70,
    failed: 25,
    skipped: 5,
  },
  {
    id: 'id2',
    name: 'foo 2',
    description: 'another description',
    total: 10,
    passed: 7,
    failed: 2,
    skipped: 1,
  },
];

export const SIMPLE_COLUMNS = [
  {
    id: 'name',
    title: { full: 'name' },
    formatter: ({ name }) => name,
  },
  {
    id: 'total',
    title: { full: 'total' },
    align: ALIGN_CENTER,
    formatter: ({ total }) => total,
    sortable: true,
    withFilter: true,
  },
  {
    id: 'passed',
    title: { full: 'passed' },
    align: ALIGN_CENTER,
    formatter: ({ passed }) => passed,
    sortable: true,
    withFilter: true,
  },
  {
    id: 'failed',
    title: { full: 'failed' },
    align: ALIGN_CENTER,
    formatter: ({ failed }) => failed,
  },
  {
    id: 'skipped',
    title: { full: 'skipped' },
    align: ALIGN_CENTER,
    formatter: ({ skipped }) => skipped,
  },
  {
    id: 'untested',
    title: { full: 'untested' },
    align: ALIGN_CENTER,
    formatter: ({ untested }) => untested,
  },
];

export const STEP_DATA = [
  {
    id: 187146,
    time: 1559899624099,
    message:
      "[main] com.epam.ta.utils.logger.Logger - Attempt to find element by By.xpath: //a[@href='#widgetTemplates'].",
    level: 'INFO',
    itemId: 41480,
  },
  {
    id: 187147,
    time: 1559899624099,
    message:
      '09:11:55.442 [main] INFO  com.epam.ta.utils.logger.Logger - ScreenShot name: i98tivm7g2bq87rcehcs5ficdv',
    level: 'WARN',
    itemId: 41480,
  },
  {
    id: 41480,
    name: 'updateDefaultMode',
    description:
      'Clear all created and not deleted during test *userFilter*, *widget* and *dashboard* objects.',
    parameters: [
      {
        key: null,
        value: null,
      },
    ],
    attributes: [
      {
        key: 'os',
        value: 'android',
      },
      {
        key: 'os',
        value: 'ios',
      },
      {
        key: null,
        value: 'api',
      },
    ],
    type: 'STEP',
    startTime: 1559899623913,
    endTime: 1559899624179,
    status: 'FAILED',
    statistics: {
      executions: {
        total: 1,
        failed: 1,
      },
      defects: {
        to_investigate: {
          total: 1,
          ti001: 1,
        },
      },
    },
    parent: 41479,
    pathNames: {
      launchPathName: {
        name: 'Nested Steps Launch',
        number: 1,
      },
      itemPaths: [
        { id: 41472, name: 'Launch Tests' },
        { id: 41479, name: 'UpdateLaunchTest' },
      ],
    },
    issue: {
      issueType: 'ti001',
      autoAnalyzed: false,
      ignoreAnalyzer: false,
      externalSystemIssues: [],
    },
    hasChildren: true,
    hasStats: true,
    launchId: 668,
    uniqueId: 'auto:95851c62d74d8296fe185a76781bad74',
    patternTemplates: [],
    retries: [],
    path: '41472.41479.41480',
    attachmentCount: 0,
    children: [
      {
        id: 187148,
        time: 1559899624099,
        message:
          '09:53:43.161 [main] INFO  com.epam.ta.utils.logger.Logger - Switch to project: default_project.',
        level: 'WARN',
        itemId: 41480,
      },
      {
        id: 187149,
        time: 1559899624099,
        message:
          "10:21:32.306 [main] INFO  com.epam.ta.utils.logger.Logger - [STEP] Delete project with name 'test_project_wskwd6abhj'",
        level: 'DEBUG',
        itemId: 41480,
      },
      {
        id: 41496,
        name: 'after_method',
        parameters: [
          {
            key: null,
            value: null,
          },
        ],
        attributes: [],
        type: 'AFTER_METHOD',
        startTime: 1559899630885,
        endTime: 1559899631092,
        status: 'SKIPPED',
        statistics: {
          executions: {},
          defects: {
            to_investigate: {
              total: 1,
              ti001: 1,
            },
          },
        },
        parent: 41490,
        pathNames: {
          launchPathName: {
            name: 'Nested Steps Launch',
            number: 1,
          },
          itemPaths: [
            { id: 41472, name: 'Launch Tests' },
            { id: 41479, name: 'UpdateLaunchTest' },
          ],
        },
        issue: {
          issueType: 'ti001',
          autoAnalyzed: false,
          ignoreAnalyzer: false,
          externalSystemIssues: [],
        },
        hasChildren: true,
        hasStats: true,
        launchId: 668,
        uniqueId: 'auto:0c462a14fa2c48e949072caddf94fda4',
        patternTemplates: [],
        retries: [],
        path: '41472.41490.41496',
        attachmentCount: 0,
        children: [
          {
            id: 187155,
            time: 1559899624101,
            message:
              '09:55:10.998 [main] INFO  com.epam.ta.utils.logger.Logger - [STEP] Create test project.',
            level: 'DEBUG',
            itemId: 41480,
          },
          {
            id: 187156,
            time: 1559899624101,
            message:
              "[main] com.epam.ta.utils.logger.Logger - Attempt to find element by By.xpath: //div[@data-id='allCases']/span[@class='name-text multiple-spaces'].",
            level: 'WARN',
            itemId: 41480,
          },
          {
            id: 365008,
            itemId: 77338,
            level: 'ERROR',
            message:
              "11:59:04.674 [TestNG-tests-2] ERROR c.e.t.r.q.w.c.FailureLoggingListener - Configuration clearCreatedObjects has been failed with exception com.epam.ta.client.exception.ReportPortalClientException: Report Portal returned error↵Status code: 404↵Status message:↵Error Message: Project 'test_project_2yxr1vdyry' not found. Did you use correct project name?↵Error Type: PROJECT_NOT_FOUND↵Stack Trace:↵	at com.epam.ta.client.service.ReportPortalErrorHandler.handleClientError(ReportPortalErrorHandler.java:47)↵	at com.epam.ta.restclient.endpoint.DefaultErrorHandler.handle(DefaultErrorHandler.java:73)↵	at com.epam.ta.restclient.endpoint.DefaultErrorHandler.handle(DefaultErrorHandler.java:40)↵	at com.epam.ta.restclient.endpoint.HttpClientRestEndpoint.executeInternal(HttpClientRestEndpoint.java:322)↵	at com.epam.ta.restclient.endpoint.HttpClientRestEndpoint.delete(HttpClientRestEndpoint.java:181)↵	at com.epam.ta.client.service.ReportPortalService.deleteProject(ReportPortalService.java:712)↵	at com.epam.ta.reportportal.qa.ws.core.BatchedReportPortalServiceInterceptor.cleanOldProjects(BatchedReportPortalServiceInterceptor.java:383)↵	at com.epam.ta.reportportal.qa.ws.core.BatchedReportPortalServiceInterceptor.cleanProjects(BatchedReportPortalServiceInterceptor.java:372)↵	at com.epam.ta.reportportal.qa.ws.core.BatchedReportPortalServiceInterceptor.clear(BatchedReportPortalServiceInterceptor.java:248)↵	at com.epam.ta.reportportal.qa.ws.factory.ReportPortalServiceFactory.clear(ReportPortalServiceFactory.java:116)↵	at com.epam.ta.reportportal.qa.ws.tests.BaseReportPortalTest.clearCreatedObjects(BaseReportPortalTest.java:61)↵	at sun.reflect.GeneratedMethodAccessor146.invoke(Unknown Source)↵	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)↵	at java.lang.reflect.Method.invoke(Method.java:498)↵	at org.testng.internal.MethodInvocationHelper.invokeMethod(MethodInvocationHelper.java:108)↵	at org.testng.internal.Invoker.invokeConfigurationMethod(Invoker.java:523)↵	at org.testng.internal.Invoker.invokeConfigurations(Invoker.java:224)↵	at org.testng.internal.Invoker.invokeConfigurations(Invoker.java:146)↵	at org.testng.internal.TestMethodWorker.invokeAfterClassMethods(TestMethodWorker.java:212)↵	at org.testng.internal.TestMethodWorker.run(TestMethodWorker.java:112)↵	at org.testng.TestRunner.privateRun(TestRunner.java:744)↵	at org.testng.TestRunner.run(TestRunner.java:602)↵	at org.testng.SuiteRunner.runTest(SuiteRunner.java:380)↵	at org.testng.SuiteRunner.access$000(SuiteRunner.java:39)↵	at org.testng.SuiteRunner$SuiteWorker.run(SuiteRunner.java:414)↵	at org.testng.internal.thread.ThreadUtil$1.call(ThreadUtil.java:52)↵	at java.util.concurrent.FutureTask.run(FutureTask.java:266)↵	at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1142)↵	at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:617)↵	at java.lang.Thread.run(Thread.java:748)",
            time: 1560159361357,
          },
          {
            id: 187157,
            time: 1559899624101,
            message:
              '[Forwarding findElement on session 477bee808ca0c415a7aae2de2edc5cc9 to remote] DEBUG o.a.h.c.protocol.RequestAddCookies - CookieSpec selected: default',
            level: 'WARN',
            itemId: 41480,
          },
        ],
      },
    ],
  },
  {
    id: 41498,
    name: 'after_method',
    description:
      'Clear all created and not deleted during test *userFilter*, *widget* and *dashboard* objects.',
    parameters: [
      {
        key: null,
        value: null,
      },
    ],
    attributes: [
      {
        key: 'os',
        value: 'android',
      },
      {
        key: null,
        value: 'flaky',
      },
      {
        key: 'os',
        value: 'ios',
      },
    ],
    type: 'AFTER_METHOD',
    startTime: 1559899631734,
    endTime: 1559899631914,
    status: 'FAILED',
    statistics: {
      executions: {},
      defects: {
        to_investigate: {
          total: 1,
          ti001: 1,
        },
      },
    },
    parent: 41490,
    pathNames: {
      launchPathName: {
        name: 'Nested Steps Launch',
        number: 1,
      },
      itemPaths: [
        { id: 41472, name: 'Launch Tests' },
        { id: 41479, name: 'UpdateLaunchTest' },
      ],
    },
    issue: {
      issueType: 'ti001',
      comment: 'Should be marked with custom defect type',
      autoAnalyzed: false,
      ignoreAnalyzer: false,
      externalSystemIssues: [],
    },
    hasChildren: true,
    hasStats: true,
    launchId: 668,
    uniqueId: 'auto:0c462a14fa2c48e949072caddf94fda4',
    patternTemplates: [],
    retries: [],
    path: '41472.41490.41498',
    attachmentCount: 0,
    children: [
      {
        id: 187151,
        time: 1559899624099,
        message:
          "10:20:48.996 [main] INFO  com.epam.ta.utils.logger.Logger - [STEP] Open 'Project Settingstest_project_lwsjofbwwa' page",
        level: 'DEBUG',
        itemId: 41480,
      },
      {
        id: 187152,
        time: 1559899624099,
        message: '09:53:18.335 [main] INFO  com.epam.ta.utils.logger.Logger - Set user project.',
        level: 'INFO',
        itemId: 41480,
      },
    ],
  },
  {
    id: 187153,
    time: 1559899624100,
    message: "09:53:14.709 [main] INFO  com.epam.ta.utils.logger.Logger - [STEP] Open 'Users' page",
    binaryContent: {
      id:
        'L2RhdGEvc3RvcmFnZS8xLzE1OC9mYS9iOS84My84MC0wOTkyLTQ2ZjgtYjFmYS05NjU3NGUzNjY3NzMveG1sLnhtbA',
      contentType: 'application/xml',
    },
    level: 'INFO',
    itemId: 41480,
  },
  {
    id: 187154,
    time: 1559899624101,
    message:
      "10:14:49.168 [main] INFO  com.epam.ta.utils.logger.Logger - [STEP] Delete project with name 'test_project_8fguvuwbxk'",
    level: 'INFO',
    itemId: 41480,
  },
];
