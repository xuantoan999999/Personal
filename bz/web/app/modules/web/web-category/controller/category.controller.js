const fs = require("fs");
const querystring = require('querystring');
const mongoose = require('mongoose');

const Category = mongoose.model('Category');

module.exports = {
	list,
}

function list(request, reply) {
	let listBrand = request.pre.categoryBrand;
	let options = {
		slug: request.params.slug,
		type: 'model',
		status: 1
	};

	let options_pop = {
		status: 1
	};

	if (request.query.b) options_pop.brand = request.query.b;
	let promise = Category.findOne(options).populate({
		path: 'products',
		match: options_pop,
		populate: {
			path: 'brand'
		}
	}).lean();

	promise.then(function (resp) {
		if (!resp) {
			return reply.redirect('/error404');
		}
		return reply.view('web/html/web-category/index', {
			title: 'BZ CMS | Hapi ' + request.server.version,
			message: 'Welcome to BZ CMS',
			activeMenu: request.params.slug,
			listBrand,
			data: resp,
			activeFilter: request.query.b
		});
	})
}