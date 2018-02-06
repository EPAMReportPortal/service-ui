import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { AuthorizedArea } from 'controllers/authorizedArea';

import EmptyLayout from 'layouts/emptyLayout/emptyLayout';
import AppLayout from 'layouts/appLayout/appLayout';
import AdminLayout from 'layouts/adminLayout/adminLayout';

import ProfilePage from 'pages/inside/profilePage/profilePage';
import ApiPage from 'pages/inside/apiPage/apiPage';
import DashboardPage from 'pages/inside/dashboardPage/dashboardPage';
import LaunchesPage from 'pages/inside/launchesPage/launchesPage';
import FiltersPage from 'pages/inside/filtersPage/filtersPage';
import DebugPage from 'pages/inside/debugPage/debugPage';
import MembersPage from 'pages/inside/membersPage/membersPage';
import SettingsPage from 'pages/inside/settingsPage/settingsPage';

import { LoginPage } from 'pages/outside/loginPage';

const LoginRoute = () => (
  <EmptyLayout>
    <LoginPage />
  </EmptyLayout>
);
const AppRoute = () => (
  <AppLayout>
    <Switch>
      <Route path="/user-profile" component={ProfilePage} />
      <Route path="/api" component={ApiPage} />
      <Route exact path="/:projectId" component={DashboardPage} />
      <Route path="/:projectId/dashboard" component={DashboardPage} />
      <Route path="/:projectId/launches" component={LaunchesPage} />
      <Route path="/:projectId/filters" component={FiltersPage} />
      <Route path="/:projectId/userdebug" component={DebugPage} />
      <Route path="/:projectId/members" component={MembersPage} />
      <Route path="/:projectId/settings" component={SettingsPage} />
    </Switch>
  </AppLayout>
);
const AdminRoute = () => (
  <AdminLayout>
    <h1>Admin</h1>
    <Link to="/default_project/dashboard">Back</Link>
  </AdminLayout>
);

const RootRoute = () => (
  <Switch>
    <Route exact path="/" component={LoginRoute} />
    <Route path="/login" component={LoginRoute} />
    <AuthorizedArea>
      <Route path="/administrate" component={AdminRoute} />
      <AppRoute />
    </AuthorizedArea>
  </Switch>
);

export default RootRoute;
