'use strict';

// Orders controller
angular.module('orders').controller('OrderListController', ['$rootScope', '$scope', '$uibModal', '$log', '$stateParams', '$location', '$state', 'Authentication', 'Orders', 'Option', '$sce', '$timeout', 'localStorageService', 'toastr',

    function ($rootScope, $scope, $uibModal, $log, $stateParams, $location, $state, Authentication, Orders, Option, $sce, $timeout, localStorageService, toastr, ) {

        if (!Authentication.isAdmin) {
            $location.path('signin');
        }
        var localStorageName = "order.filterData";
        $scope.orderStatuses = Option.getOrderStatuses();
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
        $scope.OrderStatuses = Option.getOrderStatuses();
        $scope.changeStatusOrder = changeStatusOrder;

        $scope.getOrderStatus = getOrderStatus;

        function getOrderStatus(value) {
            let status = $scope.OrderStatuses.find(function (item) {
                return item.value == value;
            });
            var html = `<label class="link-cusor label ${status.class_color}"> ${status.name}</label>`;
            html = $sce.trustAsHtml(html);
            return html;
        }

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
                type: $scope.search.type
            };
            return options;
        }

        function setScopeAfterQuery(data) {
            $scope.orders = data.items;
            $scope.totalItems = data.totalItems;
            $scope.totalPage = data.totalPage;
            $scope.itemsPerPage = data.itemsPerPage;
            $scope.numberVisiblePages = data.numberVisiblePages;
        }

        function getListData() {

            showLoading();
            // Reset selected row
            $scope.rowsSelected = {};

            Orders
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
        function remove(orderId) {
            $scope.orderId = orderId;
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/templates/admin-core/popupMessage.html',
                resolve: {
                    vmOrders: function () {
                        return $scope;
                    }
                },
                controller: function ($scope, $uibModalInstance, vmOrders) {
                    $scope.popTitle = 'Xác nhận xoá'
                    $scope.message = 'Bạn chắc chắn xoá đơn hàng?';

                    $scope.ok = function () {
                        // Check User is trash
                        var orderId = vmOrders.orderId;
                        var order = Orders.get({
                            orderId: orderId
                        });
                        order.$remove({
                            orderId: orderId
                        });
                        toastr.success("Thành công!", "Xoá đơn hàng");
                        $uibModalInstance.close();

                        for (var i in vmOrders.orders) {
                            if (vmOrders.orders[i]._id === orderId) {
                                vmOrders.orders.splice(i, 1);
                            }
                        }

                        if ($stateParams.orderId) {
                            vmOrders.gotoList();
                        }
                        vmOrders.currentUserId = null;
                    }
                }
            });
        };

        // Change status
        function changeStatusOrder(order) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/templates/admin-order/popup-change-status-order.html',
                resolve: {
                    OrderStatuses: function () {
                        return $scope.OrderStatuses;
                    },
                    order: function () {
                        return JSON.parse(JSON.stringify(order));
                    }
                },
                controller: function ($scope, $uibModalInstance, OrderStatuses, order) {
                    $scope.OrderStatuses = OrderStatuses
                    $scope.order = order

                    $scope.update = function () {
                        var order = new Orders($scope.order);
                        order.$update(function (response) {
                            if (response._id) {
                                toastr.success("Cập nhật trạng thái thành công!", "Thành công");
                                getListData();
                                $uibModalInstance.close();
                            } else {
                                Notice.setNotice(response.message, "ERROR");
                            }
                        }, function (errorResponse) {
                            Notice.setNotice(errorResponse.data.message, "ERROR");
                        });
                    }
                }
            });
        }

        function sellectAll() {
            var rowsSelected = {};
            if ($scope.selectAll) {
                var orders = $scope.orders;
                orders.forEach(function (order) {
                    rowsSelected[order._id] = true;
                });
                console.log(rowsSelected);
            }
            $scope.rowsSelected = rowsSelected;
        }
    }
]);