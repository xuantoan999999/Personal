"use strict";

var Joi = require('joi');

function categoryValidate() { };
categoryValidate.prototype = (function () {
    return {
        edit: {

        },
        save: {
            payload: {
                name: Joi.string().required().description('Title'),
                slug: Joi.string().description('Slug'),
                type: Joi.string().required().description('Type'),
                status: Joi.number().required().description('Status'),
                description: Joi.any().description('Description'),
                attrs: Joi.any().description('Meta'),
                image: Joi.any().description('Image'),
                link: Joi.any().description('Link')
            }
        },
        update: {
            payload: {
                _id: Joi.string().description('MongoID'),
                __v: Joi.any(),
                name: Joi.string().required().description('Title'),
                slug: Joi.string().description('Slug'),
                type: Joi.string().required().description('Type'),
                status: Joi.number().required().description('Status'),
                description: Joi.any().description('Description'),
                attrs: Joi.any().description('Meta'),
                image: Joi.any().description('Image'),
                link: Joi.any().description('Link'),
                createdAt: Joi.date(),
                updatedAt: Joi.date()
            },
            // options: {
            //     allowUnknown: true
            // }
        },
        deleteItem: {

        }
    };
})();

var categoryVal = new categoryValidate();
module.exports = categoryVal;
