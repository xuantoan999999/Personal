'use strict';

const mongoose = require('mongoose');
const Category = mongoose.model('Category');
const regexp = require(BASE_PATH + '/app/utils/regexp');

module.exports = {
	getById,
}
/**
 * Middleware
 */
 function getById(request, reply) {
 	const id = request.params.id || request.payload.id;
 	let promise = Category.findOne({'_id': id});
 	promise.then(function (category) {
 		reply(category);
 	}).catch(function (err) {
 		request.log(['error'], err);
 		return reply(err);
 	})
 }
