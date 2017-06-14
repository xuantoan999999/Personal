'use strict';

ApplicationConfiguration.registerModule('orders');

angular.module('orders').run(['Menus',
    function (Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Đơn đặt hàng', 'orders', 'dropdown', '/orders(/create)?');
        Menus.addSubMenuItem('topbar', 'orders', 'Danh sách đơn hàng', 'orders');
        Menus.addSubMenuItem('topbar', 'orders', 'Nhập đơn hàng', 'orders/create');
    }
]).config(['$stateProvider',
    function ($stateProvider) {
        // Orders state routing
        $stateProvider.
            state('listOrders', {
                url: '/orders?type&page&keyword&status&limit',
                data: {
                    menuType: 'list-order'
                },
                templateUrl: '/templates/admin-order/list-orders.html',
                params: {
                    page: '1'
                }
            }).
            state('createOrder', {
                url: '/orders/create',
                data: {
                    menuType: 'add-order'
                },
                templateUrl: '/templates/admin-order/create-order.html'
            }).
            state('viewOrder', {
                url: '/orders/:orderId',
                data: {
                    menuType: 'view-order'
                },
                templateUrl: '/templates/admin-order/view-order.html'
            }).
            state('editOrder', {
                url: '/orders/:orderId/edit',
                data: {
                    menuType: 'edit-order'
                },
                templateUrl: '/templates/admin-order/edit-order.html'
            });
    }
]);
