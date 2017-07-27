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

define(function (require, exports, module) {
    'use strict';

    var ModalView = require('modals/_modalView');
    var Util = require('util');
    var $ = require('jquery');
    var _ = require('underscore');
    var WidgetService = require('newWidgets/WidgetService');
    var WidgetSettingsView = require('modals/addWidget/WidgetSettingsView');
    var SaveWidgetView = require('modals/addWidget/SaveWidgetView');
    var SelectedFilterView = require('modals/addWidget/SelectedFilterView');
    var PreviewWidgetView = require('newWidgets/PreviewWidgetView');
    var FilterSearchView = require('modals/addWidget/FilterSearchView');
    var Service = require('coreService');
    var App = require('app');

    var config = App.getInstance();


    var ModalEditWidget = ModalView.extend({
        template: 'tpl-modal-edit-widget',
        className: 'modal-edit-widget',

        events: {
            'click [data-js-save]': 'onClickSaveWidget',
            'click [data-js-cancel-filter]': 'onClickCancelFilterEdit',
            'click [data-js-save-filter]': 'onClickSaveFilterEdit',
            'click [data-js-close]': 'onClickClose',
            'click [data-js-cancel]': 'onClickCancel',
            'change [data-js-filter-list]': 'disableHideBackdrop',
            'change [data-js-filter-add-container]': 'disableHideBackdrop',
            'change [data-js-filter-info]': 'disableHideBackdrop',
            'change [data-js-widget-settings]': 'disableHideBackdrop',
            'change [data-js-widget-save]': 'disableHideBackdrop'
        },
        bindings: {
            '[data-js-widget-type]': 'text: gadgetName',
            '[data-js-widget-description]': 'html: gadgetDescription'
        },

        initialize: function (options) {
            var self;
            if (!options.model) {
                // console.log('Model is not found');
                return false;
            }
            this.originalModel = options.model;
            this.model = this.originalModel.clone();
            this.curWidget = WidgetService.getWidgetConfig(this.model.get('gadget'));
            this.render();
            this.widgetSettingsView = new WidgetSettingsView({ model: this.model });
            $('[data-js-widget-settings]', this.$el).html(this.widgetSettingsView.$el);
            this.saveWidget = new SaveWidgetView({
                model: this.model, dashboardModel: this.dashboardModel
            });
            $('[data-js-widget-save]', this.$el).html(this.saveWidget.$el);
            this.listenTo(this.model, 'change', _.debounce(this.onChangeModel, 10));
            this.filterReadyAsync = $.Deferred();
            self = this;
            if (this.model.get('filter_id')) {
                this.selectedFilterView = new SelectedFilterView({ model: this.model });
                $('[data-js-widget-filter]', this.$el).html(this.selectedFilterView.$el);
                this.listenTo(this.selectedFilterView, 'edit', this.onEditFilter);
                this.selectedFilterView.getAsync().done(function () {
                    self.filterReadyAsync.resolve();
                });
            } else {
                this.filterReadyAsync.resolve();
            }
        },
        onChangeModel: function (model) {
            this.curWidget = WidgetService.getWidgetConfig(model.get('gadget'));
            // console.dir(model.changed);
        },
        onChangePreview: function () {
            var filterModel = null;
            this.previewWidgetView && this.previewWidgetView.destroy();
            if (this.model.get('gadgetIsFilter')) {
                filterModel = this.selectedFilterView.getSelectedFilterModel();
                if (this.filterSelectView) {
                    filterModel = this.filterSelectView.getSelectedFilterModel();
                }
            }
            this.previewWidgetView = new PreviewWidgetView({
                model: this.model, filterModel: filterModel
            });
            $('[data-js-widget-preview]', this.$el).html(this.previewWidgetView.$el);
        },
        onEditFilter: function (filterModel) {
            config.trackingDispatcher.trackEventNumber(321);
            this.$el.addClass('filter-edit-state');
            this.destroyFilterSelect();
            this.filterSelectView = new FilterSearchView({
                model: this.model,
                modalType: 'edit'
            });
            this.listenTo(this.filterSelectView, 'disable:navigation', this.onChangefilterSelectState);
            $('[data-js-filter-search]', this.$el).html(this.filterSelectView.$el);
            this.filterSelectView.setFilterModel(filterModel);
            this.filterSelectView.activate();
        },
        destroyFilterSelect: function () {
            if (this.filterSelectView) {
                this.stopListening(this.filterSelectView);
                this.filterSelectView.destroy();
            }
        },
        closeFilterEdit: function () {
            this.$el.removeClass('filter-edit-state');
        },
        onShown: function () {
            var self = this;
            this.filterReadyAsync.done(function () {
                self.listenTo(self.model, 'change:gadget change:widgetOptions change:content_fields change:filter_id change:itemsCount', _.debounce(self.onChangePreview, 10));
                self.onChangePreview();
            });
        },
        onShow: function () {
            this.widgetSettingsView.activate();
        },
        onClickClose: function () {
            config.trackingDispatcher.trackEventNumber(320);
        },
        onClickCancel: function () {
            config.trackingDispatcher.trackEventNumber(325);
        },
        render: function () {
            this.$el.html(Util.templates(this.template, {}));
        },
        onClickCancelFilterEdit: function () {
            config.trackingDispatcher.trackEventNumber(330);
            this.model.set({ filter_id: this.selectedFilterView.getFilterModel().get('id') });
            this.destroyFilterSelect();
            this.closeFilterEdit();
            this.enableHideBackdrop();
            this.hideWarningBlock();
        },
        onClickSaveFilterEdit: function () {
            if (this.filterSelectView && this.filterSelectView.getSelectedFilterModel()) {
                config.trackingDispatcher.trackEventNumber(331);
                this.selectedFilterView.setFilterModel(this.filterSelectView.getSelectedFilterModel());
            }
            this.destroyFilterSelect();
            this.closeFilterEdit();
        },
        onChangefilterSelectState: function (state) {
            if (state) {
                this.$el.addClass('select-filter-edit-state');
            } else {
                this.$el.removeClass('select-filter-edit-state');
            }
        },
        onKeySuccess: function () {
            $('[data-js-save]', this.$el).focus().trigger('click');
        },
        onClickSaveWidget: function () {
            if (this.saveWidget.validate() && this.widgetSettingsView.validate()) {
                config.trackingDispatcher.trackEventNumber(326);
                this.$el.addClass('load');
                var self = this;
                var contentParameters = {};
                if (!_.contains(['unique_bug_table', 'activity_stream', 'launches_table'], this.model.get('gadget'))) {
                    contentParameters.metadata_fields = ['name', 'number', 'start_time'];
                }
                if (this.model.get('gadget') === 'most_failed_test_cases') {
                    contentParameters.metadata_fields = ['name', 'start_time'];
                }
                contentParameters.type = this.curWidget.widget_type;
                contentParameters.gadget = this.model.get('gadget');
                contentParameters.itemsCount = this.model.get('itemsCount');
                if (this.model.getContentFields().length) {
                    contentParameters.content_fields = this.model.getContentFields();
                }
                contentParameters.widgetOptions = this.model.getWidgetOptions();
                var data = {
                    name: this.model.get('name'),
                    share: this.model.get('share'),
                    content_parameters: contentParameters
                };
                if (this.model.get('filter_id')) {
                    data.filter_id = this.model.get('filter_id');
                }
                if (this.model.get('description')) {
                    data.description = this.model.get('description');
                }
                this.showLoading();
                Service.updateWidget(data, this.model.get('id'))
                    .done(function (response) {
                        self.originalModel.set(self.model.toJSON());
                        self.successClose(response.id);
                        Util.ajaxSuccessMessenger('widgetSave');
                    })
                    .fail(function (error) {
                        Util.ajaxFailMessenger(null, 'widgetSave');
                        self.hideLoading();
                    });
            }
        },
        onDestroy: function () {
            this.filterSelectView && this.filterSelectView.destroy();
            this.selectedFilterView && this.selectedFilterView.destroy();
            this.widgetSettingsView && this.widgetSettingsView.destroy();
            this.saveWidget && this.saveWidget.destroy();
        }

    });

    return ModalEditWidget;
});
