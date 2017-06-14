angular
    .module('Search')
    .controller('searchCtrl', searchCtrl);

function searchCtrl($scope, $filter, $cookies) {
    var vmSearch = this;

    // Methoad
    vmSearch.init = init;

    // Function
    function init() {
        
    }
}