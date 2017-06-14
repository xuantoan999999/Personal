"use strict";

var Joi = require('joi');

function contactValidate() { };
contactValidate.prototype = (function () {
    return {
        edit: {

        },
        save: {
            payload: {
                name: Joi.string().required().description('Name'),
                email: Joi.string().required().description('Email'),
                message: Joi.string().required().description('Message')
            }
        },
        update: {
            payload: {
                name: Joi.string().required().description('Name'),
                email: Joi.string().required().description('Email'),
                message: Joi.string().required().description('Message'),
                _id: Joi.string().description('MongoID')
            },
            options: {
                allowUnknown: true
            }
        },
        deleteItem: {

        }
    };
})();

var contactVal = new contactValidate();
module.exports = contactVal;
