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

    var Util = require('util');
    var $ = require('jquery');
    var _ = require('underscore');
    var SettingView = require('modals/addWidget/widgetSettings/_settingView');
    var Epoxy = require('backbone-epoxy');

    var actionTypes = {
        switch_chart_mode: {
            setValue: function (value, model) {
                var widgetOptions = model.getWidgetOptions();
                if (value === 'chart') {
                    widgetOptions.chartMode = [];
                } else {
                    delete widgetOptions.chartMode;
                }
                model.setWidgetOptions(widgetOptions);
            },
            getValue: function (model, self) {
                var chartMode = !!(model.getWidgetOptions().chartMode);
                var curNum = 0; // number of item in widgetService -> widget -> uiControl -> options -> items.
                var items = self.model.get('items');
                if (items.length > 1 && items[0].value === 'chart' && chartMode) {
                    curNum = 1;
                }
                return curNum;
            }
        },
        switch_view_mode: {
            setValue: function (value, model) {
                var widgetOptions = model.getWidgetOptions();
                widgetOptions.viewMode = [value];
                model.setWidgetOptions(widgetOptions);
            },
            getValue: function (model, self) {
                var viewMode = model.getWidgetOptions().viewMode;
                var curNum = 0; // number of item in widgetService -> widget -> uiControl -> options -> items.
                if (viewMode) {
                    _.each(self.model.get('items'), function (item, number) {
                        if (item.value === viewMode[0]) {
                            curNum = number;
                            return false;
                        }
                    });
                }
                return curNum;
            }
        },
        switch_timeline_mode: {
            setValue: function (value, model) {
                var widgetOptions = model.getWidgetOptions();
                if (value === 'timeline') {
                    widgetOptions.timeline = ['DAY'];
                } else {
                    delete widgetOptions.timeline;
                }
                model.setWidgetOptions(widgetOptions);
            },
            getValue: function (model, self) {
                var timelineMode = !!(model.getWidgetOptions().timeline);
                var curNum = 0; // number of item in widgetService -> widget -> uiControl -> options -> items.
                var items = self.model.get('items');
                if (items.length > 1 && items[0].value === 'timeline' && timelineMode) {
                    curNum = 1;
                }
                return curNum;
            }
        }
    };

    var SettingSwitcherView = SettingView.extend({
        className: 'modal-add-widget-setting-switcher',
        template: 'modal-add-widget-setting-switcher',
        events: {
            'click [data-js-switch-item]': 'onClickItem'
        },
        bindings: {
        },
        initialize: function (data) {
            var options = _.extend({
                items: [],
                value: 0
            }, data.options);
            this.model = new Epoxy.Model(options);
            this.gadgetModel = data.gadgetModel;
            this.render();
            if (options.action && actionTypes[options.action]) {
                this.setValue = actionTypes[options.action].setValue;
                this.getValue = actionTypes[options.action].getValue;
            }
            options.setValue && (this.setValue = options.setValue);
            options.getValue && (this.getValue = options.getValue);
        },
        render: function () {
            this.$el.html(Util.templates(this.template, this.model.get('items')));
        },
        activate: function () {
            this.model.set({ value: this.getValue(this.gadgetModel, this) });
            this.listenTo(this.model, 'change:value', this.onChangeValue);
            this.onChangeValue();
        },
        onChangeValue: function () {
            $('[data-js-switch-item]', this.$el).removeClass('active').eq(this.model.get('value')).addClass('active');
            this.setValue(this.model.get('items')[this.model.get('value')].value, this.gadgetModel, this);
        },
        onClickItem: function (e) {
            var curNum = $(e.currentTarget).data('num');
            this.model.set({ value: curNum });
        },
        validate: function () {
            return true;
        },
        onDestroy: function () {
        }
    });

    return SettingSwitcherView;
});
