'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');
const Category = mongoose.model('Category');
const Setting = mongoose.model('Setting');
const JWT = require('jsonwebtoken');
const aguid = require('aguid');
const async = require('async');

module.exports = {
    env,
    getCredentials,
    getSettings,
    createGuestToken,
    getPostCategories,
    getMeta,
    handleError,
    getListCategories
}

function env(request, reply) {
    if (request.response.variety === 'view') {
        request.response.source.context = request.response.source.context || {};
        request.response.source.context.isDevelopment = (process.env.NODE_ENV === 'development');
    }

    reply.continue();
}

function getCredentials(request, reply) {
    // Get the response object
    let response = request.response;
    // Check to see if the response is a view
    if (response.variety === 'view') {
        if (_.isEmpty(response.source.context)) {
            response.source.context = {};
        }
        if (_.isEmpty(response.source.context.credentials)) {
            response.source.context.credentials = {};
        }
        response.source.context.credentials = request.auth.credentials;
    }
    reply.continue();
}

function getSettings(request, reply) {
    // Get the response object
    let response = request.response;
    // Check to see if the response is a view
    if (response.variety === 'view') {

        let setting = request.server.plugins['api-setting'].getSetting();
        setting.then(function (setting) {
            response.source.context.cmsSettings = setting;
        });
    }
    reply.continue();
}

function createGuestToken(request, reply) {
    let response = request.response;
    // Check to see if the response is a view
    if (response.variety === 'view') {
        var configManager = request.server.configManager;
        let cookieOptions = configManager.get('web.cookieOptions');
        let credentials = request.auth.credentials;
        let authToken = request.auth.token;
        let cmsName = configManager.get('web.name');
        let cookieKey = cmsName + "-token";
        if (!authToken) {
            let auth = request.server.plugins['api-user'].auth;
            let session = auth.createSession({});
            auth.initGuest({})
            .then(token => {
                reply().state(cookieKey, token, cookieOptions);
            })
            .catch(err => {
                console.log(err);
            })
        }
    }

    reply.continue();
}

function getPostCategories(request, reply) {
    let promise = Category.find({ status: 1, type: 'post' });
    promise.then(function (postCategories) {
        let response = request.response;
        // Check to see if the response is a view
        if (response.variety === 'view') {
            response.source.context.postCategories = postCategories;
        }
        reply.continue();
    });
}

function getListCategories(request, reply) {
    let response = request.response;
    if (response.variety === 'view') {
        let promise = Category.find({ type: 'model', status: 1 })
        .select('name slug image').lean();
        promise.then(function (resp) {
            response.source.context.category_menu = resp;
            reply.continue();
        });
    }
    else {
        reply.continue();
    }
}

function getMeta(request, reply) {
    let response = request.response;
    if (response.variety === 'view') {
        let config = request.server.configManager;
        let app = config.get('web.context.app');
        if (response.source.context.meta && response.source.context.meta.title) {

            if (response.source.context.meta.title) {
                response.source.context.meta.title = response.source.context.meta.title + ' | ' + app.title
            }
        } else {
            response.source.context.meta = app
        }
    }
    reply.continue();
}

function handleError(request, reply) {
    var configManager = request.server.configManager;
    let cmsName = configManager.get('web.name');
    let cookieKey = cmsName + "-token";
    const response = request.response;
    
    if (!response.isBoom) {
        return reply.continue();
    }
    let config = request.server.configManager;
    let loginUrl = config.get('web.error.user.login');
    let notFoundUrl = config.get('web.error.notfound.url');

    const error = response;
    const statusCode = error.output.statusCode;

    if (statusCode === 404) {
        request.log(['error', 'notfound'], 'Resources is not be found');
        return reply.redirect(notFoundUrl);
    } else if (statusCode === 403) {
        request.log(['error', 'permission'], 'You have not permission to access this page');
        return reply.redirect(loginUrl);
    } 
    else if (statusCode === 401) {
        request.log([
            'error', 'Unauthorized'
            ], 'Invalid credentials');

        reply().unstate(cookieKey);
        return reply().continue();
    } 
    else {
        return reply.continue();
    }
};