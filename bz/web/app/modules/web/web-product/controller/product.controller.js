const fs = require("fs");
const querystring = require('querystring');
const mongoose = require('mongoose');

const Product = mongoose.model('Product');

module.exports = {
	detail,
}

function detail(request, reply) {
	let promise = Product.findOne({
		slug: request.params.slug,
		status: 1
	}).populate('model brand').lean();
	promise.then(function (resp) {
		if (!resp) {
			return reply.redirect('/error404');
		}
		return reply.view('web/html/web-product/index', {
			data: resp,
			activeMenu: resp.model.slug
		});
	})
}