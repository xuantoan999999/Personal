"use strict";

var Joi = require('joi');

function sendmailValidate() { };
sendmailValidate.prototype = (function () {
    return {
        edit: {

        },
        save: {
            payload: {

            }
        },
        sendmail: {
            payload: {
                from: { name: Joi.string().required(), address: Joi.string().email().required() },
                to: Joi.array().items({ name: Joi.string(), address: Joi.string().email().required() }),
                cc: Joi.array().items({ name: Joi.string(), address: Joi.string().email() }),
                subject: Joi.string().required(),
                html: Joi.any().optional(),
                template: {name: Joi.any().optional(), context: Joi.any().optional()}  ,
                text: Joi.any().optional()
            }
        },
        update: {
            payload: {

            },
            options: {
                allowUnknown: true
            }
        },
        deleteItem: {

        }
    };
})();

var sendmailVal = new sendmailValidate();
module.exports = sendmailVal;
