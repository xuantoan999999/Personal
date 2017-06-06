"use strict";

var Joi = require('joi');

function settingValidate() { };
settingValidate.prototype = (function () {
    return {
        edit: {

        },
        save: {
            payload: {
                key: Joi.string().required().description('Title'),
                value: Joi.any().description('subtitle'),
                value_type: Joi.any().description('subtitle'),
                description: Joi.any().description('Description'),
                status: Joi.any().description('Status'),
            }
        },
        update: {
            payload: {
                key: Joi.string().required().description('Title'),
                value: Joi.any().description('subtitle'),
                value_type: Joi.any().description('subtitle'),
                description: Joi.any().description('Description'),
                status: Joi.any().description('Status'),
                _id: Joi.string().description('MongoID')
            },
            // options: {
            //     allowUnknown: true
            // }
        },
        deleteItem: {

        }
    };
})();

var settingVal = new settingValidate();
module.exports = settingVal;
