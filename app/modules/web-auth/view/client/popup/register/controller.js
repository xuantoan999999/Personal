; (function () {
	'use strict';

	angular
		.module('bzAuth')
		.controller('popRegisterCtrl', popRegisterCtrl);

	function popRegisterCtrl($scope, $rootScope, $state, $window, $bzPopup, $uibModal, authSvc, $uibModalInstance, bzUtilsSvc) {
		var vmRegister = this
		//Vars
		vmRegister.formData = {};
		vmRegister.submitted = false;
		vmRegister.lockForm = false;
		// Methods
		vmRegister.register = register;
		vmRegister.login = login;
		vmRegister.popLogin = popLogin;
		vmRegister.loginFacebook = loginFacebook;
		vmRegister.checkInput = checkInput;
		vmRegister.checkPhoneMatch = checkPhoneMatch;
		vmRegister.getInfoLocalStorage = getInfoLocalStorage;

		//Init
		getInfoLocalStorage();

		function getInfoLocalStorage() {
			let dataStorage = bzUtilsSvc.getInfoUser();
			if (dataStorage) {
				vmRegister.formData.name = dataStorage.name || '';
				vmRegister.formData.phone = dataStorage.phone || '';
				vmRegister.formData.cfphone = dataStorage.phone || '';

				var shipping_address = {
					name: sanitizeHtml(dataStorage.name || ''),
					phone: sanitizeHtml(dataStorage.phone || ''),
					address_detail: sanitizeHtml(dataStorage.address_detail || ''),
					id_shipping_fee: dataStorage.id_shipping_fee || ''
				};
				if (shipping_address.name != ''
					&& shipping_address.phone != ''
					&& shipping_address.address_detail != ''
					&& shipping_address.id_shipping_fee != ''
				) {
					vmRegister.formData.customer = {
						shipping_address: [shipping_address]
					};
					vmRegister.formData.idOrder = dataStorage.id_order || '';
				}

			}
		}

		function register(isValid) {
			vmRegister.submitted = true;
			vmRegister.lockForm = true;
			if (isValid) {
				vmRegister.formData.cfpassword = vmRegister.formData.password;
				authSvc.register(vmRegister.formData).then(function (resp) {
					fbq('track', 'CompleteRegistration');

					$bzPopup.toastr({
						type: 'success',
						data: {
							title: 'Thành công',
							message: "Đăng ký thành công"
						}
					});
					$uibModalInstance.close();
					//Đăng nhập thành công thì login
					login(resp);
				}).catch(function (err) {
					vmRegister.err = err.data.message;
					vmRegister.lockForm = false;
					if (vmRegister.err != 'email' && vmRegister.err != 'phone') {
						$bzPopup.toastr({
							type: 'error',
							data: {
								title: 'Lỗi',
								message: "Dữ liệu nhập vào bị lỗi !!"
							}
						});
					}
				});
			}
			else {
				vmRegister.submitted = true;
				vmRegister.lockForm = false;
			}
		}

		// function autoAddShippingAddress(user) {
		// 	var dataStorage = bzUtilsSvc.getInfoUser();
		// 	if (dataStorage && user) {
		// 		var shipping_address = {
		// 			name: sanitizeHtml(dataStorage.name || ''),
		// 			phone: sanitizeHtml(dataStorage.phone || ''),
		// 			address_detail: sanitizeHtml(dataStorage.address_detail || ''),
		// 			id_shipping_fee: dataStorage.id_shipping_fee || ''
		// 		};
		// 		if (shipping_address.name != ''
		// 			&& shipping_address.phone != ''
		// 			&& shipping_address.address_detail != ''
		// 			&& shipping_address.id_shipping_fee != ''
		// 		) {
		// 			delete user.__v;
		// 			delete user.vocative;
		// 			delete user.password_token;
		// 			delete user.created;
		// 			delete user.provider;
		// 			delete user.activeToken;
		// 			delete user.favorite_product;
		// 			delete user.dob;
		// 			delete user.password;
		// 			user.customer.shipping_address.push(shipping_address);

		// 			authSvc.update(user, user._id);
		// 		}
		// 	}
		// }

		function autoInfoLastOrder(user, idOrder) {
			if (user && idOrder && idOrder != '') {

			}
		}

		function checkInput() {
			vmRegister.err = null;
		}

		function checkPhoneMatch(isValid) {
			if (vmRegister.formData.cfphone != vmRegister.formData.phone) {
				isValid = false;
				return true;
			}
			return false;
		}
		function login(user) {
			var data = {
				phone: user.phone,
				password: "123",
				isRegister: true
			}
			authSvc.siteLogin(data, function (resp) {
				// autoAddShippingAddress(resp.account);
				bzUtilsSvc.removeInfoUser();
				$window.location.href = "/";
			});
		}
		function loginFacebook() {
			authSvc.getFacebook().then(function (user) {
				user.isRegister = true;
				if (!user.error) {
					social('facebook', user);
					authSvc.facebookLogin(user, function (resp) {
						fbq('track', 'CompleteRegistration');
						bzUtilsSvc.removeInfoUser();
						$window.location.href = '/';
					}, function (err) {
						$bzPopup.toastr({
							type: 'error',
							data: {
								title: 'Đăng ký facebook',
								message: err.data.message
							}
						});
					});
				} else {
					$bzPopup.toastr({
						type: 'error',
						data: {
							title: 'Đăng ký facebook',
							message: '' + user.error
						}
					});
				}
			});
		}

		function social(type, user) {

			vmRegister.social = {
				type: type,
				id: user.id,
				name: user.name,
				email: user.email,
				profile_picture: user.picture + '?sz=200'

			};
			if (type == 'facebook') {
				vmRegister.social.profile_picture = 'https://graph.facebook.com/v2.5/' + user.id + '/picture?width=200&height=200';
			}
			/*Thao tác tại đây*/
		}

		function popLogin() {
			$uibModalInstance.close();
			authSvc.popLogin();
		}


		//End func
	}
})();