'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const JWT = require('jsonwebtoken');
const aguid = require('aguid');
const crypto = require('crypto');
const UserEmail = require('../../../api/api-authadmin/util/user-email');

module.exports = {
	viewLogin,
	login
};

function viewLogin(request, reply) {
	return reply.view('admin/html/admin-auth/signin');
	
	// var configManager = request.server.configManager;
	// var cmsprefix = configManager.get('web.context.cmsprefix');

	// if (request.auth.isAuthenticated) {
	// 	return reply.redirect(cmsprefix);
	// };
	// return reply.view('admin/html/admin-auth/signin');
}

function login(request, reply) {
	let email = 'admin@gmail.com';
	let password = 'mhvAdmin';
	let promise = User.findOne({ email: 'admin@gmail.com' });

	promise
		.then(user => {
			return request.server.plugins['api-user'].auth
				.login(email, password, user)
				.then(jwtToken => {
					return reply({ token: jwtToken }).header("Authorization", jwtToken).state(cookieKeyAdmin, jwtToken, cookieOptions);
				})
				.catch(err => {
					request.log(['error', 'login'], err);
					return reply(Boom.unauthorized("Incorrect email or password"));
				});

			// return reply({ user });

		}).catch(err => {
			return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
		});

	// let configManager = request.server.configManager;
	// let cookieOptions = configManager.get('web.cookieOptions');
	// let cmsName = configManager.get('web.name');

	// let cookieKeyAdmin = cmsName + "-admin-token";
	// let { email, password, scope } = request.payload;
	// // let promise = User.findOne({ email: 'admin@gmail.com' }).exec();
	// return reply({ success: true });

	// promise
	// 	.then(user => {

	// 		console.log(user, "user");

	// 		if (!user || (user && user.status != 1)) {
	// 			return reply(Boom.unauthorized("Incorrect email or password"));
	// 		}
	// 		/*check scope if exist*/
	// 		if (scope && !user.roles.includes(scope)) {
	// 			return reply(Boom.unauthorized("Incorrect email or password"));
	// 		}

	// return request.server.plugins['api-user'].auth
	// 	.login(email, password, user)
	// 	.then(jwtToken => {
	// 		return reply({ token: jwtToken }).header("Authorization", jwtToken).state(cookieKeyAdmin, jwtToken, cookieOptions);
	// 	})
	// 	.catch(err => {
	// 		request.log(['error', 'login'], err);
	// 		return reply(Boom.unauthorized("Incorrect email or password"));
	// 	});

	// 	}).catch(err => {
	// 		return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
	// 	});
}