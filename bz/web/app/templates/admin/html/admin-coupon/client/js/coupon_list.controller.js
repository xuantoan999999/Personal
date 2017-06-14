'use strict';

// Coupons controller
angular.module('coupons').controller('CouponListController', ['$rootScope', '$scope', '$uibModal', '$log', '$stateParams', '$location', '$state', 'Authentication', 'Coupons', 'Option', '$sce', '$timeout', 'localStorageService', 'toastr',

    function ($rootScope, $scope, $uibModal, $log, $stateParams, $location, $state, Authentication, Coupons, Option, $sce, $timeout, localStorageService, toastr, ) {

        if (!Authentication.isAdmin) {
            $location.path('signin');
        }
        var localStorageName = "coupon.filterData";
        $scope.search = {};
        $scope.isLoading = false;
        $scope.currentPage = 1;
        $scope.rowsSelected = {};
        $scope.setPage = setPage;
        $scope.pageChanged = pageChanged;
        $scope.find = find;
        $scope.remove = remove;
        $scope.sellectAll = sellectAll;
        $scope.filter = filter;
        $scope.changeStatusCoupon = changeStatusCoupon;

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
            filter();
        };

        function getOptionsQuery() {
            var options = {
                page: $scope.currentPage,
                keyword: $scope.search.keyword,
                status: $scope.search.status,
            };
            return options;
        }

        function setScopeAfterQuery(data) {
            $scope.coupons = data.items;
            $scope.totalItems = data.totalItems;
            $scope.totalPage = data.totalPage;
            $scope.itemsPerPage = data.itemsPerPage;
            $scope.numberVisiblePages = data.numberVisiblePages;
        }

        function getListData() {

            showLoading();
            // Reset selected row
            $scope.rowsSelected = {};

            Coupons
                .query(getOptionsQuery(), function (data) {
                    setScopeAfterQuery(data);
                    setFilterParams();
                    hideLoading();
                });
        }

        function setFilterParams() {
            angular.extend($scope.search, $stateParams);
        }


        // Find a list of Posts
        function find() {
            setFilterParams();
            getListData();
        };

        function filter() {
            $state.go('.', getOptionsQuery())
                .then(function () {
                    $state.reload();
                });
        };
        //reset
        $scope.reset = function () {
            $scope.search.keyword = "";
            $scope.search.type = "";
            $scope.search.status = "";
            $scope.currentPage = 1;
            $state.go('.', getOptionsQuery())
                .then(function () {
                    $state.reload();
                });
        };

        // Remove Function
        function remove(couponId) {
            $scope.couponId = couponId;
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/templates/admin-core/popupMessage.html',
                resolve: {
                    vmCoupons: function () {
                        return $scope;
                    }
                },
                controller: function ($scope, $uibModalInstance, vmCoupons) {
                    $scope.popTitle = 'Xác nhận xoá'
                    $scope.message = 'Bạn chắc chắn xoá coupon?';

                    $scope.ok = function () {
                        // Check User is trash
                        var couponId = vmCoupons.couponId;
                        var coupon = Coupons.get({
                            couponId: couponId
                        });
                        coupon.$remove({
                            couponId: couponId
                        });
                        toastr.success("Thành công!", "Xoá coupon");
                        $uibModalInstance.close();

                        for (var i in vmCoupons.coupons) {
                            if (vmCoupons.coupons[i]._id === couponId) {
                                vmCoupons.coupons.splice(i, 1);
                            }
                        }

                        if ($stateParams.couponId) {
                            vmCoupons.gotoList();
                        }
                        vmCoupons.currentUserId = null;
                    }
                }
            });
        };

        // Change status
        function changeStatusCoupon(coupon) {
            coupon = JSON.parse(JSON.stringify(coupon));
            status = coupon.status;
            if (status == 1) {
                $scope.confirmMessage = $sce.trustAsHtml("Đổi trạng thái khuyến mãi <b>Publish</b> thành <b>Unpublish</b>?");
            } else {
                $scope.confirmMessage = $sce.trustAsHtml("Đổi trạng thái khuyến mãi <b>Unpublish</b> thành <b>Publish</b>?");
            }

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/templates/admin-core/popupMessage.html',
                resolve: {
                    vmCoupon: function () {
                        return $scope;
                    },
                },
                controller: function ($scope, $uibModalInstance, vmCoupon) {
                    $scope.popTitle = 'Cập nhật';
                    $scope.message = vmCoupon.confirmMessage;

                    $scope.ok = function () {
                        if (status == 1) coupon.status = 0;
                        else coupon.status = 1;
                        var couponFac = new Coupons(coupon);
                        couponFac.$update({
                            id: coupon._id,
                        }, function (response) {
                            $state.reload();
                            toastr.success('Cập nhật trang thái thành công', "Success");
                            $uibModalInstance.close();
                        },
                            function error(err) {
                                toastr.error('Thử lại sau', "Cập nhật trang thái thất bại");
                                $uibModalInstance.close();
                            });
                    }
                }
            });
        }

        function sellectAll() {
            var rowsSelected = {};
            if ($scope.selectAll) {
                var coupons = $scope.coupons;
                coupons.forEach(function (coupon) {
                    rowsSelected[coupon._id] = true;
                });
                console.log(rowsSelected);
            }
            $scope.rowsSelected = rowsSelected;
        }
    }
]);