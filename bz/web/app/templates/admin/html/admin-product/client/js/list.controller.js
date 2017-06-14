'use strict';

// Products controller
angular.module('products').controller('ProductsListController',
    ['$scope', '$stateParams', '$location', '$window', '$uibModal', 'Option', 'Authentication', 'Products', 'localStorageService', 'toastr', 'productSvc',
        function ($scope, $stateParams, $location, $window, $uibModal, Option, Authentication, Products, localStorageService, toastr, productSvc) {
            // Variable
            $scope.authentication = Authentication;
            if (!Authentication.isAdmin) {
                $location.path('signin');
            }
            $scope.types = Option.getTypes();
            $scope.statuses = Option.getStatusDefault();
            // $scope.gotoList = function () {
            //     $location.path('categories');
            // }
            var type = $stateParams.type ? $stateParams.type : 'XE';
            var localStorageName = "product" + type + ".filterData";
            $scope.url = $window.settings.services.webUrl + '/files/product/';
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
            function remove(product) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '/templates/admin-core/popupMessage.html',
                    resolve: {
                        vmProduct: function () {
                            return $scope;
                        }
                    },
                    controller: function ($scope, $uibModalInstance, vmProduct) {
                        $scope.popTitle = 'Cập nhật';
                        $scope.message = 'Bạn có muốn xóa sản phẩm này?';

                        $scope.ok = function () {
                            console.log("gdmsg sdmg msd");
                            var product_del = Products.get({
                                productId: product._id
                            });

                            product_del.$remove({
                                productId: product._id
                            }, function (resp) {
                                toastr.success("Delete user success!", "Success");
                                $uibModalInstance.close();
                                getListData();
                            }, function (err) {
                                console.log(err);
                                toastr.error(err.data.message, 'Error');
                            });
                        }
                    }
                });
            };

            function changeStatus(product) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '/templates/admin-core/popupMessage.html',
                    resolve: {
                        vmProduct: function () {
                            return $scope;
                        }
                    },
                    controller: function ($scope, $uibModalInstance, vmProduct) {
                        var text_status = product.status == 1 ? 'unpublish' : 'publish';
                        var type_product = type_product == 'XE' ? 'xe' : 'sản phẩm';
                        $scope.popTitle = 'Cập nhật';
                        $scope.message = 'Bạn có muốn ' + text_status + ' trạng thái của ' + type_product + ' này?';

                        $scope.ok = function () {
                            product.status = product.status == 1 ? 0 : 1;
                            var update_product = new Products(product);
                            update_product.$update(function (resp) {
                                toastr.success("Cập nhật thành công", 'Thành công');
                                getListData();
                                $uibModalInstance.close();
                            }, function (err) {
                                console.log(err);
                                toastr.error(err.data.message, 'Error');
                            });
                        }
                    }
                });
            }

            function getListData() {
                getFilterToLocalStorage();
                Products.query(getOptionsQuery(), function (data) {
                    $scope.products = data.items;
                    $scope.totalItems = data.totalItems;
                    $scope.itemsPerPage = data.itemsPerPage;
                    $scope.totalPage = data.totalPage;
                    $scope.numberVisiblePages = data.numberVisiblePages;
                });
                productSvc.getListModel(function (data) {
                    $scope.listModel = data.items;
                });
                productSvc.getListBrand(function (data) {
                    $scope.listBrand = data.items;
                })
                productSvc.getListSuplier(function (data) {
                    $scope.listSuplier = data.items;
                })
            }

            function reset() {
                $scope.query.name = null;
                $scope.query.status = null;
                $scope.query.brand = null;
                $scope.query.supplier = null;
                $scope.query.age_car = null;
                $scope.query.model = null;

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
                    $scope.query.brand = filterData.brand;
                    $scope.query.supplier = filterData.supplier;
                    $scope.query.age_car = filterData.age_car;
                    $scope.query.model = filterData.model;
                }
            }

            function setFilterToLocalStorage() {
                localStorageService.set(localStorageName, {
                    currentPage: $scope.currentPage,
                    name: $scope.query.name,
                    status: $scope.query.status,
                    type: type,
                    brand: $scope.query.brand,
                    supplier: $scope.query.supplier,
                    age_car: $scope.query.age_car,
                    model: $scope.query.model,
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
                    type: type,
                    brand: $scope.query.brand,
                    supplier: $scope.query.supplier,
                    age_car: $scope.query.age_car,
                    model: $scope.query.model,
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
