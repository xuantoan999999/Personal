module.exports = {
	home
}

function home(request, reply) {
	let meta = {
		title: 'Notify',
		description: ''
	}
	return reply.view('web/html/web-notify/index',{meta: meta});
}
