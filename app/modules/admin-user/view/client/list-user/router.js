; (function () {
	'use strict';

	Application.registerRouter({
		state: 'users',
		config: {
			url: '/users?page&limit&sort&role&id&keyword&status&deletedAt',
			data: {
				title: 'Users',
				menuType: 'user'
			},
			params: {
				page: '1',
				sort: '-createdAt',
				limit: '10',
			},
			templateUrl: 'modules/admin-user/view/client/list-user/view.html',
			controller: 'usersCtrl',
			controllerAs: 'vmUsers',
			resolve: usersCtrl.resolve
		}
	});

	Application.registerRouter({
		state: 'usersDeleted',
		config: {
			url: '/users-deleted?page&limit&sort&role&id&keyword&status&deletedAt',
			data: {
				title: 'Users deleted',
				menuType: 'user-deleted'
			},
			params: {
				page: '1',
				sort: '-createdAt',
				limit: '10',
				deletedAt: 'true'
			},
			templateUrl: 'modules/admin-user/view/client/list-user/view.html',
			controller: 'usersCtrl',
			controllerAs: 'vmUsers',
			resolve: usersCtrl.resolve
		}
	});

})();
