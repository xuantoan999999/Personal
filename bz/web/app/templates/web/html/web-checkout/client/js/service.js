'use strict';

angular
    .module('Checkout')
    .service('CheckoutSv', CheckoutSv)
    .factory('CheckoutFac', CheckoutFac);

function CheckoutFac($window, $resource) {
    return $resource(window.settings.services.apiUrl + '/:method/:param1/:param2', { method: '@method', param1: '@param1', param2: '@param2' },
        {

        });
}

function CheckoutSv($q, $window, CheckoutFac) {
    return {
        getAgents: getAgents,
        filterAgent: filterAgent,
        getVerhicle: getVerhicle,

        saveInfoCheckout: saveInfoCheckout,
        getInfoLocal: getInfoLocal,
    };

    function filterAgent(data) {
        var province = data.province;
        var district = data.district ? data.district : null
        var getData = new CheckoutFac();
        var method = 'filter-agent';
        return getData.$get({ method: method, param1: province, param2: district });
    }

    function getAgents() {
        var getData = new CheckoutFac();
        var method = 'agents';
        return getData.$get({ method: method });
    }

    function getVerhicle(id) {
        var getData = new CheckoutFac();
        var method = 'cart';
        var param1 = 'verhicle';
        var param2 = id;
        return getData.$get({ method: method, param1: param1, param2: param2 });
    }

    // save InfoCheckout to local storage
    function saveInfoCheckout(key, data) {
        let time = 30 * 24 * 60 * 60;
        if (typeof (Storage) !== "undefined") {
            Storage.set(key, data, time);
        } else {
            console.error('The browser does not support Storage.');
        }
    }

    function getInfoLocal(key) {
        if (typeof (Storage) !== "undefined") {
            var data = Storage.get(key);
            return data;
        } else {
            console.error('The browser does not support Storage.');
            return null;
        }
    }
}
