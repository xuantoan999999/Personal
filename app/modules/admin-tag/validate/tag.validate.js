"use strict";

var Joi = require('joi');

function TagValidate() { };
TagValidate.prototype = (function () {
	return {
		save: {
            payload: {
                name: Joi.string().required().description('Name'),
                description: Joi.any().description('Description'),
                type: Joi.string().default('SP').description('Type'),
                type_blog: Joi.array().description('Type blog'),
            }
		},
		update: {
			payload: {
                name: Joi.string().required().description('Name'),
                description: Joi.string().description('Description'),
                type: Joi.string().description('Type'),
                type_blog: Joi.array().description('Type blog'),

                product_tag: Joi.allow(),
                proccesing: Joi.allow(),
                id: Joi.allow(),

                _id: Joi.string().description('MongoID'),
                created: Joi.allow(""),
                updatedAt: Joi.date().allow('').description('Updated'),
                createdAt: Joi.date().allow('').description('Created'),
                __v: Joi.any().optional().description('Version Key')
            }
		}
	};
})();

var tagValidate = new TagValidate();
module.exports = tagValidate;
