'use strict';

// Users controller
angular.module('users').controller('UsersListController', ['$rootScope', '$scope','$uibModal', '$log', '$stateParams', '$location', 'Authentication', 'Users', 'Option', '$sce', '$timeout', 'localStorageService','toastr',

    function ($rootScope, $scope, $uibModal, $log, $stateParams, $location, Authentication, Users, Option, $sce, $timeout, localStorageService, toastr) {

        if (!Authentication.isAdmin) {
            $location.path('signin');
        }
        var localStorageName = "user.filterData";
        $scope.statuses = Option.getStatus();
        $scope.userRoles = Option.getRoles();
        $scope.search = {};
        $scope.isLoading = false;
        $scope.currentPage = 1;
        $scope.rowsSelected = {};
        $scope.setPage = setPage;
        $scope.pageChanged = pageChanged;
        $scope.find = find;
        $scope.remove = remove;
        $scope.movetoTrashMultiRows = movetoTrashMultiRows;
        $scope.deletePermanentMultiRows = deletePermanentMultiRows;
        $scope.processChangeStatus = processChangeStatus;
        $scope.changeStatusMultiRows = changeStatusMultiRows;
        $scope.sellectAll = sellectAll;
        $scope.putback = putback;
        $scope.filter = filter;


        function showLoading() {
            $scope.isLoading = true;
        }

        function hideLoading() {
            $timeout(function () {
                $scope.isLoading = false;
            }, 500);
        }

        function setPage(pageNo) {
            $scope.currentPage = pageNo;
        };

        function pageChanged(page) {
            setPage(page);
            setFilterToLocalStorage();
            getListData();
        };

        function getOptionsQuery() {
            var options = {
                page: $scope.currentPage,
                keyword: $scope.search.keyword,
                role: $scope.search.role,
                status: $scope.search.status
            };
            return options;
        }

        function setScopeAfterQuery(data) {
            $scope.users = data.items;
            $scope.totalItems = data.totalItems;
            $scope.totalPage = data.totalPage;
            $scope.itemsPerPage = data.itemsPerPage;
            $scope.numberVisiblePages = data.numberVisiblePages;
        }

        function getListData() {

            showLoading();
            // Reset selected row
            $scope.rowsSelected = {};

            // get filter from local storage
            getFilterToLocalStorage();

            Users
            .query(getOptionsQuery(), function (data) {
                setScopeAfterQuery(data);
                hideLoading();
            });
        }

        function setFilterToLocalStorage() {
            localStorageService.set(localStorageName, {
                currentPage: $scope.currentPage,
                search: $scope.search
            });
        }


        function getFilterToLocalStorage() {
            var filterData = localStorageService.get(localStorageName);
            if (!$.isEmptyObject(filterData)) {
                $scope.currentPage = Number.isInteger(filterData.currentPage) ? Number(filterData.currentPage) : 1;
                if (!$.isEmptyObject(filterData.search)) {
                    $scope.search.keyword = filterData.search.keyword ? filterData.search.keyword : "";
                    $scope.search.role = filterData.search.role ? filterData.search.role : null;
                    $scope.search.status = Number.isInteger(filterData.search.status) ? Number(filterData.search.status) : null;
                }

            }
        }
        // Find a list of Posts
        function find() {
            getListData();
        };

        function filter() {
            setPage(1);
            setFilterToLocalStorage();
            getListData();
        };
        //reset
        $scope.reset = function () {
            $scope.search.keyword = "";
            $scope.search.role = "";
            $scope.search.status = "";
            $scope.currentPage = 1;
            setFilterToLocalStorage();
            getListData();
        };

        // Remove Function
        function remove(userId, deletePermanent) {

            $scope.currentUserId = userId;
            $scope.deletePermanent = deletePermanent;
            if (deletePermanent) {
                $scope.popTitle = 'Xóa vĩnh viễn';
                $scope.popMessage = "Bạn muốn xóa Users vĩnh viễn?";
            } else {
                $scope.popTitle = 'Xóa vào sọt rác';
                $scope.popMessage = "Bạn muốn xóa Users vào sọt rác?";
            }

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/templates/admin-core/popupMessage.html',
                resolve: {
                    vmUser: function () {
                        return $scope;
                    }
                },
                controller: function ($scope, $uibModalInstance, vmUser) {
                    $scope.popTitle = vmUser.popTitle;
                    $scope.message = vmUser.popMessage;

                    $scope.ok = function () {
                        // Check User is trash
                        var userId = vmUser.currentUserId;
                        if (vmUser.deletePermanent) {
                            var user = Users.get({
                                userId: userId
                            });
                            user.$remove({
                                userId: userId
                            });
                            toastr.success("Xóa người dùng thành công!", "Thành Công");
                            $uibModalInstance.close();
                        } else {
                            Users.moveToTrash({
                                id: userId,
                            }, function (response) {
                                console.log(response);
                                if (response.status) {
                                    toastr.success(response.message, "Thành Công");
                                    $uibModalInstance.close();
                                }
                            });
                        }

                        for (var i in vmUser.users) {
                            if (vmUser.users[i]._id === userId) {
                                vmUser.users.splice(i, 1);
                            }
                        }

                        if ($stateParams.userId) {
                            vmUser.gotoList();
                        }
                        vmUser.currentUserId = null;
                    }
                }
            });
        };

        // deletePermanent Function
        function deletePermanentMultiRows() {
            removeMultiRows(true);
        };

        // movetoTrashMultiRows Function
        function movetoTrashMultiRows() {
            removeMultiRows(false);
        };

        function removeMultiRows(isPermanent){
            $scope.isPermanent = isPermanent;
            if (angular.equals({}, $scope.rowsSelected)) {
                toastr.warning('Bạn chưa chọn items', "Chú ý");
            } else {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '/templates/admin-core/popupMessage.html',
                    resolve: {
                        vmUser: function () {
                            return $scope;
                        }
                    },
                    controller: function ($scope, $uibModalInstance, vmUser) {
                        if(vmUser.isPermanent){
                            $scope.popTitle = 'Xóa';
                            $scope.message = 'Bạn muốn xóa người dùng vĩnh viễn?';
                        }else{
                            $scope.popTitle = 'Xóa';
                            $scope.message = 'Bạn muốn xóa người dùng vào sọt rác?';
                        }

                        $scope.ok = function () {
                            Users.deleteMultiRows({
                                rowsSelected: vmUser.rowsSelected,
                                currentStatusFilter: vmUser.search.status
                            }, function (response) {
                                if (response.status) {
                                    getListData();
                                    toastr.success(response.message, "Thành Công");
                                    $uibModalInstance.close();
                                }
                            });
                        }
                    }
                });
            }
        }

        // Change status
        function processChangeStatus(userId, status) {

            $scope.currentUserId = userId;
            $scope.currentStatus = status;

            if (status == 1) {
                $scope.confirmMessage = $sce.trustAsHtml("Bạn muốn thay đổi trạng thái từ <b>Publish</b> sang <b>Unpublish</b>?");
            } else {
                $scope.confirmMessage = $sce.trustAsHtml("Bạn muốn thay đổi trạng thái từ <b>Unpublish</b> sang <b>Publish</b>?");
            }

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/templates/admin-core/popupMessage.html',
                resolve: {
                    vmUser: function () {
                        return $scope;
                    }
                },
                controller: function ($scope, $uibModalInstance, vmUser) {
                    $scope.popTitle = 'Cập nhật';
                    $scope.message = vmUser.confirmMessage;

                    $scope.ok = function () {
                        var userId = vmUser.currentUserId;
                        var currentStatus = vmUser.currentStatus;

                        Users.changeStatus({
                            id: userId,
                            currentStatus: currentStatus
                        }, function (response) {
                            if (response.status) {
                                getListData();
                                toastr.success(response.message, "Thành Công");
                                $uibModalInstance.close();
                            }
                        });
                    }
                }
            });
        }

        function changeStatusMultiRows(status) {
            $scope.status = $scope.status;
            if (angular.equals({}, $scope.rowsSelected)) {
                toastr.warning('Bạn chưa chọn items ', "Chú ý");
                $('.modal').modal('hide');
            } else {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '/templates/admin-core/popupMessage.html',
                    resolve: {
                        vmUser: function () {
                            return $scope;
                        }
                    },
                    controller: function ($scope, $uibModalInstance, vmUser) {
                        $scope.popTitle = 'Cập nhật';
                        $scope.message = 'Bạn có muốn thay đổi trạng thái của nhiều users?';

                        $scope.ok = function () {
                            Users.changeStatusMultiRows({
                                rowsSelected: vmUser.rowsSelected,
                                status: vmUser.status
                            }, function (response) {
                                if (response.status) {
                                    getListData();
                                    // Reset  All Checked
                                    vmUser.rowsSelected = {};
                                    vmUser.selectAll = false;
                                    // Set Notice
                                    toastr.success(response.message, "Thành Công");
                                }
                            });
                            $uibModalInstance.close();
                        }
                    }
                });
            }
        }

        function putback(userId) {
            Users.get({
                userId: userId
            }, function (result) {
                result.status = 0;
                result.password = null;
                result.cfpassword = null;
                result.$update({}, function (resp) {
                    if (resp._id) {
                        for (var i in $scope.users) {
                            if ($scope.users[i]._id === userId) {
                                $scope.users.splice(i, 1);
                            }
                        }
                        toastr.success("Phục hồi người dùng thành công!", "Thành Công");
                        $scope.submitted = false;
                    } else {
                        toastr.error(resp.message, "Lỗi");
                    }
                }, function (errorResponse) {
                    toastr.error(errorResponse.data.message, "Lỗi");
                });
            });
        };

        function sellectAll() {
            var rowsSelected = {};
            if ($scope.selectAll) {
                var users = $scope.users;
                users.forEach(function (user) {
                    rowsSelected[user._id] = true;
                });
                console.log(rowsSelected);
            }
            $scope.rowsSelected = rowsSelected;
        }
    }
    ]);