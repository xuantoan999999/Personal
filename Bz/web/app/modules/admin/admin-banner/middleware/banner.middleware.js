'use strict';

const mongoose = require('mongoose');
const Banner = mongoose.model('Banner');
const regexp = require(BASE_PATH + '/app/utils/regexp');

module.exports = {
	getById,
}
/**
 * Middleware
 */
 
 function getById(request, reply) {
 	const id = request.params.id || request.payload.id;
 	let promise = Banner.findOne({ '_id': id });
 	promise.then(function(banner) {
 		reply(banner);
 	}).catch(function(err) {
 		request.log(['error'], err);
 		return reply(err);
 	})
 }