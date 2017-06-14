'use strict';

const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const regexp = require(BASE_PATH + '/app/utils/regexp');

module.exports = {
	getById,
}
/**
 * Middleware
 */
 function getById(request, reply) {
 	const id = request.params.id || request.payload.id;
 	let promise = Product.findOne({'_id': id});
 	promise.then(function (product) {
 		reply(product);
 	}).catch(function (err) {
 		request.log(['error'], err);
 		return reply(err);
 	})
 }
