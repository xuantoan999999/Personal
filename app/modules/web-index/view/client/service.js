(function () {
    'use strict';

    angular
        .module('bzWebHome')
        .service('webHomeSvc', webHomeSvc)
        .factory('webHomeFac', webHomeFac)
        .factory('webApiFac', webApiFac);

    function webHomeFac($window, bzResourceSvc) {
        return bzResourceSvc.api($window.settings.services.webUrl + '/:method',
            { method: '@method', id_product: '@id_product', quantity: '@quantity' });
    }

    function webApiFac($window, bzResourceSvc) {
        return bzResourceSvc.api($window.settings.services.apiUrl + '/:method',
            { method: '@method', });
    }

    function webHomeSvc($q, $window, bzResourceSvc, webHomeFac, webApiFac) {
        return {
            get: get,
            getMenu: getMenu
        };

        function get() {
            var getData = new webHomeFac();
            return getData.$get({ method: '', api: true });
        }

        function getMenu() {
            var getData = new webApiFac();
            return getData.$get({ method: 'product-list' });
        }

    }
})();