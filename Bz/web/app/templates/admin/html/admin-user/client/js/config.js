'use strict';

ApplicationConfiguration.registerModule('users');

angular.module('users').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        // Menus.addMenuItem('topbar', 'Người dùng', 'users', 'dropdown', '/users(/create)?');
        // Menus.addSubMenuItem('topbar', 'users', 'Danh sách người dùng', 'users');
        // Menus.addSubMenuItem('topbar', 'users', 'Tạo người dùng', 'users/create');
    }
    ]).config(['$stateProvider',
    function($stateProvider) {
        // Users state routing
        $stateProvider.
        state('listUsers', {
            url: '/users',
            data: {
                menuType: 'user'
            },
            templateUrl: '/templates/admin-user/list-users.html'
        }).
        state('createUser', {
            url: '/users/create',
            data: {
                menuType: 'user'
            },
            templateUrl: '/templates/admin-user/create-user.html'
        }).
        state('editUser', {
            url: '/users/:userId/edit',
            data: {
                menuType: 'user'
            },
            templateUrl: '/templates/admin-user/edit-user.html'
        });
    }
    ]);
