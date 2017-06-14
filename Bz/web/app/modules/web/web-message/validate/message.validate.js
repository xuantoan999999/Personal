"use strict";

var Joi = require('joi');

function contactValidate() { };
contactValidate.prototype = (function () {
    return {
        edit: {

        },
        save: {
            payload: {
                title: Joi.string().required().description('Title'),
                message: Joi.string().required().description('Message'),
                channel: Joi.any().optional().description('Channel'),
            }
        },
        update: {
            payload: {
                title: Joi.string().required().description('Title'),
                message: Joi.string().required().description('Message'),
                channel: Joi.any().description('Channel'),
                id: Joi.string().description('MongoID')
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
