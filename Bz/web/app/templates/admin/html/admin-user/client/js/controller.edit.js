'use strict';

// Users controller
angular.module('users').controller('UsersEditController', ['$rootScope', '$scope', '$log', '$stateParams', '$location', 'Authentication', 'Users', 'Option', '$sce', 'Notice', '$timeout', 'localStorageService', 'toastr',

    function ($rootScope, $scope, $log, $stateParams, $location, Authentication, Users, Option, $sce, Notice, $timeout, localStorageService, toastr) {

        if (!Authentication.isAdmin) {
            $location.path('signin');
        }
        $scope.isLoading = false;
        $scope.gotoList = gotoList;
        $scope.authentication = Authentication;
        $scope.mapVN = Option.mapVN();
        $scope.statuses = Option.getStatus();
        $scope.userRoles = Option.getRoles();
        $scope.update = update;
        $scope.findOne = findOne;

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
        
        /**
         * function update user
         */
         function update(isValid, type) {

            $scope.submitted = true;
            if(!isValid) return;

            /*remove role agent & supplier*/
            $scope.formData.roles.find(function(value, index) {
                if(value == 'supplier' || value == 'agent')
                    $scope.formData.roles.splice(index,1);
            });

            /*add role*/
            if($scope.formData.tmpRoleMore == 'agent'){
                $scope.formData.roles.push($scope.formData.tmpRoleMore);
                $scope.formData.supplier = {};

            }
            if($scope.formData.tmpRoleMore == 'supplier'){
                $scope.formData.agent = {};
                $scope.formData.roles.push('supplier');
            }

            $scope.$log = $log;
            var user = new Users($scope.formData);
            user.$update(function (response) {
                if (response.error) {
                    toastr.error(response.message, 'Lỗi');
                } else {
                    toastr.success("Cập nhật người dùng thành công!", 'Thành Công');
                    if (type == 'save&list') {
                        gotoList();
                    } else {
                        Notice.requireChange();
                    }
                }
            }, function (errorResponse) {
                toastr.error("Tạo user lỗi!.", 'Lỗi');
            });
        };

        /**
         * function Find One
         */
         function findOne() {
            Users.get({
                userId: $stateParams.userId
            },function(user){
                $scope.formData = {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                    province: user.province,
                    district: user.district,
                    status: user.status,
                    roles: user.roles||[],
                    agent: user.agent || {},
                    supplier: user.supplier || {}
                };
                if(user.roles.includes('agent'))
                    $scope.formData.tmpRoleMore = 'agent';
                if(user.roles.includes('supplier'))
                    $scope.formData.tmpRoleMore = 'supplier';

                Users.query({ role: 'supplier', notPage: true, _idNot: [user._id] },function(resp){
                    $scope.suppliers = resp.items;
                });
            });
        };
    }
    ]);