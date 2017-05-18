var promotionEditCtrl = (function () {
	'use strict';

	angular
		.module('bzPromotion')
		.controller('promotionEditCtrl', promotionEditCtrl);

	function promotionEditCtrl($scope, $state, $stateParams, $bzPopup, $window, $timeout, authSvc, promotionSvc) {
		var vmPoE = this;

		/*XÉT QUYỀN TRUY CẬP ROUTER*/
		if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('promotion', ['add', 'edit'])))) {
			$state.go('error403');
		}
		/*END XÉT QUYỀN TRUY CẬP ROUTER*/
		// Vars
		vmPoE.loading = true;
		vmPoE.queryParams = $stateParams;
		var dateTimePickerOpt = {
			singleDatePicker: false
		};

		// Methods
		vmPoE.submit = submit;
		vmPoE.removeDisabled = removeDisabled;

		// Init
		getData();

		/*FUNCTION*/
		// Start: Create default data
		function getData() {
			promotionSvc.edit(vmPoE.queryParams.id).then(function (resp) {
				vmPoE.prom = resp.prom;
				var textDateTime = '';
				if (vmPoE.prom.expire_date) {
					var startDate = moment(vmPoE.prom.expire_date.startDate).format('DD/MM/YYYY');
					var endDate = moment(vmPoE.prom.expire_date.endDate).format('DD/MM/YYYY');
					angular.extend(dateTimePickerOpt, {
						startDate: startDate,
						endDate: endDate,
					});
					textDateTime = startDate + ' - ' + endDate;
				}
				vmPoE.dateTimePickerOpt = dateTimePickerOpt;
				$timeout(function () {
					angular.element('#datetime-picker').val(textDateTime);
				}, 10);
				vmPoE.listProm = resp.listProm;
				vmPoE.listProduct = resp.products;
				vmPoE.product_apply = vmPoE.prom.product.map(function (item) {
					return item._id;
				});
				vmPoE.loading = false;
			}).catch(function (error) {
				console.error(error);
				$bzPopup.toastr({
					type: 'error',
					data: {
						title: 'Lỗi!',
						message: 'Có vấn đề! Hãy thử tải lại trang.'
					}
				});
			});
		}
		// End: Create default data

		// Submit promotion
		function submit(form) {
			if (!form.$valid) {
				$bzPopup.toastr({
					type: 'error',
					data: {
						title: 'Lỗi!',
						message: 'Vui lòng điền đầy đủ thông tin!'
					}
				});
				return;
			};
			vmPoE.promExist = vmPoE.listProm.find(function (item) {
				return item.name == vmPoE.prom.name;
			});
			if (vmPoE.promExist) {
				return;
			};
			if (vmPoE.date) {
				vmPoE.prom.expire_date = vmPoE.date;
			}
			promotionSvc.update({
				data: vmPoE.prom,
				product_apply: vmPoE.product_apply
			}, vmPoE.queryParams.id).then(function (resp) {
				$state.go('promotion-list');
				$bzPopup.toastr({
					type: 'success',
					data: {
						title: 'Thành công!',
						message: 'Sửa giảm giá sản phẩm thành công!'
					}
				});
			}).catch(function (error) {
				console.log(error);
				form.$submitted = false;
				$bzPopup.toastr({
					type: 'error',
					data: {
						title: 'Lỗi!',
						message: 'Sửa giảm giá sản phẩm thất bại!'
					}
				});
			});
		}

		function removeDisabled(form) {
			form.$submitted = false;
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