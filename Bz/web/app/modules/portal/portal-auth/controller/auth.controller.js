'use strict';

module.exports = {
	viewLogin
};

function viewLogin (request, reply) {
	var configManager = request.server.configManager;
	var portalprefix = configManager.get('web.context.portalprefix');

	if (request.auth.isAuthenticated) {
		return reply.redirect(portalprefix);
	};
	return reply.view('portal/html/portal-auth/signin');
}