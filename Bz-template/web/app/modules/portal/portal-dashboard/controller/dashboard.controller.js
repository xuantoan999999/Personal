module.exports = {
    index,
}

function index(request, reply) {
    var configManager = request.server.configManager;
    var portalprefix = configManager.get('web.context.portalprefix');
    if (!request.auth.credentials || !(request.auth.credentials.uid && request.auth.credentials.scope.includes('admin'))) {
        return reply.redirect(portalprefix + '/signin');
    }
    return reply.view('portal/html/portal-dashboard/default');
}