angular
    .module('Category')
    .controller('categoryCtrl', categoryCtrl);

function categoryCtrl($scope, $filter, $cookies) {
    var vmCategory = this;

    // Methoad
    vmCategory.init = init;
    vmCategory.showMore = showMore;
    vmCategory.showProduct = 16;
    vmCategory.showNumEach = 16;

    // Function
    function init() {
        $('#show-more').removeClass('none');
    }

    function showMore() {
        vmCategory.showProduct += vmCategory.showNumEach;
    }
}