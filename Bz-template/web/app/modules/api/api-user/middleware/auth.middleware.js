'use strict';

const mongoose = require('mongoose');
const User = mongoose.model('User');
const regexp = require(BASE_PATH + '/app/utils/regexp');

module.exports = {
	getAuthUser,
	getUserByEmail,
}
/**
 * Middleware
 */
 function getAuthUser(request, reply) {

 	const id = request.auth.credentials.uid;
 	console.log(request.auth.credentials);
 	console.log("ID: " + id);
 	request.log(['info', 'auth'], id);
 	User.findOne({ _id: id }).exec().then(function (user) {
 		return reply(user);
 	}).catch(err => {
 		request.log(['error'], err);
 		reply(err);
 	});
 }
 
 function getUserByEmail(request, reply) {

 	const email = request.payload.email;
 	User.findOne({ email: email }).exec().then(function (user) {
 		return reply(user);
 	}).catch(err => {
 		request.log(['error'], err);
 		reply(err);
 	});
 }
