var app = angular.module('GearUpApp', ['ngCookies', 'ngResource', 'ngAnimate', 'toastr', 'Contact', 'Auth', 'Notify', 'Checkout', 'Home', 'Category', 'Product', 'Search']).config(function ($httpProvider, toastrConfig) {
    $httpProvider.defaults.withCredentials = true;
    angular.extend(toastrConfig, {
        maxOpened: 4,
        newestOnTop: true,
        positionClass: 'toast-bottom-right',
        target: 'body'
    });
});
angular.module('Core', []);