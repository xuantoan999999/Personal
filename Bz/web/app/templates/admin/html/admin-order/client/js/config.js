'use strict';

ApplicationConfiguration.registerModule('orders');

angular.module('orders').run(['Menus',
    function (Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Orders', 'orders', 'dropdown', '/orders(/create)?');
        Menus.addSubMenuItem('topbar', 'orders', 'Danh sách đơn hàng', 'orders');
        Menus.addSubMenuItem('topbar', 'orders', 'Nhập đơn hàng', 'orders/create');
    }
]).config(['$stateProvider',
    function ($stateProvider) {
        // Orders state routing
        $stateProvider.
            state('listOrders', {
                url: '/orders?type&page&keyword&status&limit',
                templateUrl: '/templates/admin-order/list-orders.html',
                params: {
                    page: '1'
                }
            }).
            state('createOrder', {
                url: '/orders/create',
                templateUrl: '/templates/admin-order/create-order.html'
            }).
            state('viewOrder', {
                url: '/orders/:orderId',
                templateUrl: '/templates/admin-order/view-order.html'
            }).
            state('editOrder', {
                url: '/orders/:orderId/edit',
                templateUrl: '/templates/admin-order/edit-order.html'
            });
    }
]);
