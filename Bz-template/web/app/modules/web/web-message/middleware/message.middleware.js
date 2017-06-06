'use strict';

const mongoose = require('mongoose');
const Message = mongoose.model('Message');
const regexp = require(BASE_PATH + '/app/utils/regexp');

module.exports = {
	getById,
}
/**
 * Middleware
 */
 function getById(request, reply) {
 	const id = request.params.id || request.payload.id;
 	let promise = Message.findOne({ '_id': id });
 	promise.then(function(message) {
 		return reply(message);
 	}).catch(function(err) {
 		request.log(['error'], err);
 		return reply(err);
 	});
 }