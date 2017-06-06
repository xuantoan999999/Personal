'use strict';

const mongoose = require('mongoose');
const Page = mongoose.model('Page');
const regexp = require(BASE_PATH + '/app/utils/regexp');

module.exports = {
	getById,
}
/**
 * Middleware
 */
 function getById(request, reply) {
 	const id = request.params.id || request.payload.id;
 	let promise = Page.findOne({ '_id': id });
 	promise.then(function(page) {
 		reply(page);
 	}).catch(function(err) {
 		request.log(['error'], err);
 		return reply.continue();
 	})
 }
