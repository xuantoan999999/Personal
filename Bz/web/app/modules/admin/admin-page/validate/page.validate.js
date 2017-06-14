"use strict";

var Joi = require('joi');

function pageValidate() { };
pageValidate.prototype = (function () {
    return {
        edit: {

        },
        save: {
            payload: {
                title: Joi.string().required().description('Title'),
                slug: Joi.string().description('Slug'),
                content: Joi.string().required().description('Content')
            }
        },
        update: {
            payload: {
                title: Joi.string().required().description('Title'),
                content: Joi.string().required().description('Content'),
                slug: Joi.string().required().description('Slug'),
                modified: Joi.date().required().description('Modified'),
                _id: Joi.string().required().description('MongoID')
            },
            // options: {
            //     allowUnknown: true
            // }
        },
        deleteItem: {

        }
    };
})();

var pageVal = new pageValidate();
module.exports = pageVal;
