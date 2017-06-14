'use strict';

// Contacts controller
angular.module('contacts').controller('ContactsController', 
    ['$scope','$state', '$stateParams', '$location', '$timeout', 'Authentication', 'Contacts', 'toastr', '$uibModal',
    function($scope, $state, $stateParams, $location, $timeout,  Authentication, Contacts,toastr,$uibModal) {
        $scope.authentication = Authentication;

        if (!Authentication.user.name) {
            $location.path('signin');
        }

        function showLoading() {
            $scope.isLoading = true;
        }

        function hideLoading() {
            $timeout(function () {
                $scope.isLoading = false;
            }, 300);
        }

        $scope.gotoList = function() {
            $location.path('contacts');
        }

        // Create new Contact
        $scope.create = function(isValid) {
            $scope.submitted = true;
            if(!isValid) return;

            // Create new Contact object
            var contact = new Contacts({
                name: this.name,
                email: this.email,
                message: this.message
            });

            // Redirect after save
            contact.$save(function(response) {
                toastr.success("Tạo liên hệ thành công!", "Thành công");
                $scope.gotoList();
            }, function(errorResponse) {
                console.log('ERROR',errorResponse.data.message);
                toastr.error("Tạo liên hệ Lỗi!", "Lỗi");
            });
        };

        // Remove existing Contact
        $scope.remove = function(id) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/templates/admin-core/popupMessage.html',
                resolve: {
                    vmContact: function () {
                        return $scope;
                    },
                    id: function () {
                        return id;
                    }
                },
                controller: function ($scope, $uibModalInstance, vmContact, id) {
                    $scope.popTitle = 'Xác nhận xoá'
                    $scope.message = 'Bạn chắc chắn xoá Liên hệ?';
                    $scope.ok = function () {
                        if (id) {
                            Contacts.remove({contactId: id}, function(){
                                toastr.success("Xóa liên hệ thành công!", "Thành công");
                                $uibModalInstance.close();
                                $state.reload();
                            },function(errorResponse){
                                console.log('ERROR',errorResponse.data.message);
                                toastr.error("Xóa liên hệ Lỗi!", "Lỗi");
                                $uibModalInstance.close();
                            });
                        } else {
                            toastr.error("Không có ID cần xóa!", "Lỗi");
                            $uibModalInstance.close();
                        }
                    }
                }
            });
        };

        // Update existing Contact
        $scope.update = function(isValid) {
            $scope.submitted = true;
            if(!isValid) return;

            var contact = $scope.contact;
            delete contact.__v;
            delete contact.createdAt;
            contact.$update(function() {
                toastr.success("Cập nhật liên hệ thành công!", "Thành công");
                $scope.gotoList();

            }, function(errorResponse) {
                console.log('ERROR',errorResponse.data.message);
                toastr.error("Tạo liên hệ Lỗi!", "Lỗi");
            });
        };

        // Find existing Contact
        $scope.findOne = function() {
            $scope.contact = Contacts.get({
                contactId: $stateParams.contactId
            });
        };

        $scope.currentPage = 1;

        $scope.setPage = function(pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.pageChanged = function() {
            getListData();
        };

        function getListData() {
            showLoading();
            var options = {
                page: $scope.currentPage,
                keyword: $scope.query,
            };

            Contacts.query(options, function(data) {
                console.log('test',data);
                $scope.contacts = data.items;
                $scope.totalItems = data.totalItems;
                $scope.itemsPerPage = data.itemsPerPage;
                $scope.numberVisiblePages = data.numberVisiblePages;
                hideLoading();
            });
        }

        // Find a list of Posts
        $scope.find = function() {
            getListData();
        };
        //search
        $scope.search = function() {
            getListData();
        };
        //reset
        $scope.reset = function() {
            $scope.search.keyword = "";
            $scope.currentPage = 1;
            getListData();
        };
    }
    ]);
