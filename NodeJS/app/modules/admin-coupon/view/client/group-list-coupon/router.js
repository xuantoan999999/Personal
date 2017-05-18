;(function(){
	'use strict';

	Application.registerRouter({
		state: 'coupon-group',
		config: {
			url: '/coupon-group?page&limit&sort&role&id&keyword',
			data: {
				title: 'Coupon',
				menuType: 'coupon-group'
			},
			params: {
				page: '1',
				sort: '-createdAt',
				limit: '20'
			},
			templateUrl: 'modules/admin-coupon/view/client/group-list-coupon/view.html',
			controller: 'couponGroupCtrl',
			controllerAs: 'vmCPG',
		}
	});
})();
