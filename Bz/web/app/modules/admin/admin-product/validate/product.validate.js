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
                age_car: Joi.string().required().description('Xe cũ/mới'),
                model: Joi.string().required().description('Model'),
                brand: Joi.string().description('Brand'),
                supplier: Joi.string().required().description('Supplier'),
                short_description: Joi.string().description('Short description'),
                detail_infor: Joi.string().description('Detail infor'),
                vehical_number: Joi.string().required().description('Vehical number'),
                engine_number: Joi.string().required().description('Engine number'),
                cc: Joi.string().required().description('cc'),
                odd: Joi.string().required().description('Odd'),
                price_user: Joi.number().required().description('Price user'),
                price_agent: Joi.number().required().description('Price agent'),
                deposit: Joi.number().required().description('Deposit'),
                gearup_fee: Joi.number().required().description('Gearup fee'),
                thumb: Joi.any().description('Thumb'),
                // banner: Joi.any().description('Banner'),
                gallery: Joi.any().description('Gallery'),
                color: Joi.any().description('Color'),
                nsx: Joi.date().description('Date'),
                engine_detail: Joi.object().description('Động cơ'),
                bone_frame_detail: Joi.object().description('Khung xương'),
                size_detail: Joi.object().description('Kích thước'),
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
                age_car: Joi.string().required().description('Xe cũ/mới'),
                model: Joi.string().required().description('Model'),
                brand: Joi.string().required().description('Brand'),
                supplier: Joi.string().required().description('Supplier'),
                vehical_number: Joi.string().required().description('Vehical number'),
                engine_number: Joi.string().required().description('Engine number'),
                cc: Joi.string().required().description('cc'),
                odd: Joi.string().required().description('Odd'),
                price_user: Joi.number().required().description('Price user'),
                price_agent: Joi.number().required().description('Price agent'),
                deposit: Joi.number().required().description('Deposit'),
                gearup_fee: Joi.number().required().description('Gearup fee'),
                stock: Joi.number().required().description('Stock'),
                thumb: Joi.any().description('Thumb'),
                short_description: Joi.string().description('Short description'),
                detail_infor: Joi.string().description('Detail infor'),
                gallery: Joi.any().description('Galery'),
                color: Joi.any().description('Color'),
                engine_detail: Joi.object().description('Động cơ'),
                bone_frame_detail: Joi.object().description('Khung xương'),
                size_detail: Joi.object().description('Kích thước'),
                // banner: Joi.any().description('Banner'),
                nsx: Joi.date().description('Date'),
                createdAt: Joi.date(),
                updatedAt: Joi.date()
            },
            options: {
                allowUnknown: true
            }
        },
        deleteItem: {

        }
    };
})();

var categoryVal = new categoryValidate();
module.exports = categoryVal;
