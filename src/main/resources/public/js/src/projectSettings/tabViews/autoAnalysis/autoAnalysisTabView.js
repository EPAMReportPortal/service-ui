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
    var _ = require('underscore');
    var Epoxy = require('backbone-epoxy');
    var Util = require('util');
    var App = require('app');
    var Service = require('coreService');
    var SingletonAppModel = require('model/SingletonAppModel');
    var DropDownComponent = require('components/DropDownComponent');
    var UserModel = require('model/UserModel');
    var ModalConfirm = require('modals/modalConfirm');
    var config = App.getInstance();
    var appModel = new SingletonAppModel();
    var Localization = require('localization');
    var AutoAnalysisSettingsModel = require('projectSettings/tabViews/autoAnalysis/autoAnalysisSettingsModel');

    var AutoAnalysisTabView = Epoxy.View.extend({
        className: 'auto-analysis-project-settings',
        tpl: 'tpl-project-settings-auto-analysis',

        events: {
            'click #submit-settings': 'submitSettings',
            'change input[type="radio"]': 'onChangeAABase',
            'click [data-js-mode]': 'onChangeMode',
            'change [data-js-mode-param]': 'isMatchPreset',
            'click [data-js-remove-index]': 'onRemoveIndex',
            'click [data-js-generate-index]': 'onGenerateIndex',
            'keypress [data-js-mode-param]': 'allowNumber'
        },
        bindings: {
            '[data-js-is-auto-analize]': 'checked: isAutoAnalyzerEnabled',
            '[data-js-match-input]': 'value: minShouldMatch',
            '[data-js-doc-freq-input]': 'value: minDocFreq',
            '[data-js-term-freq-input]': 'value: minTermFreq',
            '[data-js-numder-str-input]': 'value: numberOfLogLines',
            '[data-js-in-progress]': 'classes: {hide: not(indexing_running)}',
            '[data-js-remove-index]': 'classes: {disabled: indexing_running}',
            '[data-js-generate-index]': 'classes: {disabled: indexing_running}'
        },

        initialize: function () {
            this.userModel = new UserModel();
            this.model = new AutoAnalysisSettingsModel(appModel.get('configuration').analyzerConfiguration);
            this.render();
        },
        render: function () {
            this.$el.html(Util.templates(this.tpl, { access: config.userModel.hasPermissions() }));
            this.logStrNumberSelector = new DropDownComponent({
                data: [
                    { name: 'All', value: '-1' },
                    { name: '2', value: '2' },
                    { name: '3', value: '3' },
                    { name: '4', value: '4' },
                    { name: '5', value: '5' }
                ],
                multiple: false,
                defaultValue: this.model.get('numberOfLogLines') || config.autoAnalysisAccuracy.MODERATE.numberOfLogLines
            });
            $('[data-js-numder-str-input]', this.$el).html(this.logStrNumberSelector.$el);
            this.listenTo(this.logStrNumberSelector, 'change', function (val) {
                this.model.set('numberOfLogLines', val);
                this.isMatchPreset();
            });
            this.setupAnalyzerSetting();
            this.isMatchPreset();
            this.addValidators();
        },
        setupAnalyzerSetting: function () {
            var userRole;
            $('[value="' + (this.model.get('analyzer_mode') || 'LAUNCH_NAME') + '"]', this.$el).attr('checked', 'checked');
            if (this.userModel.get('userRole') !== 'ADMINISTRATOR') {
                userRole = this.userModel.get('projects')[appModel.get('projectId')].projectRole;
                if (userRole !== 'PROJECT_MANAGER') {
                    $('[data-js-is-auto-analize]', this.$el).attr('disabled', 'disabled').parent().addClass('disabled');
                    $('[data-js-aa-base-block] input', this.$el).attr('disabled', 'disabled');
                    $('[data-js-mode-param]', this.$el).attr('disabled', 'disabled');
                    $('[data-js-dropdown]', this.$el).addClass('disabled');
                    $('[data-js-mode]', this.$el).attr('disabled', 'disabled');
                    $('[data-js-remove-index]', this.$el).attr('disabled', 'disabled');
                    $('[data-js-generate-index]', this.$el).attr('disabled', 'disabled');
                }
            }
        },
        isMatchPreset: function () {
            var keys = Object.keys(config.autoAnalysisAccuracy);
            var self = this;
            $('[data-js-mode]', this.$el).removeClass('active');
            keys.forEach(function (key) {
                var preset = config.autoAnalysisAccuracy[key];
                var isPreset = preset.minDocFreq === self.model.get('minDocFreq').toString() &&
                    preset.minShouldMatch === self.model.get('minShouldMatch').toString() &&
                    preset.minTermFreq === self.model.get('minTermFreq').toString() &&
                    preset.numberOfLogLines === self.model.get('numberOfLogLines').toString();
                isPreset && $('[value="' + key + '"]', self.$el).addClass('active');
            });
        },
        addValidators: function () {
            Util.hintValidator($('[data-js-match-input]', this.$el), [{
                validator: 'valueOutOfRange',
                type: 'aa',
                min: 50,
                max: 100
            }]);
            Util.hintValidator($('[data-js-doc-freq-input]', this.$el), [{
                validator: 'valueOutOfRange',
                type: 'aa',
                min: 1,
                max: 10
            }]);
            Util.hintValidator($('[data-js-term-freq-input]', this.$el), [{
                validator: 'valueOutOfRange',
                type: 'aa',
                min: 1,
                max: 10
            }]);
        },
        allowNumber: function (e) {
            var charCode = (e.which) ? e.which : event.keyCode;
            if (charCode > 31 && (charCode < 48 || charCode > 57)) { return false; }
            return true;
        },
        onRemoveIndex: function () {
            var modal;
            modal = new ModalConfirm({
                headerText: Localization.project.removeIndex,
                bodyText: Localization.project.removeIndexConfirm,
                cancelButtonText: Localization.ui.cancel,
                okButtonDanger: true,
                okButtonText: Localization.ui.remove,
                safeRemoval: true,
                confirmFunction: function () {
                    return Service.removeIndex().done(function () {
                        Util.ajaxSuccessMessenger('removeIndex');
                    }).fail(function (err) {
                        Util.ajaxFailMessenger(err);
                    });
                }
            });
            modal.show();
        },
        onGenerateIndex: function () {
            var modal;
            modal = new ModalConfirm({
                headerText: Localization.project.generateIndex,
                bodyText: Localization.project.generateIndexConfirm,
                cancelButtonText: Localization.ui.cancel,
                okButtonText: Localization.ui.generate,
                safeRemoval: true,
                noteText: Localization.project.noteText,
                confirmFunction: function () {
                    return Service.generateIndex().done(function () {
                        $('[data-js-in-progress]', this.$el).toggleClass('hide');
                        $('[data-js-remove-index]', this.$el).addClass('disabled');
                        $('[data-js-generate-index]', this.$el).addClass('disabled');
                        Service.getProject().done(function (res) {
                            appModel.set(res);
                        });
                    }).fail(function (err) {
                        Util.ajaxFailMessenger(err);
                    });
                }
            });
            modal.show();
        },
        onChangeMode: function (e) {
            var mode = $(e.target).attr('value');
            $('[data-js-mode]', this.$el).removeClass('active');
            $('[value="' + mode + '"]', this.$el).addClass('active');
            this.setAccuracySettings(mode);
            this.validate();
        },
        onChangeAABase: function (e) {
            this.model.set('analyzer_mode', e.target.value);
        },
        setAccuracySettings: function (mode) {
            this.model.set('minDocFreq', config.autoAnalysisAccuracy[mode].minDocFreq);
            this.model.set('minShouldMatch', config.autoAnalysisAccuracy[mode].minShouldMatch);
            this.model.set('minTermFreq', config.autoAnalysisAccuracy[mode].minTermFreq);
            this.model.set('numberOfLogLines', config.autoAnalysisAccuracy[mode].numberOfLogLines);
        },
        validate: function () {
            return !($('[data-js-match-input]', this.$el).trigger('validate').data('validate-error') ||
                $('[data-js-doc-freq-input]', this.$el).trigger('validate').data('validate-error') ||
                $('[data-js-term-freq-input]', this.$el).trigger('validate').data('validate-error'));
        },
        submitSettings: function () {
            var generalSettings;
            if (!this.validate()) return;
            generalSettings = this.model.getAutoAnalysisSettings();
            config.trackingDispatcher.trackEventNumber(385);
            if (!generalSettings.configuration.analyzerConfiguration.isAutoAnalyzerEnabled) {
                generalSettings.configuration.analyzerConfiguration.analyzer_mode = 'LAUNCH_NAME';
                $('[value="LAUNCH_NAME"]', this.$el).attr('checked', 'checked');
            }
            Service.updateProject(generalSettings)
                .done(function () {
                    var newConfig = appModel.get('configuration');
                    _.merge(newConfig, generalSettings.configuration);
                    appModel.set({ configuration: newConfig });
                    Util.ajaxSuccessMessenger('updateProjectSettings');
                })
                .fail(function (error) {
                    Util.ajaxFailMessenger(error, 'updateProjectSettings');
                });
        }
    });

    return AutoAnalysisTabView;
});
