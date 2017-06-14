const fs = require("fs");
const querystring = require('querystring');
const mongoose = require('mongoose');
const slug = require('slug');

const Category = mongoose.model('Category');
const Product = mongoose.model('Product');

module.exports = {
	search,
}

function search(request, reply) {
	if (!request.query.q) return reply.redirect('/error404');
	let search = request.query.q;
	let slug_re = slug(search.toLowerCase());

	// Find category
	let findCategory = Category.findOne({
		slug: slug_re,
		status: 1,
		type: 'brand'
	}).populate('productsBrand').lean();

	findCategory.then(function (resp) {
		let list_product = resp ? resp.productsBrand : [];
		if (resp) delete resp.productsBrand;
		list_product.forEach(function (item) {
			item.brand = resp;
		});

		// Find product

		let options = {
			slug: new RegExp(slug_re, 'i'),
			status: 1,
			type: 'XE',
		}
		if (resp) {
			options.brand = { $ne: resp._id }
		}
		let findProduct = Product.find(options).populate('brand').lean();
		findProduct.then(function (products) {
			return reply.view('web/html/web-search-product/index', {
				data: list_product.concat(products),
				query: request.query.q
			});
		})
	})
}