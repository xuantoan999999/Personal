'use strict';

const mongoose = require('mongoose');
const Contact = mongoose.model('Contact');
const regexp = require(BASE_PATH + '/app/utils/regexp');

module.exports = {
	getById,
}
/**
 * Middleware
 */
 function getById(request, reply) {
 	const id = request.params.id || request.payload.id;
 	let promise = Contact.findOne({ '_id': id });
 	promise.then(function(contact) {

 		reply(contact);
 	}).catch(function(err) {
 		request.log(['error'], err);
 		return reply(err);
 	})
 }
