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
                address: Joi.string().required().description('Address'),
                phone: Joi.any().description('Phone'),
                messages: Joi.string().required().description('Messages')
            }
        },
        update: {
            payload: {
                name: Joi.string().required().description('Name'),
                email: Joi.string().required().description('Email'),
                address: Joi.any().description('Address'),
                phone: Joi.string().required().description('Phone'),
                message: Joi.string().required().description('Messages'),
                modified: Joi.any().description('Modified'),
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
