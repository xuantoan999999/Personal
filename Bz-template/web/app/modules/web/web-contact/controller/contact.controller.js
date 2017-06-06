module.exports = {
	contact
};

function contact(request, reply) {
	let meta = {
		title: 'Contact us',
		description: ''
	};
	return reply.view('web/html/web-contact/index', meta);
}
