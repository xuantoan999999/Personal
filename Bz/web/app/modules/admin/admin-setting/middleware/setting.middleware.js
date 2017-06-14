'use strict';

const mongoose = require('mongoose');
const Setting = mongoose.model('Setting');
const regexp = require(BASE_PATH + '/app/utils/regexp');

module.exports = {
	getById,
}
/**
 * Middleware
 */
 function getById(request, reply) {
 	const id = request.params.id || request.payload.id;
 	let promise = Setting.findOne({
 		'_id': id
 	});
 	promise.then(function(setting) {
 		reply(setting);
 	}).catch(function(err) {
 		request.log(['error'], err);
 		return reply(err);
 	})
 }