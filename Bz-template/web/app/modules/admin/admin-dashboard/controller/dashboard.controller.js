module.exports = {
    index,
}

function index(request, reply) {
    var configManager = request.server.configManager;
    var cmsprefix = configManager.get('web.context.cmsprefix');
    if (!request.auth.credentials || !(request.auth.credentials.uid && request.auth.credentials.scope.includes('admin'))) {
        return reply.redirect(cmsprefix + '/signin');
    }
    return reply.view('admin/html/admin-dashboard/default');
}