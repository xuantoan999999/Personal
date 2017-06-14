'use strict';

// Users controller
angular.module('users').controller('UsersAddController', ['$rootScope', '$scope', '$log', '$stateParams', '$location', 'Authentication', 'Users', 'Option', '$sce', 'Notice', '$timeout', 'localStorageService',

    function ($rootScope, $scope, $log, $stateParams, $location, Authentication, Users, Option, $sce, Notice, $timeout, localStorageService) {

        if (!Authentication.isAdmin) {
            $location.path('signin');
        }
        $scope.isLoading = false;
        $scope.gotoList = gotoList;
        $scope.authentication = Authentication;
        $scope.statuses = Option.getStatus();
        $scope.userRoles = Option.getRoles();
        $scope.mapVN = Option.mapVN();
        $scope.suppliers = [];
        $scope.init = init;
        $scope.create = create;
        // console.log('test',$scope.mapVN);
        $scope.formData = {
            name:'',
            email: '',
            phone: '',
            address: '',
            province: '',
            district: '',
            password:'',
            cfpassword: '',
            status: 1,
            roles: ['user'],
            agent: {},
            supplier: {}
        };

        function init() {
            Users.query({ role: 'supplier', notPage: true },function(resp){
                $scope.suppliers = resp.items;
            });
        }

        function showLoading() {
            $scope.isLoading = true;
        }

        function hideLoading() {
            $timeout(function () {
                $scope.isLoading = false;
            }, 500);
        }

        function gotoList() {
            $location.path('users');
        }
        // Create new user
        function create(isValid, type) {
            $scope.submitted = true;
            if(!isValid) return;

            if($scope.formData.tmpRoleMore == 'agent'){
                $scope.formData.supplier = {};
                $scope.formData.roles.push('agent');
            }
            if($scope.formData.tmpRoleMore == 'supplier'){
                $scope.formData.agent = {};
                $scope.formData.roles.push('supplier');
            }

            var user = new Users($scope.formData);
            // Redirect after save
            user.$save(function (response) {
                if (response._id) {
                    if (type == 'save&list') {
                        $scope.gotoList();
                    } else {
                        $location.path('users/' + response._id + '/edit');
                        $scope.name = '';
                        $scope.submitted = false;
                        // $scope.succes = 'Save user success!';
                    }
                } else {
                    Notice.setNotice(response.message, "ERROR");
                }

            }, function (errorResponse) {
                Notice.setNotice(errorResponse.data.message, "ERROR");
            });
        };
    }
    ]);