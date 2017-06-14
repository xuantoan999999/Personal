'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
    // Init module configuration options
    var applicationModuleName = 'mean';
    var applicationModuleVendorDependencies = [
    'ngResource',
    'ngAnimate',
    'ui.router',
    'ui.bootstrap',
    'angularFileUpload',
    'ui.select',
    'ngSanitize',
    'ngMessages',
    'ui.utils.masks',
    'ui.bootstrap.datetimepicker',
    'ng.jsoneditor',
    'ngFileUpload',
    'LocalStorageModule',
    'ui.tinymce',
    'toastr',
    ];

    // Add a new vertical module
    var registerModule = function (moduleName, dependencies) {
        // Create angular module
        angular.module(moduleName, dependencies || []);

        // Add the module to the AngularJS configuration file
        angular.module(applicationModuleName).requires.push(moduleName);
    };

    return {
        applicationModuleName: applicationModuleName,
        applicationModuleVendorDependencies: applicationModuleVendorDependencies,
        registerModule: registerModule
    };
})();


//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

angular.module(ApplicationConfiguration.applicationModuleName).config(function (localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix(ApplicationConfiguration.applicationModuleName);
});

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$httpProvider', 'toastrConfig',
    function ($locationProvider, $httpProvider, toastrConfig) {
        //$locationProvider.html5Mode(true);
        $httpProvider.defaults.withCredentials = true;
        $locationProvider.hashPrefix('!');

        angular.extend(toastrConfig, {
            extendedTimeOut: 1000,
            timeOut: 1000,
            newestOnTop: true,
            positionClass: 'toast-bottom-right',
            preventDuplicates: false,
            preventOpenDuplicates: false,
            tapToDismiss: true,
            allowHtml: true,
            closeButton: true,
            target: 'body',
            templates: {
                toast: '/templates/admin-core/toast.html',
                progressbar: '/templates/admin-core/progressbar.html'
            }
        });
    }
    ]);
angular.module(ApplicationConfiguration.applicationModuleName).run(['$rootScope','$window','$document','$state','Authentication',function(
    $rootScope,
    $window,
    $document,
    $state,
    Authentication) {

    $rootScope._ = window._;
        // Global variables
        $rootScope.pageData = {};
        // Global methods
        $rootScope.pageMethods = {};
        $rootScope.pageMethods.authSvc = Authentication;
        $rootScope.pageMethods.redirect = redirect;

        /*Sự kiện trạng thái state*/
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.pageData.className = toState.name;
            if(toState.data)
                $rootScope.pageData.menuType = toState.data.menuType;
            else
                $rootScope.pageData.menuType = '';
        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $window.scrollTop = $document[0].body.scrollTop = $document[0].documentElement.scrollTop = 0;

            $rootScope.pageData.currentState = toState;
            $rootScope.pageData.currentParams = toParams;
        });

        function redirect(state, params, notify) {
            $state.go(state, params, notify);
        }

    }]);

//Then define the init function for starting up the application
angular.element(document).ready(function () {
    //Fixing facebook bug with redirect
    //if (window.location.hash === '#_=_') window.location.hash = '#!';

    //Then init the app
    angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});