'use strict';

// Coupon service used for communicating with the coupons REST endpoint
angular.module('coupons').factory('Coupons', ['$resource',
    function ($resource) {
        return $resource(window.cmsprefix + '/coupon/:couponId', { couponId: '@_id' }, {
            update: {
                method: 'PUT'
            },
            query: {
                isArray: false
            },
        });
    }
]);