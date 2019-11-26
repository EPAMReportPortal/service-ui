/*
 * Copyright 2016 EPAM Systems
 *
 *
 * This file is part of EPAM Report Portal.
 * https://github.com/reportportal/service-ui
 *
 * Report Portal is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Report Portal is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Report Portal.  If not, see <http://www.gnu.org/licenses/>.
 */

define([
    'jquery',
    'dataUrlResolver',
    'callService'
], function ($, urls, callService) {
    'use strict';

    var call = callService.call;

    var getApiToken = function () {
        return call('GET', urls.getApiToken());
    };
    var generateApiToken = function () {
        return call('POST', urls.getApiToken());
    };

    var userLogout = function () {
        return call('DELETE', urls.userLogout());
    };
    var userLogin = function (data) {
        data['username'] = decodeURIComponent(data.username);
        data['password'] = decodeURIComponent(data.password);
        return call('POST', urls.userLogin(), data, true, false, 'application/x-www-form-urlencoded; charset=UTF-8');
    };


    var getRegistryInfo = function () {
        return call('GET', urls.getRegistryInfo());
    };

    var getPreferences = function () {
        return call('GET', urls.getPreferences());
    };

    var putPreferences = function (data) {
        return call('PUT', urls.getPreferences(), data);
    };

    var getProfileImage = function (url) {
        return call('GET', url);
    };

    var getProject = function () {
        return call('GET', urls.getProject());
    };

    var getProjectUsersById = function (query) {
        return call('GET', urls.autocompleteUserUrl(query));
    };

    var getUserByEmail = function (query) {
        return call('GET', urls.userByEmail(query));
    };

    var getProjectDashboard = function (id) {
        return call('GET', urls.dashboardById(id));
    };

    var getProjectDashboards = function () {
        return call('GET', urls.dashboard());
    };

    var createDashboard = function (data) {
        return call('POST', urls.dashboard(), data);
    };

    var deleteDashboard = function (id, isShared) {
        // var url = isShared ? urls.favoritesByResourceId(id) : urls.dashboardById(id);
        var url = urls.dashboardById(id);
        return call('DELETE', url);
    };

    var deleteDeletedByOwnerDashboard = function (id) {
        return call('DELETE', urls.favoritesByResourceId(id));
    };

    var updateDashboard = function (id, data) {
        return call('PUT', urls.dashboardById(id), data);
    };

    var getSharedDashboards = function () {
        return call('GET', urls.dashboardShared());
    };

    var addOwnDashboard = function (data) {
        return call('POST', urls.dashboard(), data);
    };

    var addSharedDashboard = function (id) {
        return call('POST', urls.favorites(), { resource_id: id, resource_type: 'DASHBOARD' });
    };

    var saveWidget = function (data) {
        return call('POST', urls.widget(), data);
    };
    var saveEmptyWidget = function (data) {
        return call('POST', urls.emptyWidget(), data);
    };

    var updateWidget = function (data, id) {
        return call('PUT', urls.widgetById(id), data);
    };

    var addWidgetToDashboard = function (data, id) {
        return call('PUT', urls.dashboardById(id), { addWidget: data });
    };

    var updateWidgetsOnDashboard = function (data, id) {
        return call('PUT', urls.dashboardById(id), { updateWidgets: data });
    };

    var getBtsTicket = function (ticketId, systemId) {
        return call('GET', urls.getBtsTicket(ticketId, systemId));
    };

    var updateDefect = function (data) {
        return call('PUT', urls.itemBase(), data);
    };

    var getCompare = function (id) {
        return call('GET', urls.compareByIds(id));
    };


    var getSharedWidgets = function (data) {
        return call('GET', urls.widgetsShared(data));
    };
    var sharedWidgetSearch = function (data) {
        return call('GET', urls.sharedWidgetSearch(data));
    };

    var getSharedWidgetData = function (id) {
        return call('GET', urls.widgetById(id));
    };
    var saveFilter = function (query) {
        return call('GET', urls.saveFilter(query));
    };
    var getOwnFilters = function () {
        return call('GET', urls.ownFilters());
    };
    var getFilterNames = function () {
        return call('GET', urls.filterNames());
    };
    var getSharedFilters = function () {
        return call('GET', urls.sharedFilters());
    };

    var getFilterData = function (ids) {
        return call('GET', urls.getFilters(ids));
    };

    var getWidgetNames = function () {
        return call('GET', urls.widgetNames());
    };

    var getWidgetData = function (type, params) {
        return call('GET', urls.getProjectBase() + '/' + type + '?' + params);
    };
    var getWidgetPreviewData = function (data) {
        return call('POST', urls.widgetPreview(), data);
    };
    var loadWidget = function (url) {
        return call('GET', url);
    };
    var loadDashboardWidget = function (widgetId) {
        return call('GET', urls.getProjectBase() + '/widget/' + widgetId);
    };

    var updateDefaultProject = function (project) {
        return call('PUT', urls.userUrl(), { default_project: project }, null, true);
    };

    var getUserInfo = function (login) {
        return call('GET', urls.addMemberUrl() + '/' + login);
    };

    var getCurrentUser = function () {
        return call('GET', urls.addMemberUrl());
    };

    var getUserAssignedProjects = function (login) {
        return call('GET', urls.addMemberUrl() + '/' + login + '/projects');
    };

    var updateProject = function (data) {
        return call('PUT', urls.updateProject(), data);
    };

    var generateIndex = function () {
        return call('PUT', urls.indexAction());
    };

    var removeIndex = function () {
        return call('DELETE', urls.indexAction());
    };

    var updateEmailProjectSettings = function (data) {
        return call('PUT', urls.updateEmailProjectSettings(), data);
    };

    var createExternalSystem = function (data) {
        delete data.id;
        return call('POST', urls.createExternalSystem(), data);
    };

    var updateExternalSystem = function (data) {
        var id = data.id;
        delete data.id;
        return call('PUT', urls.updateExternalSystem(id), data);
    };

    var deleteExternalSystem = function (id) {
        return call('DELETE', urls.updateExternalSystem(id));
    };

    var clearExternalSystem = function () {
        return call('DELETE', urls.clearExternalSystem());
    };

    var getBtsFields = function (id, type) {
        return call('GET', urls.btsFields(id, type));
    };
    var getBtsTypes = function (id) {
        return call('GET', urls.btsTypes(id));
    };

    var postBugToBts = function (data, id) {
        return call('POST', urls.postBug(id), data);
    };

    var loadBugs = function (data) {
        return call('PUT', urls.loadBugs(), data);
    };

    var updateLaunch = function (data, id) {
        return call('PUT', urls.updateLaunchUrl(id), data);
    };

    var updateTestItem = function (data, id) {
        return call('PUT', urls.updateTestItemUrl(id), data);
    };

    var startLaunchAnalyze = function (id, mode, itemsMode) {
        return call('POST', urls.launchAnalyzeUrl(), {
            analyze_items_mode: itemsMode,
            analyzer_mode: mode,
            launch_id: id
        }, null, true);
    };

    var mergeLaunches = function (data) {
        return call('POST', urls.getMerge(), data);
    };

    var finishLaunch = function (id) {
        return call('PUT', urls.launchFinishUrl(id), { end_time: new Date().getTime() });
    };

    var removeTicket = function (data) {
        return call('PUT', urls.itemBase(), data);
    };

    var searchTags = function (query, type, mode) {
        type = type || 'queryByTags';
        return call('GET', urls[type](query.term, mode));
    };

    var getHistoryData = function (ids, depth) {
        return call('GET', urls.historyGrid(ids, depth));
    };

    var getDefectItem = function (id) {
        return call('GET', urls.itemByKey(id));
    };

    var loadHistory = function (id) {
        return call('GET', urls.loadHistory(id));
    };

    var loadActivityItems = function (id) {
        return call('GET', urls.loadActivityItems(id));
    };

    var checkForStatusUpdate = function (data) {
        return call('GET', urls.checkStatusUpdate(data));
    };

    var initializePassChange = function (email) {
        return call('POST', urls.initPassChange(), { email: email });
    };

    var submitPassReset = function (pass, uuid) {
        return call('POST', urls.submitPassReset(), { password: pass, uuid: uuid });
    };

    var submitPassChange = function (data) {
        return call('POST', urls.submitPassChange(), data);
    };

    var validateRestorationKey = function (key) {
        return call('GET', urls.submitPassReset(key));
    };

    var submitProfileInfo = function (data) {
        return call('PUT', urls.userUrl(), data);
    };

    var deletePhoto = function () {
        return call('DELETE', urls.uploadPhoto());
    };

    var generateUUID = function () {
        return call('PUT', urls.generateUUID());
    };

    var externalForceUpdate = function (accountType) {
        return call('POST', urls.updateExternalProfile(accountType));
    };

    var searchLaunches = function (query) {
        return call('GET', urls.queryByLaunchName(query.term));
    };

    var getTestItemInfo = function (id) {
        return call('GET', urls.itemByKey(id));
    };

    var getTestItemsInfo = function (ids) {
        return call('GET', urls.itemsByKeys(ids));
    };

    var getLaunchItem = function (type, id) {
        return call('GET', urls.getLaunchItemUrl(type, id));
    };

    var deleteLaunch = function (id) {
        return call('DELETE', urls.deleteLaunchUrl(id), null, null, true);
    };

    var deleteTestItem = function (id) {
        return call('DELETE', urls.deleteTestItemUrl(id), null, null, true);
    };

    var getDefectTypes = function (projectId) {
        return call('GET', urls.getDefectTypes(projectId));
    };

    var postDefectTypes = function (projectId, data) {
        return call('POST', urls.postDefectTypes(projectId), data);
    };

    var putDefectType = function (projectId, data) {
        return call('PUT', urls.postDefectTypes(projectId), data);
    };

    var deleteDefectType = function (projectId, id) {
        return call('DELETE', urls.postDefectTypes(projectId) + id);
    };
    var generateDemoData = function (data) {
        return call('POST', urls.postDemoDataUrl(), data);
    };
    var toggleAnalytics = function (data) {
        return call('PUT', urls.toggleAnalytics(), data);
    };
    var getProjectEvents = function (query) {
        return call('GET', urls.getProjectEvents(query));
    };


    return {
        getApiToken: getApiToken,
        generateApiToken: generateApiToken,

        userLogout: userLogout,
        userLogin: userLogin,

        getRegistryInfo: getRegistryInfo,

        getPreferences: getPreferences,
        putPreferences: putPreferences,
        getProfileImage: getProfileImage,
        getProject: getProject,
        getProjectUsersById: getProjectUsersById,
        getProjectDashboard: getProjectDashboard,
        getProjectDashboards: getProjectDashboards,
        getSharedWidgets: getSharedWidgets,
        getSharedWidgetData: getSharedWidgetData,
        getOwnFilters: getOwnFilters,
        getSharedFilters: getSharedFilters,
        getFilterNames: getFilterNames,
        getFilterData: getFilterData,
        createDashboard: createDashboard,
        deleteDashboard: deleteDashboard,
        deleteDeletedByOwnerDashboard: deleteDeletedByOwnerDashboard,
        updateDashboard: updateDashboard,
        getSharedDashboards: getSharedDashboards,
        addOwnDashboard: addOwnDashboard,
        addSharedDashboard: addSharedDashboard,
        getBtsTicket: getBtsTicket,
        updateDefect: updateDefect,
        getCompare: getCompare,
        updateLaunch: updateLaunch,
        updateTestItem: updateTestItem,
        startLaunchAnalyze: startLaunchAnalyze,
        mergeLaunches: mergeLaunches,
        finishLaunch: finishLaunch,
        removeTicket: removeTicket,
        searchTags: searchTags,
        searchLaunches: searchLaunches,
        getHistoryData: getHistoryData,
        getDefectItem: getDefectItem,
        loadHistory: loadHistory,
        loadActivityItems: loadActivityItems,

        saveFilter: saveFilter,

        saveWidget: saveWidget,
        saveEmptyWidget: saveEmptyWidget,
        updateWidget: updateWidget,
        addWidgetToDashboard: addWidgetToDashboard,
        updateWidgetsOnDashboard: updateWidgetsOnDashboard,
        getWidgetNames: getWidgetNames,
        getWidgetData: getWidgetData,
        getWidgetPreviewData: getWidgetPreviewData,
        loadWidget: loadWidget,
        getTestItemInfo: getTestItemInfo,
        getTestItemsInfo: getTestItemsInfo,
        getLaunchItem: getLaunchItem,
        loadDashboardWidget: loadDashboardWidget,

        updateProject: updateProject,
        updateEmailProjectSettings: updateEmailProjectSettings,
        generateIndex: generateIndex,
        removeIndex: removeIndex,
        updateDefaultProject: updateDefaultProject,
        getUserInfo: getUserInfo,
        getCurrentUser: getCurrentUser,
        getUserAssignedProjects: getUserAssignedProjects,
        createExternalSystem: createExternalSystem,
        updateExternalSystem: updateExternalSystem,
        deleteExternalSystem: deleteExternalSystem,
        clearExternalSystem: clearExternalSystem,
        getBtsFields: getBtsFields,
        postBugToBts: postBugToBts,
        loadBugs: loadBugs,
        getBtsTypes: getBtsTypes,

        checkForStatusUpdate: checkForStatusUpdate,

        initializePassChange: initializePassChange,
        submitPassReset: submitPassReset,
        submitProfileInfo: submitProfileInfo,
        submitPassChange: submitPassChange,
        validateRestorationKey: validateRestorationKey,

        deletePhoto: deletePhoto,
        generateUUID: generateUUID,
        externalForceUpdate: externalForceUpdate,

        deleteLaunch: deleteLaunch,
        deleteTestItem: deleteTestItem,

        getDefectTypes: getDefectTypes,
        postDefectTypes: postDefectTypes,
        putDefectType: putDefectType,
        deleteDefectType: deleteDefectType,

        getUserByEmail: getUserByEmail,
        generateDemoData: generateDemoData,

        toggleAnalytics: toggleAnalytics,
        getProjectEvents: getProjectEvents,
        sharedWidgetSearch: sharedWidgetSearch
    };
});
