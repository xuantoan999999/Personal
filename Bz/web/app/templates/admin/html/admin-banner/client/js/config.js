'use strict';

ApplicationConfiguration.registerModule('banners');

angular.module('banners').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        // Menus.addMenuItem('topbar', 'Banners', 'banners', 'dropdown', '/banners(/create)?');
        // Menus.addSubMenuItem('topbar', 'banners', 'List Banners', 'banners');
        // Menus.addSubMenuItem('topbar', 'banners', 'New Banner', 'banners/create');
    }
]).config(['$stateProvider',
    function($stateProvider) {
        // Banners state routing
        $stateProvider.
        state('listBanners', {
            url: '/banners',
            data: {
                menuType: 'banner'
            },
            templateUrl: '/templates/admin-banner/list-banners.html'
        }).
        state('createBanner', {
            url: '/banners/create',
            data: {
                menuType: 'banner'
            },
            templateUrl: '/templates/admin-banner/create-banner.html'
        }).
        state('viewBanner', {
            url: '/banners/:bannerId',
            data: {
                menuType: 'banner'
            },
            templateUrl: '/templates/admin-banner/view-banner.html'
        }).
        state('editBanner', {
            url: '/banners/:bannerId/edit',
            data: {
                menuType: 'banner'
            },
            templateUrl: '/templates/admin-banner/edit-banner.html'
        });
    }
]);
