/*
 * Copyright 2016 EPAM Systems
 *
 *
 * This file is part of EPAM Report Portal.
 * https://github.com/epam/ReportPortal
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
define(function (require) {
    'use strict';

    var $ = require('jquery');
    var Epoxy = require('backbone-epoxy');
    var Backbone = require('backbone');
    var Util = require('util');

    var StepLogDefectTypeView = require('launches/common/StepLogDefectTypeView');
    var LaunchSuiteStepItemModel = require('launches/common/LaunchSuiteStepItemModel');
    var LogItemInfoRetryItemView = require('launches/logLevel/LogItemInfoRetryItemView');

    var LogItemInfoTabs = require('launches/logLevel/LogItemInfoTabs/LogItemInfoTabs');
    var App = require('app');
    var PostBugAction = require('launches/multipleActions/postBugAction');
    var LoadBugAction = require('launches/multipleActions/loadBugAction');
    var SingletonAppModel = require('model/SingletonAppModel');
    var Localization = require('localization');
    var CallService = require('callService');
    var Urls = require('dataUrlResolver');
    var call = CallService.call;
    var _ = require('underscore');

    var config = App.getInstance();

    var RetiesCollection = Backbone.Collection.extend({
        model: LaunchSuiteStepItemModel
    });

    var LogItemInfoView = Epoxy.View.extend({
        template: 'tpl-launch-log-item-info',

        events: {
            'click [data-js-post-bug]': 'onClickPostBug',
            'click [data-js-load-bug]': 'onClickLoadBug'
        },

        bindings: {
            '[data-js-post-bug]': 'classes: {disabled: validatePostBug}, attr: {title: postBugTitle}',
            '[data-js-load-bug]': 'classes: {disabled: validateLoadBug}, attr: {title: loadBugTitle}'
        },

        computeds: {
            validateLoadBug: {
                deps: ['launch_isProcessing'],
                get: function () {
                    return this.viewModel.validate.loadbug();
                }
            },
            validatePostBug: {
                deps: ['launch_isProcessing'],
                get: function () {
                    return this.viewModel.validate.postbug();
                }
            },
            postBugTitle: {
                deps: ['issue', 'validatePostBug'],
                get: function (issue, validatePostBug) {
                    if (validatePostBug) {
                        return validatePostBug;
                    }
                    return Localization.launches.postBug;
                }
            },
            loadBugTitle: {
                deps: ['issue', 'validateLoadBug'],
                get: function (issue, validateLoadBug) {
                    if (validateLoadBug) {
                        return validateLoadBug;
                    }
                    return Localization.launches.loadBug;
                }
            }
        },

        initialize: function (options) {
            this.context = options.context;
            this.appModel = new SingletonAppModel();
            this.viewModel = options.itemModel;
            this.launchModel = options.launchModel;
            this.collectionItems = options.collectionItems;
            this.listenTo(this.launchModel, 'change:isProcessing', this.onChangeLaunchProcessing);
            this.listenTo(this.viewModel, 'change:issue', this.onChangeIssue);
            this.onChangeLaunchProcessing();
            this.render();
            if (this.validateForIssue()) {
                this.issueView = new StepLogDefectTypeView({
                    model: this.viewModel,
                    pageType: 'logs',
                    el: $('[data-js-step-issue]', this.$el)
                });
            }
            this.renderedRetries = [];
            this.renderRetries();
        },
        getCurrentRetry: function () {
            var curOptions = this.collectionItems.getInfoLog();
            if (curOptions.retry) {
                var retryData;
                _.each(this.viewModel.get('retries'), function (retry) {
                    if (retry.id === curOptions.retry) {
                        retryData = retry;
                    }
                });
                if (retryData) {
                    return (new LaunchSuiteStepItemModel(retryData));
                }
                return this.viewModel;
            }
            return this.viewModel;
        },
        renderTabs: function (model) {
            if (this.tabsView) {
                this.stopListening(this.tabsView);
                this.tabsView.destroy();
            }
            this.tabsView = new LogItemInfoTabs({
                itemModel: model,
                launchModel: this.launchModel
            });
            $('[data-js-tabs-container]', this.$el).html(this.tabsView.$el);
            this.listenTo(this.tabsView, 'goToLog', this.goToLog);
            this.listenTo(this.tabsView, 'click:attachment', this.onClickAttachment);
        },
        renderRetries: function () {
            var self = this;
            var retries = [];
            if (this.viewModel.get('retries') && this.viewModel.get('retries').length) {
                var activeRetry = this.getCurrentRetry().id;
                $('[data-js-retries-container]', self.$el).removeClass('hide');
                retries = _.clone(this.viewModel.get('retries')).reverse();
                retries.push(this.viewModel.toJSON());
                _.each(retries, function (item, num) {
                    item.number = num + 1;
                    if (item.id === activeRetry) {
                        item.select = true;
                    }
                });
                this.retriesCollection = new RetiesCollection(retries);
                _.each(this.retriesCollection.models, function (modelRetry) {
                    var view = new LogItemInfoRetryItemView({
                        model: modelRetry
                    });
                    $('[data-js-retries-container]', self.$el).append(view.$el);
                    self.renderedRetries.push(view);
                });
                this.listenTo(this.retriesCollection, 'select:item', this.activateRetry);
            }
            this.renderTabs(this.getCurrentRetry());
        },
        activateRetry: function (retryModel) {
            if (!retryModel.get('select')) {
                _.each(this.retriesCollection.models, function (retry) {
                    retry.set({ select: false });
                });
                retryModel.set({ select: true });
                this.renderTabs(retryModel);
                this.trigger('change:retry', retryModel);
            }
        },
        onClickAttachment: function (model) {
            this.trigger('click:attachment', model);
        },
        goToLog: function (logId) {
            this.trigger('goToLog', logId);
        },
        endGoToLog: function () {
            this.tabsView.endGoToLog();
        },
        onChangeIssue: function () {
            this.trigger('change:issue');
        },
        onChangeLaunchProcessing: function () {
            this.viewModel.set({ parent_launch_isProcessing: this.launchModel.get('isProcessing') });
        },
        validateForIssue: function () {
            return !!this.viewModel.get('issue');
        },
        onClickPostBug: function () {
            config.trackingDispatcher.trackEventNumber(193);
            PostBugAction({ items: [this.viewModel], from: 'logs' });
        },
        onClickLoadBug: function () {
            config.trackingDispatcher.trackEventNumber(194);
            LoadBugAction({ items: [this.viewModel], from: 'logs' });
        },
        render: function () {
            this.$el.html(Util.templates(this.template, {
                context: this.context
            }));
        },

        onDestroy: function () {
            this.issueView && this.issueView.destroy();
            this.$el.html('');
        }
    });

    return LogItemInfoView;
});
