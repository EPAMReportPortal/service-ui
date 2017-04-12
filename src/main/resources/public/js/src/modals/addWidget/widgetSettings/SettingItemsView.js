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

    var Util = require('util');
    var $ = require('jquery');
    var SettingView = require('modals/addWidget/widgetSettings/_settingView');
    var WidgetService = require('newWidgets/WidgetService');
    var Localization = require('localization');
    var App = require('app');

    var config = App.getInstance();

    var SettingItemsView = SettingView.extend({
        className: 'modal-add-widget-setting-items',
        template: 'modal-add-widget-setting-items',
        events: {
        },
        bindings: {
            '[data-js-limit-input]': 'value: itemsCount'
        },
        initialize: function () {
            this.curWidget = WidgetService.getWidgetConfig(this.model.get('gadget'));
            if (!this.curWidget.limit || !this.curWidget.limit.display) {
                this.destroy();
                return false;
            }
            this.render();
            Util.hintValidator($('[data-js-limit-input]', this.$el), [{
                validator: 'minMaxNumberRequired',
                type: 'itemsSize',
                min: this.curWidget.limit.min,
                max: this.curWidget.limit.max
            }]);
            this.listenTo(this.model, 'change:itemsCount', this.onChangeItemsCont);
        },
        render: function () {
            this.$el.html(Util.templates(this.template, {
                name: this.curWidget.limit.name || Localization.widgets.items
            }));
        },
        onChangeItemsCont: function () {
            if (this.validate()) {
                config.trackingDispatcher.trackEventNumber(299);
            }
        },
        validate: function () {
            return !$('[data-js-limit-input]', this.$el).trigger('validate').data('validate-error');
        }
    });

    return SettingItemsView;
});
