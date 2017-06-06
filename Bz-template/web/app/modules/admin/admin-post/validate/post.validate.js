"use strict";

var Joi = require('joi');

function userValidate() { };
userValidate.prototype = (function () {
    return {
        edit: {

        },
        save: {
            payload: {
                title: Joi.string().required().description('Title'),
                teaser: Joi.string().description('Teaser'),
                content: Joi.string().required().description('Content'),
                status: Joi.number().required().description('Status'),
                slug: Joi.string().description('Slug'),
                category: Joi.any().description('Category'),
                feature: Joi.any().description('Feature'),
                thumb: Joi.any().description('Thumms'),
                image: Joi.any().description('Image'),
                attrs: Joi.any().description('Meta')
            }
        },
        update: {
            payload: {
                title: Joi.string().required().description('Title'),
                teaser: Joi.string().description('Teaser'),
                content: Joi.string().required().description('Content'),
                status: Joi.number().required().description('Status'),
                slug: Joi.string().description('Slug'),
                modified: Joi.date().required().description('Modified'),
                _id: Joi.string().required().description('MongoID'),
                category: Joi.any().description('Category'),
                feature: Joi.any().description('Feature'),
                thumb: Joi.any().description('Thumms'),
                image: Joi.any().description('Image'),
                attrs: Joi.any().description('Meta'),
                created: Joi.any().description('created'),
            },
            options: {
                allowUnknown: true
            }
        },
        deleteItem: {

        }
    };
})();

var userVal = new userValidate();
module.exports = userVal;
