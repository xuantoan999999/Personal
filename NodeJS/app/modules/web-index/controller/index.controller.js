'use strict';
const Boom = require('boom');
const Joi = require('joi');
const mongoose = require('mongoose');
const _ = require('lodash');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var asyncCao = require('async');
var Promise = require('bluebird');

const Product = mongoose.model('Product');
const Category = mongoose.model('Category');
const Tag = mongoose.model('Tag');
const Banner = mongoose.model('Banner');
const productUtil = require('./../../api-product/util/product');

module.exports = {
    index,
};

function index(request, reply) {
    let tag_highlight = request.pre.getHighlightsTag;
    let list_product = request.pre.getListCategory;
    let promotes_active = request.pre.getPromotionActive;
    let list_promote = promotes_active.map(function (item) {
        return item._id;
    });
    let list_product_active = [];
    if (tag_highlight) {
        list_product_active = tag_highlight.product_tag.map(function (item) {
            return item._id;
        })
    }
    let select = 'name qty_in_stock price id_unit thumb view_unit slug made_in tag_product tag_processing id_promotion';

    var getListProductTag = function (tag_highlight, list_product) {
        return new Promise(function (resolve, reject) {
            let data = [];

            // Get list product each category
            let list_func = [];

            list_product.forEach(function (item) {
                list_func.push(function (callback) {
                    asyncCao.parallel({
                        in_products: function (cb) {
                            let promise = Product.find(productUtil.createOptDueDate({
                                category: {
                                    $in: productUtil.getCateSub(item)
                                },
                                id_promotion: {
                                    $in: list_promote
                                },
                            })).populate(productUtil.popuPromo()).select(select).lean();
                            promise.then(function (resp) {
                                cb(null, resp);
                            })
                        },
                        nin_products: function (cb) {
                            let promise = Product.find(productUtil.createOptDueDate({
                                category: {
                                    $in: productUtil.getCateSub(item)
                                },
                                id_promotion: {
                                    $nin: list_promote
                                },
                                _id: {
                                    $in: list_product_active
                                },
                                tag_product: {
                                    $elemMatch: {
                                        id_tag: {
                                            $in: [tag_highlight._id]
                                        }
                                    }
                                },
                            })).select(select).lean();

                            promise.then(function (resp) {
                                cb(null, resp);
                            })
                        }
                    }, function (err, result) {
                        let list_product = sortByOrderTag(result.nin_products, tag_highlight);
                        let products = result.in_products.concat(list_product);
                        callback(null, {
                            detail: item,
                            products: products,
                        });
                    })
                })
            });

            asyncCao.parallel(list_func, function (err, result) {
                resolve(result);
            })
        });
    };

    asyncCao.parallel({
        tag_products: function (cb) {
            if (tag_highlight) {
                Product.find(productUtil.createOptDueDate({
                    _id: {
                        $in: list_product_active
                    }
                })).populate(productUtil.popuPromo()).select(select).lean().then(function (resp) {
                    let tag_products = [{
                        detail: tag_highlight,
                        total: resp.length,
                        products: sortByPromotion(sortByOrderTag(resp, tag_highlight), tag_highlight),
                    }];
                    cb(null, tag_products);
                });
            }
            else {
                cb(null, []);
            }
        },
        product_category: function (cb) {
            getListProductTag(tag_highlight, list_product).then(function (resp) {
                cb(null, resp);
            })
        },
        banner_top_slide: function (cb) {
            let promise = Banner.find(productUtil.createOptBanner('home', 'top', 'slide')).sort({
                order: 1
            }).select('image link').lean();

            promise.then(function (resp) {
                cb(null, resp);
            })
        },
        banner_top_item: function (cb) {
            let promise = Banner.find(productUtil.createOptBanner('home', 'top', 'item')).sort({
                order: 1
            }).limit(4).select('image link').lean();

            promise.then(function (resp) {
                cb(null, resp);
            })
        },
        banner_bottom_item: function (cb) {
            let promise = Banner.find(productUtil.createOptBanner('home', 'bottom', 'item')).sort({
                order: 1
            }).limit(2).select('image link').lean();

            promise.then(function (resp) {
                cb(null, resp);
            })
        },
        category_mb: function (cb) {
            let category_mb = [];
            let images_cates = ['Artboard.svg', 'ArtboardCopy4.svg', 'ArtboardCopy2.svg', 'ArtboardCopy.svg', 'ArtboardCopy3.svg'];
            list_product.forEach(function (item, key) {
                category_mb.push({ cate: item, image: images_cates[key] })
            })
            cb(null, category_mb);
        }
    }, function (err, result) {
        let data = result.tag_products.concat(result.product_category);
        const Meta = request.server.plugins['service-meta'];
        let meta = JSON.parse(JSON.stringify(Meta.getMeta('home-page')));

        return reply.view('web-index/view/client/home/view', {
            class: { page: 'home' },
            data,
            banner_top_slide: result.banner_top_slide,
            banner_top_item: result.banner_top_item,
            banner_bottom_item: result.banner_bottom_item,
            category_mb: result.category_mb,
            meta
        }, { layout: 'web/layout' });
    });
};

function sortByOrderTag(product_arr, tag_highlight) {
    let list_tmp = [];
    let tmp_arr = [];
    product_arr.forEach(function (product) {
        let order = product.tag_product.find(function (item) {
            return item.id_tag.toString() == tag_highlight._id.toString();
        }).order;
        if (!tmp_arr[order]) {
            tmp_arr[order] = [];
        }
        tmp_arr[order].push(product);
    })

    tmp_arr.forEach(function (item) {
        item.forEach(function (product) {
            list_tmp.push(product);
        })
    });

    return list_tmp;
}

function sortByPromotion(product_arr, tag_highlight) {
    let list_have = [];
    let list_not_have = [];
    product_arr.forEach(function (product) {
        if (product.promotion) {
            list_have.push(product);
        }
        else {
            list_not_have.push(product);
        }
    })

    return list_have.concat(list_not_have);
}