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
    "use strict";
    var $ = require('jquery');
    var Backbone = require('backbone');
    var Util = require('util');
    var Storage = require('storageService');
    var SingletonUserStorage = require('storage/SingletonUserStorage');
    var App = require('app');

    var config = App.getInstance();

    var SideBar = Backbone.View.extend({
        el: "#pageSidebar",

        events: {
            'click .main-menu a': 'closeMenu',
            'click .user-menu a': 'closeMenu',
            'click [data-js-sidebar-close]': 'closeMenu',
            'click [data-js-administrate-page-link]': 'setLastActivePage',
            'click [data-js-logout]': 'onClickLogout',
        },

        initialize: function (options) {
            this.tpl = options.tpl;
            this.lastURL = options.lastURL;
            this.projectUrl = options.projectUrl;
            this.currentPage = options.currentPage;
            this.canDebug = Util.isAdmin() || !Util.isCustomer();
            this.currentHash = "#" + Backbone.history.getFragment().split('?')[0].split('/', 2).join('/');
            this.listenTo(config.router, "route", this.updateActiveLink);

            this.userStorage = new SingletonUserStorage();
        },

        setupAnchors: function () {
            this.$bodyElement = $('body');
        },

        render: function () {
            var param = {
                projectUrl: this.projectUrl,
                userLogin: Storage.getDebugUser() || config.userModel.get('name'),
                canDebug: this.canDebug,
                isAdmin: Util.isAdmin(config.userModel.toJSON()),
                lastActive: this.getLastActive(),
                lastURL: this.lastURL
            };
            this.$el.html(Util.templates(this.tpl, param)).show();
            this.setupAnchors();
            this.updateActiveLink();
            Util.setupBaronScroll(this.$el.find('[data-js-scroll-container]'));

            var self = this;
            $(window).resize(function () {
                if (window.innerWidth >= 768 && self.$bodyElement.hasClass('menu-open')) {
                    self.closeMenu();
                }
            });
            return this;
        },

        setLastActivePage: function () {
            var page = Backbone.history.getFragment();
            (page == "user-profile") ? this.userStorage.set('lastActiveURL', this.projectUrl) : this.userStorage.set('lastActiveURL', page);
        },

        updateActiveLink: function () {
            this.clearActives();
            this.currentHash = "#" + Backbone.history.getFragment().split('?')[0].split('/', 2).join('/');
            if (this.currentHash === "#" + this.projectUrl) {
                this.currentHash += "/dashboard";
            }
            if (this.currentHash === "#" + this.projectUrl + "/") {
                this.currentHash += "dashboard";
            }
            if (this.currentHash === "#administrate") {
                this.currentHash += "/projects";
            }
            this.$el.find('a[href^="' + this.currentHash + '"]', this.$el).addClass('active');
        },

        getLastActive: function () {
            var lastActive = '';
            var lastActiveFromStorage = this.userStorage.get('lastActiveURL');
            if (lastActiveFromStorage) {
                lastActive = lastActiveFromStorage;
            }
            return lastActive;
        },

        closeMenu: function () {
            this.$bodyElement.removeClass('menu-open');
        },

        clearActives: function () {
            $("a.active", this.$el).removeClass('active');
        },
        onClickLogout: function(e) {
            e.preventDefault();
            e.stopPropagation();
            config.userModel.logout();
        },

        destroy: function () {
            $(window).unbind('resize');
            this.$el.html('');
            this.undelegateEvents();
            this.stopListening();
            this.unbind();
            delete this;
        }
    });

    return SideBar;
});
