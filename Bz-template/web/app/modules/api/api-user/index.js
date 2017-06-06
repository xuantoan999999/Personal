'use strict';

const AuthController = require('./controller/auth.controller.js');
const AuthMid = require('./middleware/auth.middleware.js');
const AuthVal = require('./validate/auth.validate.js');

exports.register = function (server, options, next) {


    var Auth = require('./util/auth');
    server.expose('auth', new Auth(server) );
    
    
    server.route({
        method: ['GET'],
        path: '/user',
        handler: AuthController.index,
        config: {
            auth: false,
            description: 'Service status',
            tags: ['api']
        }
    });

    server.route({
        method: 'POST',
        path: '/user/verify/email',
        handler: AuthController.verifyemail, 
        config: {
            validate: AuthVal.verifyemail,
            pre: [
            { method: AuthMid.getUserByEmail, assign: 'userByEmail' }
            ],
            description: 'Verify Email Exist',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responses: { '400': { 'description': 'Bad Request' } },
                    payloadType: 'form'
                }
            }
        }
    });

    server.route({
        method: ['POST'],
        path: '/user/register',
        handler: AuthController.register,
        config: {
            validate: AuthVal.verifyemail,
            pre: [
            { method: AuthMid.getUserByEmail, assign: 'userByEmail' }
            ],
            description: 'User Register',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responses: { '400': { 'description': 'Bad Request' } },
                    payloadType: 'form'
                }
            }
        }
    });

    server.route({
        method: ['GET'],
        path: '/user/active',
        handler: AuthController.active,
        config: {
            validate: AuthVal.active,
            description: 'Active User',
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
        method: 'POST',
        path: '/user/login',
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
        method: 'POST',
        path: '/user/facebook-login',
        handler: AuthController.facebookLogin
    });

    server.route({
        method: 'POST',
        path: '/user/google-login',
        handler: AuthController.googleLogin
    });

    server.route({
        method: ['GET'],
        path: '/user/logout',
        handler: AuthController.logout,
        config: {
            auth: 'jwt',
        }
    });

    server.route({
        method: ['POST'],
        path: '/user/forgot',
        handler: AuthController.forgot,
        config: {
            validate: AuthVal.forgot,
            description: 'Forgot Password',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responses: { '400': { 'description': 'Bad Request' } },
                    payloadType: 'form'
                }
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/user/reset',
        handler: AuthController.reset, 
        config: {
            validate: AuthVal.reset,
            description: 'Reset Password',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responses: { '400': { 'description': 'Bad Request' } },
                    payloadType: 'form'
                }
            }
        }
    });

    server.route({
        method: ['POST'],
        path: '/user/changepassword',
        handler: AuthController.changepassword,
        config: {
            auth: 'jwt',
            validate: AuthVal.changepassword,
            pre: [
            { method: AuthMid.getAuthUser, assign: 'user' }
            ],
            description: 'Change Password',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responses: { '400': { 'description': 'Bad Request' } },
                    payloadType: 'form'
                }
            }
        }
    });

    server.route({
        method: ['GET'],
        path: '/user/account',
        handler: AuthController.account,
        config: {
            pre: [
            { method: AuthMid.getAuthUser, assign: 'user' }
            ],
            auth: {
                strategy: 'jwt',
                scope: ['user', 'admin']
            }
        }
    });

    server.route({
        method: ['GET'],
        path: '/user/profile/{id}',
        handler: AuthController.profile,
        config: {
            pre: [
            { method: AuthMid.getAuthUser, assign: 'user' }
            ],
            auth: 'jwt'
        }
        
    });

    server.route({
        method: 'POST',
        path: '/user/uploadavatar',
        handler: AuthController.uploadavatar,
        config: {
            pre: [
            { method: AuthMid.getAuthUser, assign: 'user' }
            ],
            auth: 'jwt'
        }
    });
    

    server.route({
        method: 'POST',
        path: '/user/updateprofile',
        handler: AuthController.update,
        config: {
            validate: AuthVal.update,
            pre: [
            { method: AuthMid.getAuthUser, assign: 'user' }
            ],
            auth: 'jwt',
            description: 'Update User Profile',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responses: { '400': { 'description': 'Bad Request' } },
                    payloadType: 'form'
                }
            }
        }
    });

    return next();
};

exports.register.attributes = {
    name: 'api-user'
};
