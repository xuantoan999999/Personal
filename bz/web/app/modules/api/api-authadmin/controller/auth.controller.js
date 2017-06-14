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
const UserEmail = require('../util/user-email');

module.exports = {
    login,
    logout,
};

function login(request, reply) {
    let configManager = request.server.configManager;
    let cookieOptions = configManager.get('web.cookieOptions');
    let cmsName = configManager.get('web.name');

    let cookieKeyAdmin = cmsName + "-admin-token";
    let { email, password, scope } = request.payload;
    let promise = User.findOne({ email: email }).exec();

    promise
    .then(user => {

        console.log(user, "user");

        if (!user || (user && user.status != 1)) {
            return reply(Boom.unauthorized("Incorrect email or password"));
        }
        /*check scope if exist*/
        if (scope && !user.roles.includes(scope)) {
            return reply(Boom.unauthorized("Incorrect email or password"));
        }

        return request.server.plugins['api-user'].auth
        .login(email, password, user)
        .then(jwtToken => {
            return reply({ token: jwtToken }).header("Authorization", jwtToken).state(cookieKeyAdmin, jwtToken, cookieOptions);
        }) 
        .catch(err => {
            request.log(['error', 'login'], err);
            return reply(Boom.unauthorized("Incorrect email or password"));
        });

    }).catch(err => {
        return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}

function logout(request, reply) {
    var configManager = request.server.configManager;
    let cmsName = configManager.get('web.name');
    let cookieKeyAdmin = cmsName + "-admin-token";
    var isUseRedis = configManager.get('web.isUseRedis');
    const sessionId = request.auth.credentials.id;
    let auth = request.server.plugins['api-user'].auth;
    auth
    .logout(sessionId)
    .then((session) => {
        let cookieOptions = request.server.configManager.get('web.cookieOptions');
        reply({ status: true }).header("Authorization", '')
        .unstate(cookieKeyAdmin, cookieOptions);
    })
    .catch(err => {
        console.log(err);
        return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    })
}
