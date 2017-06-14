'use strict';

ApplicationConfiguration.registerModule('contacts');
angular.module('contacts').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        // Menus.addMenuItem('topbar', 'Liên hệ', 'contacts', 'dropdown', '/contacts(/create)?');
        // Menus.addSubMenuItem('topbar', 'contacts', 'Danh sách liên hệ', 'contacts');
        // Menus.addSubMenuItem('topbar', 'contacts', 'Thêm liên hệ', 'contacts/create');
    }
]).config(['$stateProvider',
    function($stateProvider) {
        // Contacts state routing
        $stateProvider.
        state('listContacts', {
            url: '/contacts',
            data: {
                menuType: 'contact'
            },
            templateUrl: '/templates/admin-contact/list-contacts.html'
        }).
        state('createContact', {
            url: '/contacts/create',
            data: {
                menuType: 'contact'
            },
            templateUrl: '/templates/admin-contact/create-contact.html'
        }).
        state('viewContact', {
            url: '/contacts/:contactId',
            data: {
                menuType: 'contact'
            },
            templateUrl: '/templates/admin-contact/view-contact.html'
        }).
        state('editContact', {
            url: '/contacts/:contactId/edit',
            data: {
                menuType: 'contact'
            },
            templateUrl: '/templates/admin-contact/edit-contact.html'
        });
    }
]);
