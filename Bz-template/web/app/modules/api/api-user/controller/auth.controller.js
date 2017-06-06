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
    index,
    verifyemail,
    register,
    active,
    login,
    facebookLogin,
    googleLogin,
    logout,
    forgot,
    reset,
    changepassword,
    account,
    profile,
    uploadavatar,
    update
};

function index(request, reply) {
    return reply({ status: true, msg: 'It works' });
}

function verifyemail(request, reply) {
    if (request.pre.userByEmail) {
        return reply(Boom.badRequest('Email is exist'));
    }
    reply({ status: 1, message: 'Email is not exist' });
}

function register(request, reply) {
    if (request.pre.userByEmail) {
        return reply(Boom.badRequest('Email taken'));
    }
    if (request.payload.password != request.payload.cfpassword) {
        return reply(Boom.badRequest('Confirm new password does not match'));
    }
    delete request.payload.cfpassword;

    let user = new User(request.payload);
    user.provider = 'local';
    let auth = request.server.plugins['api-user'].auth;
    auth.hashPassword(request.payload.password).then(hash => {
        user.password = hash;
        const token = auth.getRandomString(20);
        user.activeToken = token;
        const promise = user.save();
        return promise;
    }).then(user => {
        /*send email welcome*/
        UserEmail.sendRegisterEmail(request, { name: user.name, address: user.email }, user);
        return user;
    }).then(user => {
        user = user.toObject();
        delete user.password;

        return reply(user);
    }).catch(err => {
        return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}

function active(request, reply) {
    let token = request.query.token;
    let promise = User.findOne({ activeToken: token }).exec();
    promise.then(user => {
        if (!user) {
            return reply(Boom.badRequest('Invalid Token'));
        }
        user.activeToken = '';
        user.status = 1;
        return user.save();
    })
    .then(user => {
        reply({ status: 1 });
    })
    .catch(err => {
        request.log(['error', 'active'], err);
        return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}

function login(request, reply) {
    let configManager = request.server.configManager;
    let cookieOptions = configManager.get('web.cookieOptions');
    let cmsName = configManager.get('web.name');

    let cookieKey = cmsName + "-token";
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
            return reply({ token: jwtToken }).header("Authorization", jwtToken).state(cookieKey, jwtToken, cookieOptions);
        }) 
        .catch(err => {
            request.log(['error', 'login'], err);
            return reply(Boom.unauthorized("Incorrect email or password"));
        });

    }).catch(err => {
        return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}

function facebookLogin(request, reply) {
    reply();
}

function googleLogin(request, reply) {
    reply();
}

function logout(request, reply) {
    var configManager = request.server.configManager;
    let cmsName = configManager.get('web.name');
    let cookieKey = cmsName + "-token";
    var isUseRedis = configManager.get('web.isUseRedis');
    const sessionId = request.auth.credentials.id;
    let auth = request.server.plugins['api-user'].auth;
    auth
    .logout(sessionId)
    .then((session) => {
        let cookieOptions = request.server.configManager.get('web.cookieOptions');
        reply({ status: true }).header("Authorization", '')
        .unstate(cookieKey, cookieOptions);
    })
    .catch(err => {
        console.log(err);
        return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    })

}

function forgot(request, reply) {
    const email = request.payload.email;
    const promise = User.findOne({ email: email }, '-password').exec();
    let auth = request.server.plugins['api-user'].auth;
    promise.then(user => {
        if (!user) {
            return reply(Boom.notFound('Email is not exist'));
        }
        const token = auth.getRandomString(20);
        user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 48 * 3600000; // 48 hours
            return user.save();
        })
    .then(user => {
        UserEmail.sendForgotPasswordEmail(request, { name: user.name, address: user.email }, user);
        return reply({ status: 1 });
    })
    .catch(err => {
        return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}

function reset(request, reply) {
    let { newPassword, confirmNewPassword } = request.payload;
    if (newPassword != confirmNewPassword) {
        return reply(Boom.badRequest('Confirm new password does not match'));
    }
    let token = request.query.token;
    if (!token) {
        return reply(Boom.badRequest('Token is empty'));
    }
    let auth = request.server.plugins['api-user'].auth;
    let promise = User.findOne({ resetPasswordToken: token }).exec();
    promise.then(user => {
        if (!user) {
            reply(Boom.badRequest('Token is incorrect'));
        }
        user.resetPasswordToken = '';
        user.resetPasswordExpires = null;
        return auth.hashPassword(newPassword).then(hash => {
            user.password = hash;
            return user.save();
        });
    })
    .then(user => {
        reply({ status: 1, message: 'Password changed successful.' });
    })
    .catch(err => {
        request.log(['error', 'reset'], err);
        return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}

function changepassword(request, reply) {
    let user = request.pre.user;
    if (!user) {
        return reply(Boom.notFound('User is not found'));
    }
    let { currentPassword, newPassword, confirmNewPassword } = request.payload;
    /*validate new password and confirm password*/
    if (newPassword != confirmNewPassword) {
        return reply(Boom.badRequest('Confirm new password does not match'));
    }
    let auth = request.server.plugins['api-user'].auth;
    auth.compare(currentPassword, user.password).then(valid => {
        return auth.hashPassword(newPassword).then(hash => {
            user.password = hash;
            return user.save();
        });
    })
    .then(user => {
        reply({ status: 1, message: 'Password changed successful.' });
    })
    .catch(err => {
        let errorMessage = ErrorHandler.getErrorMessage(err);
        return reply(Boom.badRequest(errorMessage));
    });

}

function account(request, reply) {
    const user = request.pre.user;
    if (user) {
        return reply(user);
    }
    reply(Boom.unauthorized('User is not found'));
}

function profile(request, reply) {
    const user = request.pre.user;
    if (user) {
        reply(user);
    }
    reply(Boom.unauthorized('User is not found'));
}

function uploadavatar(request, reply) {
    const user = request.pre.user;
    reply();
}

function update(request, reply) {
    let user = request.pre.user;
    if (!user) {
        reply(Boom.notFound('User is not found'));
    }
    let { name } = request.payload;
    user.name = name;
    user.save().then(user => {
        reply({ status: 1 });
    }).catch(err => {
        request.log(['error', 'update'], err);
        reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    })
}