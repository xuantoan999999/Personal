'use strict';

ApplicationConfiguration.registerModule('categories');

angular.module('categories').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Quản lý model', 'categories-model', 'dropdown', '/categories(/create)');
        Menus.addSubMenuItem('topbar', 'categories-model', 'Danh sách model', 'categories?type=model');
        Menus.addSubMenuItem('topbar', 'categories-model', 'Thêm model', 'categories/create?type=model');
        Menus.addMenuItem('topbar', 'Quản lý nhà sản xuất', 'categories-brand', 'dropdown', '/categories(/create)');
        Menus.addSubMenuItem('topbar', 'categories-brand', 'Danh sách nhà sản xuất', 'categories?type=brand');
        Menus.addSubMenuItem('topbar', 'categories-brand', 'Thêm nhà sản xuất', 'categories/create?type=brand');
    }
]).config(['$stateProvider',
    function($stateProvider) {
        // Categories state routing
        $stateProvider.
        state('listCategories', {
            url: '/categories?type',
            templateUrl: '/templates/admin-category/list-categories.html'
        }).
        state('createCategory', {
            url: '/categories/create?type',
            templateUrl: '/templates/admin-category/create-category.html'
        }).
        state('editCategory', {
            url: '/categories/:categoryId/edit?type',
            templateUrl: '/templates/admin-category/edit-category.html'
        });
    }
]);
