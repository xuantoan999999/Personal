'use strict';

const AuthController = require('./controller/auth.controller.js');
const AuthMid = require('./middleware/auth.middleware.js');
const AuthVal = require('./validate/auth.validate.js');

exports.register = function (server, options, next) {


    var Auth = require('./util/auth');
    server.expose('authAdmin', new Auth(server) );

    // server.route({
    //     method: ['GET'],
    //     path: '/user/active',
    //     handler: AuthController.active,
    //     config: {
    //         validate: AuthVal.active,
    //         description: 'Active User',
    //         tags: ['api'],
    //         plugins: {
    //             'hapi-swagger': {
    //                 responses: { '400': { 'description': 'Bad Request' } },
    //                 payloadType: 'form'
    //             }
    //         },
    //     }
    // });

    server.route({
        method: 'POST',
        path: '/admin/login',
        handler: AuthController.login,
        config: {
            validate: AuthVal.login,
            description: 'User Login',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responses: { '400': { 'description': 'Bad Request' } },
                    payloadType: 'form'
                }
            },
        }
    });

    server.route({
        method: ['GET'],
        path: '/admin/logout',
        handler: AuthController.logout,
        config: {
            auth: 'jwt-admin',
        }
    });

    // server.route({
    //     method: ['POST'],
    //     path: '/user/forgot',
    //     handler: AuthController.forgot,
    //     config: {
    //         validate: AuthVal.forgot,
    //         description: 'Forgot Password',
    //         tags: ['api'],
    //         plugins: {
    //             'hapi-swagger': {
    //                 responses: { '400': { 'description': 'Bad Request' } },
    //                 payloadType: 'form'
    //             }
    //         }
    //     }
    // });

    // server.route({
    //     method: 'POST',
    //     path: '/user/reset',
    //     handler: AuthController.reset, 
    //     config: {
    //         validate: AuthVal.reset,
    //         description: 'Reset Password',
    //         tags: ['api'],
    //         plugins: {
    //             'hapi-swagger': {
    //                 responses: { '400': { 'description': 'Bad Request' } },
    //                 payloadType: 'form'
    //             }
    //         }
    //     }
    // });

    // server.route({
    //     method: ['POST'],
    //     path: '/user/changepassword',
    //     handler: AuthController.changepassword,
    //     config: {
    //         auth: 'jwt',
    //         validate: AuthVal.changepassword,
    //         pre: [
    //         { method: AuthMid.getAuthUser, assign: 'user' }
    //         ],
    //         description: 'Change Password',
    //         tags: ['api'],
    //         plugins: {
    //             'hapi-swagger': {
    //                 responses: { '400': { 'description': 'Bad Request' } },
    //                 payloadType: 'form'
    //             }
    //         }
    //     }
    // });

    // server.route({
    //     method: 'POST',
    //     path: '/user/updateprofile',
    //     handler: AuthController.update,
    //     config: {
    //         validate: AuthVal.update,
    //         pre: [
    //         { method: AuthMid.getAuthUser, assign: 'user' }
    //         ],
    //         auth: 'jwt',
    //         description: 'Update User Profile',
    //         tags: ['api'],
    //         plugins: {
    //             'hapi-swagger': {
    //                 responses: { '400': { 'description': 'Bad Request' } },
    //                 payloadType: 'form'
    //             }
    //         }
    //     }
    // });

    return next();
};

exports.register.attributes = {
    name: 'api-authadmin'
};
