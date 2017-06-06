"use strict";

var Joi = require('joi');

function bannerValidate() { };
bannerValidate.prototype = (function () {
    return {
        edit: {

        },
        save: {
            payload: {
                title: Joi.string().required().description('Title'),
                subtitle: Joi.any().description('subtitle'),
                link: Joi.any().description('link'),
                image: Joi.any().description('Image'),
                description: Joi.any().description('Description'),
                category: Joi.any().description('Category'),
                status: Joi.any().description('Status'),
                position: Joi.any().description('Position'),
            }
        },
        update: {
            payload: {
                title: Joi.string().required().description('Title'),
                subtitle: Joi.any().description('subtitle'),
                link: Joi.any().description('link'),
                image: Joi.any().description('Image'),
                description: Joi.any().description('Description'),
                product_id: Joi.string().required().description('ProductID'),
                category: Joi.any().description('Category'),
                status: Joi.any().description('Status'),
                position: Joi.any().description('Position'),
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

var bannerVal = new bannerValidate();
module.exports = bannerVal;
