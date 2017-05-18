(function () {
    'use strict';

    angular
        .module('bzCoupon')
        .factory('couponFac', couponFac)
        .service('couponSvc', couponSvc);

    function couponFac(bzResourceSvc) {
        return bzResourceSvc.api(settingJs.configs.adminUrl + '/:method/:id', { method: '@method', id: '@id' });
    }

    function couponSvc($q, couponFac) {
        return {
            getAll: getAll,
            get: get,
            create: create,
            update: update,
            getByCode: getByCode,
            checkIsset: checkIsset
        };

        function getAll(query, type) {
            query.method = 'coupon';
            query.type = type;
            var list = new couponFac();
            // console.log(createData);

            return list.$get(query);
        }

        function get(id) {
            var getByID = new couponFac();
            // console.log(createData);

            return getByID.$get({ method: 'coupon', id: id });
        }

        function create(data) {
            // console.log(data);
            var createData = new couponFac(data);
            // console.log(createData);

            return createData.$save({ method: 'coupon' });
        }

        function update(data, id) {
            var updateData = new couponFac(data);

            return updateData.$update({ method: 'coupon', id: id });
        }

        function getByCode(code) {
            var getByCode = new couponFac();
            return getByCode.$get({ method: 'coupon-code', id: code });
        }

        function checkIsset(data, id) {
            var query = { method: 'coupon', id: 'check-coupon' };
            if (id) {
                query.coupon_id = id;
            }
            var getByCode = new couponFac(data);
            return getByCode.$save(query);
        }
    }
})();