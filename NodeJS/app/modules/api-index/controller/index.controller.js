'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');
const Boom = require('boom');
const Joi = require('joi');
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const asyncCao = require('async');

const Search = mongoose.model('Search');
const Product = mongoose.model('Product');
const Category = mongoose.model('Category');
const productUtil = require('./../../api-product/util/product');
const productHelper = require('../../web-product/util/product');

var slug = require('slug')

module.exports = {
    addSearch,
    search,
    productList
};

function addSearch(request, reply) {
    let keyword = request.pre.findSearch;
    if (!request.query.search)
        return reply({ success: false });
    if (!keyword) {
        let searchNew = new Search({
            keyword: request.query.search,
            count: 0,
            active: true
        });
        var promise = searchNew.save();
    }
    else {
        keyword.count++;
        var promise = keyword.save();
    }
    promise.then(function (resp) {
        if (request.query.from) {
            let config = request.server.configManager;
            return reply.redirect(config.get('web.context.settings.services.webUrl') + '/tim-kiem?q=' + request.query.search);
        }
        return reply({ success: true });
    })
}

function findSearch(request, reply) {
    let promise = Search.findOne({
        keyword: request.query.search
    });
    promise.then(function (resp) {
        reply(resp);
    })
}

function search(request, reply) {
    let re = request.query.q || '';
    let slug_re = slug(re);

    let option_keyword = [];

    let split_search = slug_re.split('-');
    option_keyword.push({
        keyword: new RegExp(re, 'i')
    });
    let option_product = split_search.map(function (item) {
        return { slug: new RegExp(item, 'i') };
    });

    asyncCao.parallel({
        searchList: function (callback) {
            let promise = Search.find({
                $or: option_keyword
            }).sort({ count: 1 }).select('keyword').limit(3).lean();

            promise.then(function (resp) {
                callback(null, resp);
            })
        },
        productList: function (callback) {
            let promise_name = Product.find(productUtil.createOptDueDate({
                name: new RegExp(re, 'i')
            })).select('name slug view_unit price thumb id_promotion id_unit').populate('unit').populate(productUtil.popuPromo()).limit(5).lean();

            promise_name.then(function (resp_name) {
                if (resp_name.length < 5) {
                    let not_in = resp_name.map(function (item) {
                        return item._id;
                    });
                    option_product.push({ _id: { $nin: not_in } });
                    let promise_slug = Product.find(productUtil.createOptDueDate({ $and: option_product }))
                        .select('name slug view_unit price thumb id_promotion id_unit')
                        .populate('unit').populate(productUtil.popuPromo()).limit(5 - resp_name.length).lean();

                    promise_slug.then(function (resp_slug) {
                        callback(null, resp_name.concat(resp_slug));
                    })
                }
                else {
                    callback(null, resp_name);
                }
            })
        }
    }, function (err, result) {
        return reply(result);
    })
}

function productList(request, reply) {
    let promise = Category.find({ parrent_id: null, status: true })
        .populate(autoPopulateCate('sub_category'))
        .select('slug name').lean();

    promise.then(function (categories) {
        let list_func = [];
        categories.forEach(function (category) {
            category.sub_category.forEach(function (sub) {
                list_func.push(function (callback) {
                    let promise = Product.find(opt_find(sub)).count();
                    promise.then(function (resp) {
                        callback(null, {
                            id: sub._id,
                            name: sub.name,
                            product_count: resp
                        });
                    })
                })

                // Start: get child category and count product
                sub.sub_category.forEach(function (child) {
                    list_func.push(function (callback) {
                        let promise = Product.find(opt_find(child)).count();
                        promise.then(function (resp) {
                            callback(null, {
                                id: child._id,
                                name: child.name,
                                product_count: resp
                            });
                        })
                    })
                });
            })
        })

        asyncCao.parallel(list_func, function (err, result) {
            return reply({ data: result });
        })
    });
}

var countEachCate = async(function (category) {
    category.sub_category.forEach(function (sub) {
        sub.product_count = await(Product.find(opt_find(sub)).count());

        // Start: get child categoru and count product
        sub.sub_category.forEach(function (child) {
            child.product_count = await(Product.find(opt_find(child)).count());
        });
    })
    return category;
});

var opt_find = function (category) {
    return productHelper.createOptDueDate({
        category: {
            $in: productHelper.getCategorySub(category, [])
        },
    })
};

function autoPopulateCate(path, count, obj) {
    if (typeof count == 'undefined') {
        var category_level = global.config.web.category_level;
        var count = category_level || 5;
        var obj = {};
    }
    if (count == 0) {
        return obj;
    }
    return {
        path: path,
        populate: autoPopulateCate(path, count - 1),
        match: { status: true },
        select: 'slug name'
    };
}