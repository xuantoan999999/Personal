"use strict";

var Joi = require('joi');

function userValidate() { };
userValidate.prototype = (function () {
    return {
        verifyemail: {
            payload: {
                email: Joi.string().email().required().description('Email')
            }
        },
        register: {
            payload: {
                name: Joi.string().required().description('Name'),
                email: Joi.string().email().required().description('Email'),
                password: Joi.string().min(5).required().description('Password'),
                cfpassword: Joi.string().min(5).required().description('Confirm Password'),
            }
        },
        login: {
            payload: {
                email: Joi.string().email().required().description('Email'),
                password: Joi.string().required().description('Password'),
                scope: Joi.string().description('Scope'),
            }
        },
        forgot: {
            payload: {
                email: Joi.string().email().required().description('Email')
            }
        },
        active: {
            query: {
                token: Joi.string().required().description('Token'),
            }
        },
        reset: {
            payload: {
                newPassword: Joi.string().required().description('New Password'),
                confirmNewPassword: Joi.string().required().description('Confirm Password')
            },
            query: {
                token: Joi.string().required().description('Token'),
            }
        },
        changepassword: {
            payload: {
                currentPassword: Joi.string().required().description('Current Password'),
                newPassword: Joi.string().required().description('New Password'),
                confirmNewPassword: Joi.string().required().description('Confirm Password')
            }
        },
        update: {
            payload: {
                name: Joi.string().required().description('Name'),
                email: Joi.string().required().description('Email'),
            }
            // options: {
            //     allowUnknown: true
            // }
        },
    };
})();

var userVal = new userValidate();
module.exports = userVal;
