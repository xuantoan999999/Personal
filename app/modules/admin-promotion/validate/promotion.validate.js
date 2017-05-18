"use strict";

var Joi = require('joi');

function PromotionValidate() { };
PromotionValidate.prototype = (function () {
    return {
        edit: {

        },
        save: {
            payload: {
                data: {
                    name: Joi.string().required().description('Name'),
                    desc: Joi.string().description('Description'),
                    type: Joi.string().description('Type'),
                    value: Joi.number().required().min(0).description('Value'),
                    status: Joi.boolean().required().description('Status'),
                    expire_date: Joi.object().keys({
                        startDate: Joi.date(),
                        endDate: Joi.date(),
                    }).description('Expire date')
                },
                product_apply: Joi.any()
            }
        },
        update: {

        },
        deleteItem: {

        }
    };
})();

var promotionValidate = new PromotionValidate();
module.exports = promotionValidate;
