/*
 * Copyright (c) 2016
 *
 * This file is licensed under the Affero General Public License version 3
 * or later.
 *
 * See the COPYING-README file.
 *
 */

/* global OC, Handlebars */
(function() {

	/**
	 * Construct a new FederationScopeMenu instance
	 * @constructs FederationScopeMenu
	 * @memberof OC.Settings
	 * @param {object} options
	 * @param {array.<string>} [options.excludedScopes] array of excluded scopes
	 */
	var FederationScopeMenu = OC.Backbone.View.extend({
		tagName: 'div',
		className: 'federationScopeMenu popovermenu bubble menu menu-center',
		field: undefined,
		_scopes: undefined,

		initialize: function(options) {
			this.field = options.field;
			this._scopes = [
				{
					name: 'v2-private',
					displayName: t('settings', 'Private'),
					tooltip: t('settings', "Don't show via public link"),
					iconClass: 'icon-password',
					active: false
				},
				{
					name: 'private',
					displayName: t('settings', 'Local'),
					tooltip: t('settings', "Don't synchronize to servers"),
					iconClass: 'icon-password',
					active: false
				},
				{
					name: 'contacts',
					displayName: t('settings', 'Trusted'),
					tooltip: t('settings', 'Only synchronize to trusted servers'),
					iconClass: 'icon-contacts-dark',
					active: false
				},
				{
					name: 'public',
					displayName: t('settings', 'Published'),
					tooltip: t('settings', 'Synchronize to trusted servers and the global and public address book'),
					iconClass: 'icon-link',
					active: false
				}
			];

			if (options.excludedScopes && options.excludedScopes.length) {
				this._scopes = this._scopes.filter(function(scopeEntry) {
					return options.excludedScopes.indexOf(scopeEntry.name) === -1;
				})
			}
		},

		/**
		 * Current context
		 *
		 * @type OCA.Files.FileActionContext
		 */
		_context: null,

		events: {
			'click a.action': '_onSelectScope',
			'keydown a.action': '_onSelectScopeKeyboard'
		},

		/**
		 * Event handler whenever an action has been clicked within the menu
		 *
		 * @param {Object} event event object
		 */
		_onSelectScope: function(event) {
			var $target = $(event.currentTarget);
			if (!$target.hasClass('menuitem')) {
				$target = $target.closest('.menuitem');
			}

			this.trigger('select:scope', $target.data('action'));

			OC.hideMenus();
		},

		_onSelectScopeKeyboard: function(event) {
			if (event.keyCode === 13 || event.keyCode === 32) {
				// Enter and space can be used to select a scope
				event.preventDefault();
				this._onSelectScope(event);
			}
		},

		/**
		 * Renders the menu with the currently set items
		 */
		render: function() {
			this.$el.html(OC.Settings.Templates['federationscopemenu']({
				items: this._scopes
			}));
		},

		/**
		 * Displays the menu
		 */
		show: function(context) {
			this._context = context;
			var currentlyActiveValue = $('#'+context.target.closest('form').id).find('input[type="hidden"]')[0].value;

			for(var i in this._scopes) {
				if (this._scopes[i].name === currentlyActiveValue) {
					this._scopes[i].active = true;
				} else {
					this._scopes[i].active = false;
				}
			}

			this.render();
			this.$el.removeClass('hidden');

			OC.showMenu(null, this.$el);
		}
	});

	OC.Settings = OC.Settings || {};
	OC.Settings.FederationScopeMenu = FederationScopeMenu;

})();
