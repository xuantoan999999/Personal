'use strict';

//Categories service used to communicate Categories REST endpoints
angular.module('products').factory('Products', ['$resource',
    function ($resource) {
        return $resource(window.cmsprefix + '/product/:productId', {
            productId: '@_id'
        }, {
                update: {
                    method: 'PUT'
                },
                query: {
                    isArray: false,
                }
            });
    }
]).service('productSvc', ['Categories', 'Users',
    function (Categories, Users) {
        return {
            getListModel: getListModel,
            getListBrand: getListBrand,
            getListSuplier: getListSuplier,
        };

        function getListModel(cb) {
            Categories.query({ type: 'model', limit: 100 }, function (data) {
                cb(data);
            });
        }
        function getListBrand(cb) {
            Categories.query({ type: 'brand', limit: 100 }, function (data) {
                cb(data);
            });
        }

        function getListSuplier(cb) {
            Users.query({ role: 'supplier', notPage: true }, function (data) {
                cb(data);
            });
        }
    }
]);