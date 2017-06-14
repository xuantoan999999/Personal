'use strict';

ApplicationConfiguration.registerModule('coupons');

angular.module('coupons').run(['Menus',
    function (Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Khuyến mãi', 'coupons', 'dropdown', '/coupons(/create)?');
        Menus.addSubMenuItem('topbar', 'coupons', 'Danh sách khuyến mãi', 'coupons');
        Menus.addSubMenuItem('topbar', 'coupons', 'Tạo khuyến mãi', 'coupons/create');
    }
]).config(['$stateProvider',
    function ($stateProvider) {
        // Coupons state routing
        $stateProvider.
            state('listCoupons', {
                url: '/coupons?page&keyword&status&limit',
                templateUrl: '/templates/admin-coupon/list-coupons.html',
                params: {
                    page: '1'
                }
            }).
            state('createCoupon', {
                url: '/coupons/create',
                templateUrl: '/templates/admin-coupon/create-coupon.html'
            }).
            state('viewCoupon', {
                url: '/coupons/:couponId',
                templateUrl: '/templates/admin-coupon/view-coupon.html'
            }).
            state('editCoupon', {
                url: '/coupons/:couponId/edit',
                templateUrl: '/templates/admin-coupon/edit-coupon.html'
            });
    }
]);
