'use strict';

ApplicationConfiguration.registerModule('products');

angular.module('products').run(['Menus',
    function (Menus) {
        // Set top bar menu items
        // Menus.addMenuItem('topbar', 'Quản lý xe', 'products', 'dropdown', '/products(/create)');
        // Menus.addSubMenuItem('topbar', 'products', 'Danh sách xe', 'products?type=XE');
        // Menus.addSubMenuItem('topbar', 'products', 'Tạo xe mới', 'products/create?type=XE');
    }
]).config(['$stateProvider',
    function ($stateProvider) {
        // Products state routing
        $stateProvider.
            state('listProducts', {
                url: '/products?type',
                data: {
                    menuType: 'products'
                },
                templateUrl: '/templates/admin-product/list-product-car.html'
            }).
            state('createProduct', {
                url: '/products/create?type',
                data: {
                    menuType: 'products-create'
                },
                templateUrl: '/templates/admin-product/create-product-car.html'
            }).
            state('editProduct', {
                url: '/products/:productId/edit?type',
                data: {
                    menuType: 'products'
                },
                templateUrl: '/templates/admin-product/edit-product-car.html'
            });
    }
]);
