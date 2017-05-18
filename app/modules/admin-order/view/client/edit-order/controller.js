var orderEditCtrl = (function () {
	'use strict';

	angular
		.module('bzOrder')
		.controller('orderEditCtrl', orderEditCtrl);

	function orderEditCtrl($scope, $rootScope, $state, $stateParams, $bzPopup, $uibModal, $window, $timeout,
		NgTableParams, ngTableEventsChannel, authSvc, bzResourceSvc, orderSvc, userSvc, statusOrderList, shipperList, productSvc, listVocative) {
		var vmOrE = this;

		/*XÉT QUYỀN TRUY CẬP ROUTER*/
		if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('order', ['add', 'edit'])))) {
			$state.go('error403');
		}
		/*END XÉT QUYỀN TRUY CẬP ROUTER*/

		// Vars
		vmOrE.loading = true;
		vmOrE.queryParams = $stateParams;
		vmOrE.statusOrderList = statusOrderList;
		vmOrE.urlImg = settingJs.configs.uploadDirectory.thumb_product;
		vmOrE.shipperList = shipperList;
		vmOrE.freeShip = 'NOT'; // NOT: không được miễn phí, 'Urban': miễn phí nội thành, 'Suburb': miễn phí nội thành
		vmOrE.listVocative = listVocative;
		vmOrE.isFirstOder = false;
		vmOrE.customerSignIn = 'false'; //Khách hàng đã đăng ký hoặc chưa
		vmOrE.listIdCateOnsaleAffternoon = [];
		vmOrE.listCateException = [];
		// Methods
		vmOrE.getDataShippingFee = getDataShippingFee;
		vmOrE.getOrderDetail = getOrderDetail;
		vmOrE.checkCoupon = checkCoupon;
		vmOrE.setPaymentInfo = setPaymentInfo;
		vmOrE.getDataUser = getDataUser;
		vmOrE.editOrder = editOrder;
		vmOrE.setTotalProduct = setTotalProduct;
		vmOrE.enableForm = enableForm;
		vmOrE.checkImgOld = productSvc.checkImgOld;
		vmOrE.onChangeDeleveryType = onChangeDeleveryType;
		vmOrE.onChangeDeleveryType = onChangeDeleveryType;
		vmOrE.updateUserShippingAdress = updateUserShippingAdress;
		vmOrE.checkStatus = checkStatus;
		vmOrE.caculatingOnSaleAffternoon = caculatingOnSaleAffternoon;
		vmOrE.totalNotOnSale = totalNotOnSale;
		// Init
		setConfigsValue();
		getData();


		/*FUNCTION*/
		function getData() {
			orderSvc.edit(vmOrE.queryParams.id).then(function (resp) {
				vmOrE.listCoupon = resp.listCoupon;

				// Start: Format list coupon
				var tmp_arr = [];
				vmOrE.listCoupon.forEach(function (item) {
					if (item.type == "single") {
						tmp_arr.push(item);
					}
					if (item.type == "group") {
						var item_tmp = (JSON.parse(JSON.stringify(item)));
						item.code_group.forEach(function (item_group) {
							angular.extend(item_tmp, item_group);
							var item_group_tmp = (JSON.parse(JSON.stringify(item_tmp)))
							tmp_arr.push(item_group_tmp);
						})
					}
				})
				vmOrE.listCoupon = tmp_arr;
				// End: Format list coupon

				vmOrE.listProduct = resp.listProduct;
				vmOrE.listShippingFee = resp.listShippingFee;
				vmOrE.listUser = resp.listUser;
				vmOrE.order = resp.order;
				if (!vmOrE.order)
					$state.go('error404');
				vmOrE.loading = false;
				checkFirstOrder();
				vmOrE.disabledOrder = resp.order.status == 'CANCEL' ? true : false;

				vmOrE.shippingTmp = {
					fee: vmOrE.order.payment_info.info.shipping_fee ? vmOrE.order.payment_info.info.shipping_fee : 0
				};

				vmOrE.orderDetailTmp = vmOrE.listProduct.map(function (item) {
					var findProduct = vmOrE.order.order_detail.find(function (order) {
						if (!order.product) return null;
						return order.product._id == item._id;
					});
					var promotion = null;
					if (findProduct) {
						promotion = findProduct.id_promote;
					}
					else {
						promotion = item.promotion ? {
							id: item.promotion._id,
							name: item.promotion.name,
							value: item.promotion.value,
							type: item.promotion.type
						} : null;
					}
					var max_product = findProduct ? findProduct.order_quantity : 0;
					return {
						product_obj: item,
						product: item._id,
						order_quantity: findProduct ? findProduct.order_quantity : 1,
						price: findProduct ? findProduct.price : item.price,
						total: findProduct ? findProduct.total : 0,
						id_promote: promotion,
						max_product: max_product + item.qty_in_stock,
					};
				});

				vmOrE.orderTmp = {
					user: vmOrE.order.payment_info.info.user_id,
					shippingAddress: vmOrE.order.payment_info.info.id_shipping_address,
					coupon: vmOrE.listCoupon.find(function (item) {
						return vmOrE.order.id_coupon == item._id;
					}),
					orderDetailProduct: vmOrE.order.order_detail.map(function (item) {
						if (!item.product) return null;
						return item.product._id;
					}),
					status: resp.order.status
				};

				vmOrE.dateTimePickerOpt = {
					defaultDate: moment(vmOrE.order.ship_date).format('DD/MM/YYYY')
				};

				getDataUser();
				if (vmOrE.order.payment_info.info.user_id && vmOrE.userTmp) {
					vmOrE.customerSignIn = 'true'; //Khách hàng đã đăng ký
				}
			}).catch(function (err) {
				console.log('error', err);
			});
		}

		function checkFirstOrder() {
			if (vmOrE.order.payment_info.info.user_id) {
				bzResourceSvc.api($window.settings.services.admin + '/order/' + vmOrE.order.payment_info.info.user_id + '-' + vmOrE.order._id)
					.get({}, function (resp) {
						if (vmOrE.order.old_id == null) // rule chỉ dành cho order site mới
							vmOrE.isFirstOder = resp.success;
					}), function (err) {
						console.log('checkFirstOrder', err);
					};
			}
		}

		// Get data from select User
		function getDataUser(value) {
			var user = vmOrE.orderTmp.user;
			vmOrE.userTmp = vmOrE.listUser.find(function (item) {
				return item._id == user;
			});

			if (vmOrE.userTmp) {
				vmOrE.order.payment_info.info.user_id = vmOrE.userTmp._id;
				vmOrE.order.payment_info.info.email = vmOrE.userTmp.email;
				if (vmOrE.order.payment_info.info.vocative == "" || !vmOrE.order.payment_info.info.vocative)
					vmOrE.order.payment_info.info.vocative = vmOrE.userTmp.vocative;
			}

			// When select from view, refresh select address
			if (value) {
				vmOrE.order.payment_info.info.district = null;
				vmOrE.orderTmp.shippingAddress = null;
			}
			getDataShippingFee();
		}

		// Get data from select coupon
		function checkCoupon(showNoti) {
			if (showNoti == undefined) showNoti = false;
			if (vmOrE.order.id_coupon) {
				let couponTmp = {};
				vmOrE.listCoupon.forEach(function (item) {
					if (vmOrE.order.id_coupon == item._id) {
						couponTmp = item;
					}
				});

				orderSvc.checkCoupon(vmOrE.order, couponTmp.code).then(function (resp) {
					if (resp.success) {
						vmOrE.order.id_coupon = couponTmp._id;
						vmOrE.order.coupon.value = resp.money_coupon;
						vmOrE.order.coupon.code = couponTmp.code;
						vmOrE.order.coupon.name = couponTmp.name;
						if (showNoti)
							$bzPopup.toastr({
								type: 'success',
								data: {
									title: 'Thành công',
									message: 'Đơn hàng đang được giảm ' + vmOrE.order.coupon.value + ' đ'
								}
							});
					}
					else {
						vmOrE.order.id_coupon = null;
						vmOrE.order.coupon.value = 0;
						vmOrE.order.coupon.code = "";
						vmOrE.order.coupon.name = "";

						$bzPopup.toastr({
							type: 'error',
							data: {
								title: 'Mã giảm giá',
								message: resp.err.message
							}
						});
					}
				}).catch(function (err) {
					console.error(resp);
					$bzPopup.toastr({
						type: 'error',
						data: {
							title: 'Mã giảm giá',
							message: resp.err.message
						}
					});
				})
			}
			else {
				vmOrE.order.id_coupon = null;
				vmOrE.order.coupon.value = 0;
				vmOrE.order.coupon.code = "";
				vmOrE.order.coupon.name = "";
			}
		}

		// Set payment info from radio button
		function setPaymentInfo() {
			if (vmOrE.userTmp) {// order của khách hàng đã đăng ký
				var shippingAddressID = vmOrE.order.payment_info.info.id_shipping_address;
				var shippingFeeTmp = vmOrE.userTmp.customer.shipping_address.find(function (item) {
					return shippingAddressID == item._id;
				});
				// console.log(111, shippingFeeTmp)
				if (shippingFeeTmp) {
					vmOrE.order.shipping_fee = shippingFeeTmp.id_shipping_fee || null;

					angular.extend(vmOrE.order.payment_info.info, {
						id_shipping_address: shippingFeeTmp._id,
						full_name: shippingFeeTmp.name,
						phone: shippingFeeTmp.phone,
						address: shippingFeeTmp.address_detail,
						district: shippingFeeTmp.id_shipping_fee.district,
						shipping_fee: shippingFeeTmp.id_shipping_fee.fee
					});
					vmOrE.order.id_shipping_fee = shippingFeeTmp.id_shipping_fee._id;

				}
			}
			// JS fix select does not update view
			$(".fix-select-2-district").each(function () {
				var content = $(this);
				angular.element(document).injector().invoke(function ($compile) {
					var scope = angular.element(content).scope();
					$compile(content)(scope);
				});
			});

			getDataShippingFee();

		}

		// Get data from select district
		function getDataShippingFee() {
			// var id_shipping = vmOrE.order.id_shipping_fee;
			vmOrE.shippingTmp = vmOrE.listShippingFee.find(function (item) {
				return item._id == vmOrE.order.id_shipping_fee;
			});

			if (typeof vmOrE.shippingTmp == 'undefined')
				vmOrE.shippingTmp = {
					fee: vmOrE.order.payment_info.info.shipping_fee ? vmOrE.order.payment_info.info.shipping_fee : 0
				};


			//fix: update new district
			vmOrE.order.payment_info.info.shipping_fee = vmOrE.shippingTmp.fee;
			vmOrE.order.payment_info.info.district = vmOrE.shippingTmp.district;

			//khi chỉnh sửa địa loại giao hàng => cập nhật lại phí ship. 
			if (vmOrE.order.id_shipping_fee != vmOrE.shippingTmp._id)
				vmOrE.order.payment_info.info.shipping_fee = vmOrE.shippingTmp.fee;

			vmOrE.order.id_shipping_fee = vmOrE.shippingTmp ? vmOrE.shippingTmp._id : null;

			// Kiểm tra miễn phí vận chuyển nội ngoại thành
			var totalTemp = ((vmOrE.totalNotOnSale())
				- vmOrE.order.coupon.value
				- ((vmOrE.order.delivery_time == 'CHIEU' && vmOrE.order.old_id == null)
					? ($rootScope.promotionForOrderDeleveryOnAffternoon.type == "PC"
						? (($rootScope.promotionForOrderDeleveryOnAffternoon.value / 100) * vmOrE.caculatingOnSaleAffternoon())
						: $rootScope.promotionForOrderDeleveryOnAffternoon.value) : 0)
				- (vmOrE.isFirstOder ? ($rootScope.promotionForFirstOrder.type == "MN"
					? $rootScope.promotionForFirstOrder.value
					: (($rootScope.promotionForFirstOrder.value / 100) * vmOrE.totalNotOnSale()))
					: 0));

			vmOrE.freeShip = 'NOT'; // reset
			if (vmOrE.order.delivery_type == 'CN' && (vmOrE.order.old_id == null)) { // dành cho giao hàng cá nhân và rule chỉ dành cho order mới
				if (vmOrE.shippingTmp.type == '1' && totalTemp > $rootScope.freeShipUrban.value) {
					vmOrE.freeShip = 'Urban';
					vmOrE.order.payment_info.info.shipping_fee = 0;
				}
				if (vmOrE.shippingTmp.type == '2' && totalTemp > $rootScope.freeShipSuburb.value) {
					vmOrE.order.payment_info.info.shipping_fee = 0;
					vmOrE.freeShip = 'Suburb';
				}
			}

		}

		// Create order detail from select list product
		function getOrderDetail() {
			// Trường hợp thêm mới thì set quantity default là 1;
			// if (vmOrE.orderTmp.orderDetailProduct.length > vmOrE.order.order_detail.length) {
			// 	var newPrd = vmOrE.orderDetailTmp.find(function (order) {
			// 		return order.product === vmOrE.orderTmp.orderDetailProduct[vmOrE.orderTmp.orderDetailProduct.length - 1];
			// 	});
			// 	vmOrE.order.order_detail.push({
			// 		id_promote: newPrd.id_promote,
			// 		order_quantity: 1,
			// 		price: newPrd.price,
			// 		product: newPrd.product,
			// 		product_obj: newPrd.product_obj,
			// 		total: calculateProduct(newPrd.price, newPrd.id_promote, 1)
			// 	});
			// 	setTotalProduct();
			// 	console.log(222, vmOrE.order.order_detail)
			// }
			// else
			{
				vmOrE.order.order_detail = [];
				if (vmOrE.orderTmp.orderDetailProduct) {
					vmOrE.order.order_detail = vmOrE.orderTmp.orderDetailProduct.map(function (product) {
						var findProduct = vmOrE.orderDetailTmp.find(function (order) {
							return order.product === product;
						});
						return findProduct;
					});
				}
			}
		}

		// Calculate from input order quantity
		function setTotalProduct(item) {

			vmOrE.order.total = vmOrE.order.order_detail.reduce(function (sum, item) {
				if (item.id_promote) item.total = calculateProduct(item.price, item.id_promote, item.order_quantity);
				else item.total = calculateProduct(item.price, 0, item.order_quantity);
				var total = isNaN(item.total) ? 0 : item.total;
				return sum + total;
			}, 0);
			checkCoupon();
		}

		// Calculate price product
		function calculateProduct(price, promotion, quantity) {
			if (promotion) {
				if (promotion.type == 'PC') {
					return (price * (100 - promotion.value) / 100) * quantity;
				}
				if (promotion.type == 'MN') {
					return (price - promotion.value) * quantity;
				}
			}
			else
				return price * quantity;
		}

		// Submit form add order
		function editOrder(form) {
			vmOrE.submitted = true;
			if (!form.$valid) {
				$bzPopup.toastr({
					type: 'error',
					data: {
						title: 'Cập nhật đơn hàng',
						message: 'Dữ liệu chưa hợp lệ'
					}
				});
				return;
			}
			vmOrE.order.total_pay = (vmOrE.totalNotOnSale() + (vmOrE.order.payment_info.info.shipping_fee))
				- vmOrE.order.coupon.value
				- ((vmOrE.order.delivery_time == 'CHIEU') ?
					($rootScope.promotionForOrderDeleveryOnAffternoon.type == "PC" ?
						(($rootScope.promotionForOrderDeleveryOnAffternoon.value / 100) * vmOrE.caculatingOnSaleAffternoon())
						: $rootScope.promotionForOrderDeleveryOnAffternoon.value)
					: 0)
				- (vmOrE.isFirstOder ?
					($rootScope.promotionForFirstOrder.type == "MN" ?
						$rootScope.promotionForFirstOrder.value
						: (($rootScope.promotionForFirstOrder.value / 100) * vmOrE.totalNotOnSale())) : 0);

			if (vmOrE.order.id_coupon != "" && vmOrE.order.id_coupon) {
				let couponTmp = {};
				vmOrE.listCoupon.forEach(function (item) {
					if (vmOrE.order.id_coupon == item._id) {
						couponTmp = item;
					}
				});
				orderSvc.checkCoupon(vmOrE.order, couponTmp.code).then(function (resp) {
					if (resp.success) {
						update();
					}
					else {
						vmOrE.order.id_coupon = null;
						vmOrE.order.coupon.value = 0;
						vmOrE.order.coupon.code = "";
						vmOrE.order.coupon.name = "";
						// console.log(2222, resp)
						$bzPopup.toastr({
							type: 'error',
							data: {
								title: 'Mã giảm giá',
								message: resp.err.message
							}
						});
					}
				}).catch(function (err) {
					console.log(111, err);
				})
			}
			else {
				update();
			}
		}


		// send data update to sever
		function update() {
			orderSvc.update({
				order: vmOrE.order,
				coupon: vmOrE.orderTmp.coupon
			}, vmOrE.order._id).then(function (resp) {
				vmOrE.submitted = false;
				if (resp.success) {
					$bzPopup.toastr({
						type: 'success',
						data: {
							title: 'Thành công!',
							message: 'Cập nhật đơn hàng thành công!'
						}
					});
					$state.go('order-list');
				}
				else {
					vmOrE.submitted = false;
					$bzPopup.toastr({
						type: 'error',
						data: {
							title: 'Lỗi!',
							message: resp.message
						}
					});
				}
			}, function (err) {
				console.log(err);
				$bzPopup.toastr({
					type: 'error',
					data: {
						title: 'Lỗi!',
						message: err.message
					}
				});
				vmOrE.submitted = false;
			});
		}

		// Enable submit button
		function enableForm(form) {
			if (form) {
				vmOrE.submitted = false;
			}
		}

		function onChangeDeleveryType() {
			if (vmOrE.order.delivery_type == 'CT') {//Công ty
				vmOrE.order.payment_info.info.shipping_fee = 0;
			} else {
				getDataShippingFee();
			}
		}

		function updateUserShippingAdress(form) {
			if (vmOrE.order.payment_info.info.user_id && form.$valid) {
				var infoOrder = vmOrE.order.payment_info.info;
				var newInfo = {
					id_shipping_fee: vmOrE.order.id_shipping_fee,
					name: infoOrder.full_name,
					phone: infoOrder.phone,
					vocative: infoOrder.vocative,
					address_detail: infoOrder.address,
				}

				//get user
				bzResourceSvc.api($window.settings.services.apiUrl + '/user/:id', { id: '@id' })
					.get({ id: vmOrE.order.payment_info.info.user_id }, function (resp) {
						var user = resp;

						delete user.__v;
						delete user.password_token;
						delete user.created;
						delete user.provider;
						delete user.activeToken;

						user.cfpassword = user.password;
						if (!user.dob)
							user.dob = '';

						user.customer.shipping_address.forEach(function (info, index) {
							if (info._id == vmOrE.order.payment_info.info.id_shipping_address) {
								//check data if has modify
								var old = user.customer.shipping_address[index];
								angular.extend(user.customer.shipping_address[index], newInfo);
								if (angular.equals(user.customer.shipping_address[index], old)) {
									userSvc.update(user, user._id).then(function (resp) {
										vmOrE.userTmp.customer.shipping_address.forEach(function (item, i) {
											if (infoOrder.id_shipping_address == item._id) {
												angular.extend(vmOrE.userTmp.customer.shipping_address[i], newInfo);
											}
										});
									}).catch(function (err) {
										$bzPopup.toastr({
											type: 'error',
											data: {
												title: 'Cập nhật địa chỉ giao hàng!',
												message: resp.data.message
											}
										});
									});
								}
							}
						})
					}, function (err) {
						$bzPopup.toastr({
							type: 'error',
							data: {
								title: 'Cập nhật địa chỉ giao hàng!',
								message: 'Không thể thấy tài khoản'
							}
						});
					});

			}
		}

		function setConfigsValue() {
			bzResourceSvc.api($window.settings.services.admin + '/configs')
				.get({}, function (resp) {
					$rootScope.promotionForOrderDeleveryOnAffternoon = resp.OrderDeleveryOnAffernoon;
					vmOrE.listIdCateOnsaleAffternoon = $rootScope.promotionForOrderDeleveryOnAffternoon.listCateApply;
					vmOrE.listCateException = $rootScope.promotionForOrderDeleveryOnAffternoon.listCateException;

					$rootScope.promotionForFirstOrder = resp.FirstOrder;
					$rootScope.freeShipUrban = resp.FreeShipConfig.Urban;
					$rootScope.freeShipSuburb = resp.FreeShipConfig.Suburb;
				}), function (err) {
				};
		}

		// Util Intersection two array
		function intersection(a, b) {
			var t;
			if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
			return a.filter(function (e) {
				return b.indexOf(e) > -1;
			});
		}

		function caculatingOnSaleAffternoon() {
			var total_tmp = 0; // tổng các sản phầm thuộc category được áp dụng
			vmOrE.order.order_detail.forEach(function (item, index) {
				var catesProd = null;
				if (typeof item.product === 'object') {
					catesProd = item.product.category.map(function (cat) {
						return ('' + cat);
					});
				}
				if (typeof item.product_obj === 'object') {
					catesProd = item.product_obj.category.map(function (cat) {
						return ('' + cat);
					});
				}
				if (catesProd && intersection(catesProd, vmOrE.listIdCateOnsaleAffternoon).length > 0
								&& 
							((typeof item.id_promote === 'object' && item.id_promote && item.id_promote.id == null) 
									||
							(typeof item.product_obj === 'object' && item.product_obj.id_promotion == null))
								&&
						intersection(catesProd, vmOrE.listCateException).length == 0) {

					total_tmp += item.total
				}
			});
			return total_tmp;
		};

		function totalNotOnSale() {
			let total_no_onsale = 0;
			vmOrE.order.order_detail.forEach(function (item, index) {
				if (item.id_promote && item.id_promote.id == null) {
					total_no_onsale += item.total;
				}
			});
			return total_no_onsale;
		}

		function checkStatus() {
			if (vmOrE.orderTmp.status == 'CANCEL') {
				var modalInstance = $uibModal.open({
					animation: true,
					templateUrl: 'assets/global/message/view.html',
					controller: function ($scope, $uibModalInstance) {
						$scope.popTitle = 'Hủy';
						$scope.message = 'Bạn muốn hủy đơn hàng này?';

						$scope.ok = function () {
							vmOrE.order.status = vmOrE.orderTmp.status;
							update();
							$uibModalInstance.close();
						}
					}
				});

				modalInstance.result.then(function (resp) {
				}, function () {
					vmOrE.orderTmp.status = vmOrE.order.status;
				});
			}
			else {
				vmOrE.order.status = vmOrE.orderTmp.status;
			}
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