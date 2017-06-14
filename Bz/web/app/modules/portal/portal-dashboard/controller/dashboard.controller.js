module.exports = {
	index,
}

function index(request, reply) {
	var configManager = request.server.configManager;
	var portalprefix = configManager.get('web.context.portalprefix');
	
	if (request.auth.credentials && request.auth.credentials.uid) {
		if(request.auth.credentials.scope.includes('agent') || request.auth.credentials.scope.includes('supplier')){
			return reply.view('portal/html/portal-dashboard/default');
		}else{
			return reply.redirect(portalprefix + '/signin');
		}
	}else{
		return reply.redirect(portalprefix + '/signin');

	}
}