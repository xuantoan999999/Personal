const mongoose = require('mongoose');
const Category = mongoose.model('Category');
const Tag = mongoose.model('Tag');
const Promotion = mongoose.model('Promotion');
const productUtil = require('./../../api-product/util/product');
const moment = require("moment");

module.exports = {
    getTag,
    getListCategory,
    getPromotionActive
}

function getTag(tag) {
    return function (request, reply) {
        let time_present = moment();
        let promise = Tag.findOne({
            name: new RegExp(tag, 'i')
        }).populate({
            path: 'product_tag',
            select: 'name',
            match: { 'tag_product.expire_date.endDate': { $gte: time_present } },
        }).lean();
        promise.then(function (resp) {
            reply(resp);
        });
    }
}

function getListCategory(request, reply) {
    let promise = Category.find({ parrent_id: null, status: true }).populate({
        path: 'top',
        select: 'name slug'
    }).populate(productUtil.autoPopCate('sub_category')).select('name slug top').lean();

    promise.then(function (resp) {
        reply(resp);
    });
}

function getPromotionActive(request, reply) {
    let time_present = moment();

    let promise = Promotion.find(productUtil.autoPro()).select('name').lean();
    promise.then(function (resp) {
        reply(resp);
    });
}