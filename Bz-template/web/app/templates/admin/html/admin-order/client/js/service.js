'use strict';

// Orders service used for communicating with the orders REST endpoint
angular.module('orders').factory('Orders', ['$resource',
    function ($resource) {
        return $resource(window.cmsprefix + '/order/:orderId', { orderId: '@_id' }, {
            update: {
                method: 'PUT'
            },
            query: {
                isArray: false
            },
            initForm: {
                url: window.cmsprefix + '/order/init-data/:id',
                method: 'GET',
                params: {
                    id: '@id',
                }
            },
            filterAgent: {
                url: window.settings.services.apiUrl + '/filter-agent/:province/:district',
                method: 'GET',
                params: {
                    province: '@province',
                    district: '@district',
                }
            },
        });
    }
]);