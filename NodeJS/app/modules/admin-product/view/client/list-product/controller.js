var productListCtrl = (function () {
	'use strict';

	angular
		.module('bzProduct')
		.controller('productListCtrl', productListCtrl);

	function productListCtrl($scope, $state, $stateParams, $bzPopup, $uibModal, $window, bzResourceSvc, NgTableParams, ngTableEventsChannel, authSvc, productSvc, statusProduct) {
		var vmPrL = this;

		/*XÉT QUYỀN TRUY CẬP ROUTER*/
		if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('product', 'view')))) {
			$state.go('error403');
		}

		vmPrL.showBtnAdd = authSvc.hasPermission('product', 'add');
		vmPrL.showBtnEdit = authSvc.hasPermission('product', ['add', 'edit']);
		vmPrL.showBtnDelete = authSvc.hasPermission('product', 'delete');
		/*END XÉT QUYỀN TRUY CẬP ROUTER*/

		// Vars
		vmPrL.loading = true;
		vmPrL.queryParams = $stateParams;
		vmPrL.setting = settingJs;
		vmPrL.urlImg = settingJs.configs.uploadDirectory.thumb_product;
		vmPrL.statusProduct = statusProduct;
		vmPrL.btnExport = false;

		// Methods
		vmPrL.activeProduct = activeProduct;
		vmPrL.deleteProduct = deleteProduct;
		vmPrL.filterForm = filterForm;
		vmPrL.clearFilter = clearFilter;
		vmPrL.dueDate = dueDate;
		vmPrL.formatTag = formatTag;
		vmPrL.checkImgOld = productSvc.checkImgOld;
		vmPrL.exportExcel = exportExcel;

		// Init
		getData();

		function pageChangeFunc() {
			$scope.vmPrL.queryParams.page = vmPrL.table.page();
			$state.go('.', $scope.vmPrL.queryParams);
		}

		ngTableEventsChannel.onPagesChanged(pageChangeFunc, $scope, vmPrL.table);

		/*FUNCTION*/
		function getData() {
			productSvc.getAll(vmPrL.queryParams).then(function (resp) {
				vmPrL.queryParams.pageCount = resp.totalPage;
				vmPrL.totalItems = resp.totalItems;
				vmPrL.list = resp.items;
				vmPrL.categoryList = resp.categoryList;
				vmPrL.optionsCate = formatCategory(resp.categoryWithSub);
				vmPrL.tagList = resp.tagList;
				vmPrL.productBalance = resp.productBalance;
				vmPrL.filterTmp = {
					// status: vmPrL.queryParams.status ? vmPrL.queryParams.status : vmPrL.statusProduct[0].value
					status: vmPrL.queryParams.status
				}

				vmPrL.table = new NgTableParams({
					count: vmPrL.queryParams.limit
				},
					{
						counts: [],
						getData: function (params) {
							params.total(resp.totalItems);
							return vmPrL.list;
						}
					});
				vmPrL.table.page(vmPrL.queryParams.page);
				vmPrL.loading = false;
			});
		}

		// Active / Unactive Product
		function activeProduct(product) {
			product.active = !product.active;
			var textActive = product.active ? 'bỏ công khai' : 'công khai';
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'assets/global/message/view.html',
				controller: function ($scope, $uibModalInstance) {
					$scope.popTitle = '';
					$scope.message = 'Bạn muốn ' + textActive + ' sản phẩm này?';

					$scope.ok = function () {
						productSvc.activeProduct(product._id).then(function (resp) {
							product.active = !product.active;
							$uibModalInstance.close();
						});
					}
				}
			});
		}

		// Delete Product
		function deleteProduct(id, key) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'assets/global/message/view.html',
				controller: function ($scope, $uibModalInstance) {
					$scope.popTitle = 'Xóa ';
					$scope.message = 'Bạn muốn xóa sản phẩm này?';

					$scope.ok = function () {
						productSvc.deleteProduct(id).then(function (resp) {
							if (resp.success) {
								vmPrL.queryParams.page = 1;
								$state.go('.', vmPrL.queryParams).then(function () {
									$state.reload();
									$uibModalInstance.close();

									$bzPopup.toastr({
										type: 'success',
										data: {
											title: 'Thành công!',
											message: 'Xóa sản phẩm thành công!'
										}
									});
								});
							}
						}, function (resp) {
							$bzPopup.toastr({
								type: 'error',
								data: {
									title: 'Lỗi!',
									message: 'Xóa sản phẩm thất bại!'
								}
							});
						});
					}
				}
			});
		}

		function filterForm(form) {
			vmPrL.queryParams.page = 1;
			vmPrL.queryParams.status = vmPrL.filterTmp.status;
			$state.go('.', vmPrL.queryParams).then(function () {
				$state.reload();
			});
		}

		function clearFilter() {
			vmPrL.queryParams.name = null;
			vmPrL.queryParams.active = null;
			vmPrL.queryParams.category = null;
			vmPrL.queryParams.status = null;
			vmPrL.queryParams.tag = null;
			vmPrL.queryParams.dueDate = null;
			$state.go('.', vmPrL.queryParams).then(function () {
				$state.reload();
			});
		}

		function dueDate(end_date) {
			if (end_date) {
				var today = moment();
				end_date = moment(end_date);
				return moment(today).isBefore(end_date);
			}
		}

		function formatTag(product) {
			return product.tag_processing.concat(product.tag_product);
		}

		function formatCategory(categories) {
			var options = [];
			var createSub = function (category, cates) {
				cates.push(category);
				if (category.sub_category && category.sub_category.length > 0) {
					category.sub_category.forEach(function (sub) {
						return createSub(sub, cates);
					})
				}
				return cates;
			}

			categories.forEach(function (category) {
				var array = createSub(category, []);
				category.sub_cate = array.splice(1);
				options.push(category);
			})
			return options;
		}

		function convertHtml(str) {
			return $('<div />').html(str.replace(/(<([^>]+)>)/g, "")).text()
		}

		// Export Excel
		function exportExcel(detail) {
			vmPrL.btnExport = true;
			if (detail) {
				var data = [[
					'Tên sản phẩm', 'Danh mục', 'Danh mục con', 'Đơn vị', 'Publish', 'Trạng thái', 'Mô tả ngắn', 'Thông tin chi tiết'
				]];
			}
			else {
				var data = [[
					'STT', 'Tên sản phẩm', 'Đơn giá', 'Giá khuyến mãi', 'Danh mục', 'Danh mục con', 'Đơn vị', 'Đơn vị hiển thị', 'Publish',
				]];
			}

			var options = {
				type: 'xlsx',
				sheetName: 'SheetJS1',
				fileName: 'Product',
			};
			var query = (JSON.parse(JSON.stringify(vmPrL.queryParams)));
			query.limit = vmPrL.totalItems;
			query.page = 1;

			productSvc.getAll(query).then(function (resp) {
				resp.items.forEach(function (item, index) {
					var category_txt = '';
					var category_sub_txt = '';
					var list_parent_category = [];
					item.category_list.forEach(function (cate, key) {
						var comma = '';
						if (key != 0) {
							comma += ', ';
						}
						if (cate.parrent_id) {
							var parent_category = productSvc.getCategoryParent(cate);
							if (list_parent_category.indexOf(parent_category.name) == -1) {
								list_parent_category.push(parent_category.name);
								category_txt += comma + parent_category.name;
							}
							category_sub_txt += comma + cate.name;
						}
						else {
							category_txt += comma + cate.name;
						};
					});

					var price_after_coupon = '';
					if (item.promotion) {
						switch (item.promotion.type) {
							case 'PC':
								price_after_coupon = item.price * (100 - item.promotion.value) / 100;
								break;
							case 'MN':
								price_after_coupon = item.price - item.promotion.value;
								break;
						}
					}

					var status_product = '';
					if (item.qty_in_stock == 0) {
						status_product = 'Hết hàng';
					}
					if (0 < item.qty_in_stock && item.qty_in_stock <= vmPrL.productBalance.value) {
						status_product = 'Sắp hết hàng';
					}
					if (item.qty_in_stock > vmPrL.productBalance.value) {
						status_product = 'Còn hàng';
					}

					if (detail) {
						data.push([
							item.name, category_txt, category_sub_txt, item.unit.name, item.active ? 'Có' : 'Không', status_product,
							convertHtml(item.short_description), convertHtml(item.detail_infor)
						]);
					}
					else {
						data.push([
							index + 1, item.name, item.price, price_after_coupon, category_txt, category_sub_txt, item.unit.name, item.view_unit, item.active ? 'Có' : 'Không',
						]);
					}
				});
				ExcelJs.exportExcel(data, options);
				vmPrL.btnExport = false;
			}).catch(function (error) {
				console.log(error);
				vmPrL.btnExport = false;
				$bzPopup.toastr({
					type: 'error',
					data: {
						title: 'Lỗi!',
						message: 'Xuất Excel thất bại!'
					}
				});
			});

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