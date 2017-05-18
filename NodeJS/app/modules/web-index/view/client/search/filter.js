var search = (function () {
    'use strict';

    angular
        .module('bzWebHome')
        .filter('filterKeyword', filterKeyword)
        .filter('filterProduct', filterProduct);

    function filterKeyword() {
        return function (keywords, text) {
            if (text.search && keywords) {
                var out = keywords.filter(function (item) {
                    return item.keyword.indexOf(text.search) != -1;
                })
                return out;
            }
            return keywords;
        }
    }

    function filterProduct() {
        return function (products, text) {
            if (text.search && products) {
                var out = products.filter(function (item) {
                    return item.name.indexOf(text.search) != -1;
                })
                return out;
            }
            return products;
        }
    }
})();
