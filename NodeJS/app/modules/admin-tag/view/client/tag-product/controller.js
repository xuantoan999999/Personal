var tagProductCtrl = (function () {
	'use strict';

	angular
		.module('bzTag')
		.controller('tagProductCtrl', tagProductCtrl);

	function tagProductCtrl($scope, $window, $state, $stateParams, $bzPopup, $uibModal,
		userRoles, authSvc, NgTableParams, ngTableEventsChannel, bzResourceSvc, tagSvc, productSvc, $filter) {
		/* jshint validthis: true */
		var vmTagProduct = this;

		/*XÉT QUYỀN TRUY CẬP ROUTER*/
		if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('tag', 'view')))) {
			$state.go('error403');
		}
		/*END XÉT QUYỀN TRUY CẬP ROUTER*/

		// Vars
		vmTagProduct.loading = true;
		vmTagProduct.selectedItems = [];
		vmTagProduct.queryParams = $stateParams;
		vmTagProduct.keyword = $stateParams.tag || '';
		vmTagProduct.userRoles = userRoles;
		vmTagProduct.formData = {};
		vmTagProduct.lockFOrm = false;
		vmTagProduct.submitted = false;
		vmTagProduct.optionTimePicker = {
			timePicker: true,
			timePickerIncrement: 30,
			singleDatePicker: false,
			locale: {
				format: 'h:ss DD/MM/YYYY'
			}
		};
		vmTagProduct.expire_date = $stateParams.expire ? $stateParams.expire : null;


		// Methods
		vmTagProduct.filter = filter;
		vmTagProduct.filterReset = filterReset;
		vmTagProduct.saveProduct = saveProduct;
		vmTagProduct.deleteProduct = deleteProduct;
		vmTagProduct.showForm = showForm;
		vmTagProduct.getListTag = getListTag;
		vmTagProduct.updateOrder = updateOrder;
		vmTagProduct.editExpire = editExpire;
		vmTagProduct.filterExpireDate = filterExpireDate;


		// Init
		getTagProduct();
		getListTag(vmTagProduct.keyword);

		function getTagProduct() {
			bzResourceSvc.api($window.settings.services.admin + '/tag')
				.get(vmTagProduct.queryParams, function (resp) {
					vmTagProduct.tagProduct = resp.items;
				});
		}

		function filterExpireDate(expire_date_product) {
			if (vmTagProduct.expire_date) {
				var end = moment(expire_date_product.endDate);
				var expire_date = moment(vmTagProduct.expire_date).subtract(1, 'days').endOf('day');
				if (end.isAfter(expire_date))
					return false;
				else
					return true;
			}
			else
				return true;
		}
		function getListTag(keyword) {
			vmTagProduct.tags = [];
			if (keyword) {
				//Lấy 1 tag
				tagSvc.get(keyword).then(function (resp) {
					vmTagProduct.tags.push(resp);
					vmTagProduct.tags.forEach(function (item, index) {
						let id_tag = item._id;
						let type_tag = item.type;
						//lấy list sản phẩm ko thuộc id tag đổ ra formData
						tagSvc.getListProduct(id_tag, type_tag).then(function (resp) {
							item.products = resp.data;
						});

						//lấy list sản phẩm theo id tag đổ ra table
						tagSvc.getProductByTag(id_tag, type_tag, vmTagProduct.expire_date).then(function (resp) {
							if (resp.data) {
								resp.data.forEach(function (product, i) {
									var tag_product = {}
									product.tag_product.forEach(function (tag) {
										if (id_tag == tag.id_tag) {
											tag_product = tag;
										}
									});
									product.tag_product = tag_product;
								});

								item.table = resp.data;
							}


						});
					});
				});
			}
			else {
				//Lấy nhiều tag
				bzResourceSvc.api($window.settings.services.admin + '/tag')
					.get(vmTagProduct.queryParams, function (resp) {
						vmTagProduct.tags = resp.items;
						vmTagProduct.tags.forEach(function (item, index) {
							let id_tag = item._id;
							let type_tag = item.type;
							//lấy list sản phẩm ko thuộc id tag đổ ra formData
							tagSvc.getListProduct(id_tag, type_tag).then(function (resp) {
								item.products = resp.data;
							});

							//lấy list sản phẩm theo id tag đổ ra table
							tagSvc.getProductByTag(id_tag, type_tag, vmTagProduct.expire_date).then(function (resp) {
								if (resp.data) {
									resp.data.forEach(function (product, i) {
										var tag_product = {}
										product.tag_product.forEach(function (tag) {
											if (id_tag == tag.id_tag) {
												tag_product = tag;
											}

										});
										product.tag_product = tag_product;
									});
									item.table = resp.data;
								}
							});
						});
					});
			}

		}

		function filter(keyword) {
			var expire = vmTagProduct.expire_date ? vmTagProduct.expire_date : null;
			if (expire) {
				expire = moment(expire).format('MM-DD-YYYY');
				if (expire.format() == 'Invalid Date')
					expire = null;
			}
			$state.go('.', {
				tag: keyword,
				expire: expire
			}).then(function () {
				$state.reload();
			});
		}


		function filterReset() {
			$state.go('.', {
				tag: null,
				expire: null
			}, { notify: false })
				.then(function () {
					$state.reload();
				});
		}
		function checkCategory(product, tag) {
			var count = 0;
			var t = true;
			if (product.category_list.length > 0) {

				product.category_list.forEach(function (product_category) {
					count = 0;
					tag.table.forEach(function (value) {

						value.category_list.forEach(function (list_category) {
							var product_cate_nin_table = product_category.parent_category || product_category;
							var product_cate_in_table = list_category.parent_category || list_category;
							if (product_cate_nin_table._id == product_cate_in_table._id) {
								count = count + 1;
							}
						});

					});
					if (count >= 12)
						t = false;
				});

			} else {
				return true;
			}
			return t;
		}

		function saveProduct(isValid, tag) {
			vmTagProduct.submitted = true;
			vmTagProduct.lockForm = true;
			if (isValid) {
				var tagProduct = {
					id_tag: tag._id,
					expire_date: tag.formData.expire_date
				};
				var idProducts = tag.formData.idProducts;
				for (var i = 0; i < idProducts.length; i++) {
					var idProduct = idProducts[i];

					//lấy ra sản phẩm theo id
					tagSvc.getProductById(idProduct).then(function (resp) {
						var product = resp;
						//check category sản phẩm có lớn hơn 12 ko?

						product.tag_product.push(tagProduct);
						productSvc.updateTag({ data: product }).then(function (resp) {
							$bzPopup.toastr({
								type: 'success',
								data: {
									title: 'Thành công',
									message: 'Thêm sản phẩm ' + product.name + ' thành công'
								}
							});
							$state.reload();
						}).catch(function (error) {
							$bzPopup.toastr({
								type: 'error',
								data: {
									title: 'Thất bại',
									message: error.data.message
								}
							});
						});
					});
				}

			}
			else {
				vmTagProduct.submitted = true;
				vmTagProduct.lockForm = false;
			}
		}

		function updateOrder(data, product, id_tag, order_product) {
			tagSvc.getProductById(product._id).then(function (resp) {
				var index = 0;
				var p = resp.tag_product.find(function (item, key) {
					index = key;
					return item.id_tag == id_tag;
				});
				resp.tag_product[index].order = order_product;
				productSvc.updateTag({ data: resp }).then(function (resp) {
					$state.reload();
				});
			});

		}

		function deleteProduct(product, id_tag) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'assets/global/message/view.html',
				controller: function ($scope, $uibModalInstance) {
					$scope.popTitle = 'Xóa';
					$scope.message = 'Bạn chắc chắn sẽ xóa dữ liệu này?';
					$scope.ok = function () {
						// Search index tag
						tagSvc.getProductById(product._id).then(function (resp) {
							var index = 0;
							var p = resp.tag_product.find(function (item, key) {
								index = key;
								return item.id_tag == id_tag;
							});
							resp.tag_product.splice(index, 1);
							productSvc.updateTag({ data: resp }).then(function (resp) {
								$bzPopup.toastr({
									type: 'success',
									data: {
										title: 'Thành công',
										message: 'Xóa nhãn thành công.'
									}
								});
								$state.reload();
								$uibModalInstance.close();
							}).catch(function (error) {
								$bzPopup.toastr({
									type: 'error',
									data: {
										title: 'aaa',
										message: error.data.message
									}
								});
								$uibModalInstance.close();
							});
						});



					};
				}
			});
		}

		function showForm(item) {
			if (typeof item.showForm == "undefined")
				item.showForm = true;
			else {
				item.showForm = !item.showForm;
			}
		}

		function editExpire(product, id_tag) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'modules/admin-tag/view/client/popup/edit-tag-product/view.html',
				controller: 'updatetagProduct',
				resolve: {
					data: function () {
						return angular.copy({ product: product, id_tag: id_tag, optionTimePicker: vmTagProduct.optionTimePicker });
					}
				}
			});

			modalInstance.result.then(function (newData) {
				tagSvc.getProductById(product._id).then(function (resp) {
					var index = 0;
					var p = resp.tag_product.find(function (item, key) {
						index = key;
						return item.id_tag == id_tag;
					});
					//update tag data
					resp.tag_product[index] = newData;

					productSvc.updateTag({ data: resp }).then(function (resp) {
						$bzPopup.toastr({
							type: 'success',
							data: {
								title: 'Thành công',
								message: 'Cập nhật nhãn thành công.'
							}
						});
						$state.reload();
						$uibModalInstance.close();
					}).catch(function (error) {
						$bzPopup.toastr({
							type: 'error',
							data: {
								title: 'Cập nhật nhãn',
								message: error.data.message
							}
						});
						$uibModalInstance.close();
					});
				});
			}, function () {
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