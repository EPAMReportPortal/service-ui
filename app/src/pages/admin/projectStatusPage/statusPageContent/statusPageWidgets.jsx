import { URLS } from 'common/urls';
import { GeneralInfo, OwnersInfo } from './widgets';
import { WIDGETS_IDS } from '../constants';
import { messages } from './messages';

export const statusPageWidgets = [
  {
    title: messages.general,
    id: WIDGETS_IDS.general,
    source: WIDGETS_IDS.general,
    component: (data) => <GeneralInfo data={data} />,
    getUrl: URLS.projectStatus,
  },
  {
    title: messages.owners,
    id: WIDGETS_IDS.owners,
    source: WIDGETS_IDS.general,
    component: (data) => <OwnersInfo data={data} />,
  },
  {
    title: messages.lastLaunch,
    id: WIDGETS_IDS.lastLaunch,
    source: WIDGETS_IDS.lastLaunch,
    component: () => <div />,
    getUrl: (projectId, interval) =>
      URLS.projectWidget(projectId, WIDGETS_IDS.lastLaunch, interval),
  },
  {
    title: messages.launchesQuantity,
    id: WIDGETS_IDS.launchesQuantity,
    source: WIDGETS_IDS.launchesQuantity,
    component: () => <div />,
    getUrl: (projectId, interval) =>
      URLS.projectWidget(projectId, WIDGETS_IDS.launchesQuantity, interval),
  },
  {
    title: messages.launchStatistics,
    id: WIDGETS_IDS.launchStatistics,
    source: WIDGETS_IDS.investigated,
    component: () => <div />,
  },
  {
    title: messages.investigated,
    id: WIDGETS_IDS.investigated,
    source: WIDGETS_IDS.investigated,
    component: () => <div />,
    getUrl: (projectId, interval) =>
      URLS.projectWidget(projectId, WIDGETS_IDS.investigated, interval),
  },
  {
    title: messages.issuesChart,
    id: WIDGETS_IDS.issuesChart,
    source: WIDGETS_IDS.issuesChart,
    component: () => <div />,
    getUrl: (projectId, interval) =>
      URLS.projectWidget(projectId, WIDGETS_IDS.issuesChart, interval),
  },
  {
    title: messages.systemIssues,
    id: WIDGETS_IDS.systemIssues,
    source: WIDGETS_IDS.issuesChart,
    component: () => <div />,
  },
  {
    title: messages.autoBugs,
    id: WIDGETS_IDS.autoBugs,
    source: WIDGETS_IDS.issuesChart,
    component: () => <div />,
  },
];

export const activityItem = {
  title: messages.activities,
  id: WIDGETS_IDS.activities,
  source: WIDGETS_IDS.activities,
  component: () => <div />,
  getUrl: (projectId, interval) => URLS.projectWidget(projectId, WIDGETS_IDS.activities, interval),
};
