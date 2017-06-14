'use strict';

ApplicationConfiguration.registerModule('categories');

angular.module('categories').run(['Menus',
    function (Menus) {
        // Set top bar menu items
        // Menus.addMenuItem('topbar', 'Quản lý model', 'categories-model', 'dropdown', '/categories(/create)');
        // Menus.addSubMenuItem('topbar', 'categories-model', 'Danh sách model', 'categories?type=model');
        // Menus.addSubMenuItem('topbar', 'categories-model', 'Thêm model', 'categories/create?type=model');
        // Menus.addMenuItem('topbar', 'Quản lý nhà sản xuất', 'categories-brand', 'dropdown', '/categories(/create)');
        // Menus.addSubMenuItem('topbar', 'categories-brand', 'Danh sách nhà sản xuất', 'categories?type=brand');
        // Menus.addSubMenuItem('topbar', 'categories-brand', 'Thêm nhà sản xuất', 'categories/create?type=brand');
    }
]).config(['$stateProvider',
    function ($stateProvider) {
        // Categories state routing
        $stateProvider.
            state('listModel', {
                url: '/model?type',
                data: {
                    menuType: 'list-model'
                },
                templateUrl: '/templates/admin-category/list-categories.html'
            }).
            state('createModel', {
                url: '/model/create?type',
                data: {
                    menuType: 'create-model'
                },
                templateUrl: '/templates/admin-category/create-category.html'
            }).
            state('editModel', {
                url: '/model/:categoryId/edit?type',
                data: {
                    menuType: 'list-model'
                },
                templateUrl: '/templates/admin-category/edit-category.html'
            }).
            state('listBrand', {
                url: '/brand?type',
                data: {
                    menuType: 'list-brand'
                },
                templateUrl: '/templates/admin-category/list-categories.html'
            }).
            state('createBrand', {
                url: '/brand/create?type',
                data: {
                    menuType: 'create-brand'
                },
                templateUrl: '/templates/admin-category/create-category.html'
            }).
            state('editBrand', {
                url: '/brand/:categoryId/edit?type',
                data: {
                    menuType: 'list-brand'
                },
                templateUrl: '/templates/admin-category/edit-category.html'
            });
    }
]);
