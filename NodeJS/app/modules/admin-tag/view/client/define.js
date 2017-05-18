;
(function () {
    'use strict';

    Application.registerModule('bzTag');

    angular
        .module('bzTag', [])
        .constant('listTagTypeBlog', [
            { name: 'Góc bếp', value: 'GB' },
            { name: 'Mẹo vặt', value: 'MV' },
            { name: 'Tin tức', value: 'TT' },
            // { name: 'Chương trình khuyến mãi', value: 'KM' },
        ]);
})();