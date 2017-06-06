'use strict';

// Categories controller
angular.module('categories').controller('CategoriesListController',
    ['$scope', '$stateParams', '$location', '$window', '$uibModal', 'Option', 'Authentication', 'Categories', 'localStorageService', 'toastr',
        function ($scope, $stateParams, $location, $window, $uibModal, Option, Authentication, Categories, localStorageService, toastr) {
            // Variable
            $scope.authentication = Authentication;
            $scope.type = $stateParams.type;
            if (!Authentication.user.name) {
                $location.path('signin');
            }
            $scope.types = Option.getTypes();
            $scope.statuses = Option.getStatusDefault();
            $scope.gotoList = function () {
                $location.path('categories');
            }
            var localStorageName = "category" + $scope.type + ".filterData";
            $scope.url = $window.settings.services.webUrl + '/files/category/';
            $scope.currentPage = 1;
            $scope.query = {};

            // Methoad
            $scope.remove = remove;
            $scope.setPage = setPage;
            $scope.pageChanged = pageChanged;
            $scope.find = getListData;
            $scope.search = getListData;
            $scope.reset = reset;
            $scope.filter = filter;
            $scope.changeStatus = changeStatus;

            // Remove existing Category
            function remove(category) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '/templates/admin-core/popupMessage.html',
                    resolve: {
                        vmCategory: function () {
                            return $scope;
                        }
                    },
                    controller: function ($scope, $uibModalInstance, vmCategory) {
                        $scope.popTitle = 'Cập nhật';
                        $scope.message = 'Bạn có muốn xóa category này?';


                        $scope.ok = function () {
                            category.status = category.status == 1 ? 0 : 1;
                            var update_category = new Categories(category);

                            var category_del = Categories.get({
                                categoryId: category._id
                            });

                            category_del.$remove({
                                categoryId: category._id
                            }, function (resp) {
                                toastr.success("Delete user success!", "Success");
                                $uibModalInstance.close();
                                getListData();
                            });
                        }
                    }
                });
            };

            function changeStatus(category) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '/templates/admin-core/popupMessage.html',
                    resolve: {
                        vmCategory: function () {
                            return $scope;
                        }
                    },
                    controller: function ($scope, $uibModalInstance, vmCategory) {
                        var text_status = category.status == 1 ? 'unpublish' : 'publish';
                        $scope.popTitle = 'Cập nhật';
                        $scope.message = 'Bạn có muốn ' + text_status + ' trạng thái của category?';

                        $scope.ok = function () {
                            category.status = category.status == 1 ? 0 : 1;
                            var update_category = new Categories(category);
                            update_category.$update(function (resp) {
                                toastr.success("Update category success", 'SUCCESS');
                                getListData();
                                $uibModalInstance.close();
                            }, function (err) {
                                console.log(err);
                                toastr.error(err.data.message, 'Error');
                            })
                        }
                    }
                });
            }


            function getListData() {
                getFilterToLocalStorage();
                Categories.query(getOptionsQuery(), function (data) {
                    $scope.categories = data.items;
                    $scope.totalItems = data.totalItems;
                    $scope.itemsPerPage = data.itemsPerPage;
                    $scope.totalPage = data.totalPage;
                    $scope.numberVisiblePages = data.numberVisiblePages;
                });
            }

            function reset() {
                $scope.query.name = null;
                $scope.query.status = null;
                $scope.currentPage = 1;
                setFilterToLocalStorage();
                getListData();
            };

            function filter() {
                setPage(1);
                setFilterToLocalStorage();
                getListData();
            }

            function getFilterToLocalStorage() {
                var filterData = localStorageService.get(localStorageName);
                if (!$.isEmptyObject(filterData)) {
                    $scope.currentPage = Number.isInteger(filterData.currentPage) ? Number(filterData.currentPage) : 1;
                    $scope.query.name = filterData.name;
                    $scope.query.status = Number.isInteger(filterData.status) ? Number(filterData.status) : null;
                    $scope.type = $stateParams.type;
                }
            }

            function setFilterToLocalStorage() {
                localStorageService.set(localStorageName, {
                    currentPage: $scope.currentPage,
                    name: $scope.query.name,
                    status: $scope.query.status,
                    type: $stateParams.type
                });
            }

            function setPage(pageNo) {
                $scope.currentPage = pageNo;
            };

            function getOptionsQuery() {
                var options = {
                    page: $scope.currentPage,
                    name: $scope.query.name,
                    status: $scope.query.status,
                    type: $stateParams.type
                };
                return options;
            }

            function pageChanged(page) {
                setPage(page);
                setFilterToLocalStorage();
                getListData();
            }
        }
    ]);
