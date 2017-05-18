var couponGroupCtrl = (function () {
	'use strict';

	angular
		.module('bzCoupon')
		.controller('couponGroupCtrl', couponGroupCtrl);

	function couponGroupCtrl($scope, $window, $state, $stateParams, $bzPopup, $uibModal,
		userRoles, authSvc, NgTableParams, ngTableEventsChannel, bzResourceSvc, couponSvc) {
		/* jshint validthis: true */
		var vmCPG = this;

		/*XÉT QUYỀN TRUY CẬP ROUTER*/
		if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('coupon', 'view')))) {
			$state.go('error403');
		}

		vmCPG.showBtnAdd = authSvc.hasPermission('coupon', 'add');
		vmCPG.showBtnEdit = authSvc.hasPermission('coupon', ['add', 'edit']);
		vmCPG.showBtnDelete = authSvc.hasPermission('coupon', 'delete');
		/*END XÉT QUYỀN TRUY CẬP ROUTER*/

		// Vars
		vmCPG.loading = true;
		vmCPG.selectedItems = [];
		vmCPG.queryParams = $stateParams;
		vmCPG.keyword = $stateParams.keyword;
		vmCPG.userRoles = userRoles;
		vmCPG.coupons = [];

		// Methods
		vmCPG.filter = filter;
		vmCPG.filterReset = filterReset;
		vmCPG.sort = sort;
		vmCPG.remove = remove;
		vmCPG.exportExcel = exportExcel;
		vmCPG.selectAll = selectAll;
		vmCPG.sumOrder = sumOrder;

		// Init
		getData();

		ngTableEventsChannel.onPagesChanged(function () {
			$scope.vmCPG.queryParams.page = vmCPG.table.page();
			$state.go('.', $scope.vmCPG.queryParams);
		}, $scope, vmCPG.table);

		function getData() {
			couponSvc.getAll(vmCPG.queryParams, 'group').then(function (resp) {
				vmCPG.queryParams.pageCount = resp.totalPage;
				vmCPG.totalItems = resp.totalItems;
				vmCPG.coupons = resp.items;

				vmCPG.table = new NgTableParams({ count: 20 }, {
					counts: [],
					getData: function (params) {
						params.total(resp.totalItems);
						return vmCPG.coupons;
					}
				});
				vmCPG.table.page(vmCPG.queryParams.page);
				vmCPG.loading = false;
			})
		}

		function filter(keyword) {
			$state.go('.', {
				keyword: keyword,
				page: vmCPG.queryParams.page,
			}).then(function () {
				$state.reload();
			});
		}

		function filterReset() {
			$state.go('.', {
				keyword: null,
				page: vmCPG.queryParams.page,
				// publish: null,
				// cateid: null,
				// limit: settingJs.admin.itemPerPage
			}, { notify: false })
				.then(function () {
					$state.reload();
				});
		}

		function sort(id, value) {
			$bzPopup.toastr({
				type: 'success',
				data: {
					title: 'Cập nhật',
					message: 'Cập nhật thứ tự phiếu mua hàng thành công!'
				}
			});
		}

		function remove(id) {
			var selected = { ids: [id] }; //id ? {ids: [id]} : getSelectedIds();

			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'assets/global/message/view.html',
				controller: function ($scope, $uibModalInstance) {
					$scope.popTitle = 'Xóa';
					$scope.message = 'Bạn chắc chắn sẽ xóa dữ liệu này?';
					$scope.ok = function () {
						bzResourceSvc.api($window.settings.services.admin + '/coupon/:id', { id: '@id' })
							.delete({ id: selected.ids }, function (resp) {
								$bzPopup.toastr({
									type: 'success',
									data: {
										title: 'Xóa',
										message: 'Xóa phiếu mua hàng thành công!'
									}
								});
								$state.reload();
								$uibModalInstance.close();
							});
					};
				}
			});
		}

		function exportExcel() {
			vmCPG.btnExport = true;
			var data = [[
				'Mã Coupon Group', 'Mã coupon'
			]];
			var options = {
				type: 'xlsx',
				sheetName: 'SheetJS1',
				fileName: 'Coupon Group',
			};
			var query = (JSON.parse(JSON.stringify(vmCPG.queryParams)));
			query.limit = vmCPG.totalItems;
			query.page = 1;

			vmCPG.coupons.forEach(function (item) {
				if (item.value_checkbox) {
					item.code_group.forEach(function (item_group) {
						data.push([item.code, item_group.code]);
					})
				}
			});
			if (data.length == 1) {
				$bzPopup.toastr({
					type: 'error',
					data: {
						title: 'Chưa chọn mã giảm giá!',
						message: 'Vui lòng chọn mã giảm giá bạn muốn xuất!'
					}
				});
			}
			else {
				ExcelJs.exportExcel(data, options);
			}
			vmCPG.btnExport = false;
		}

		function selectAll() {
			vmCPG.coupons.forEach(function (item) {
				item.value_checkbox = vmCPG.checkbox.selectAll;
			});
		}

		function sumOrder(coupon) {
			var sum = 0;
			coupon.order_group.forEach(function (item) {
				if (Array.isArray(item)) {
					sum += item.length;
				}
				else {
					sum++;
				}
			})
			return sum;
		}
	}

	var resolve = {
		/* @ngInject */
		preload: function (bzPreloadSvc) {
			return bzPreloadSvc.load([]);
		}
	};

	return {
		resolve: resolve
	};
})();