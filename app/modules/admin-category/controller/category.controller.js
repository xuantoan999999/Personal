'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const _ = require('lodash');
const slug = require('slug');
const async = require('async')

const Category = mongoose.model('Category');
const Product = mongoose.model('Product');

module.exports = {
    getAll,
    edit,
    add,
    getOneById,
    save,
    getAllChild,
    deleteItem,
    update
};
function getAll(request, reply) {
    let page = request.query.page || 1;
    let config = request.server.configManager;
    let itemsPerPage = parseInt(request.query.limit) || config.get('web.paging.itemsPerPage');
    let numberVisiblePages = config.get('web.paging.numberVisiblePages');

    let options = {};

    // get All or get Category level 1
    if (request.query.parrent_id != "*") {
        options.parrent_id = null;
    }

    if (request.query.keyword && request.query.keyword.length > 0) {
        let keyword = request.query.keyword;
        let slug_keyword = slug(keyword);

        options.$or = [
            { name: new RegExp(keyword, 'i') },
            { slug: new RegExp(keyword, 'i') },
            { slug: new RegExp(slug_keyword, 'i') }
        ];
        // fix search all category
        delete options['parrent_id'];
    }

    if (typeof request.query.id !== "undefined")
        options.id = request.query.id;

    Category.find(options).paginate(page, itemsPerPage, function (err, items, total) {
        if (err) {
            request.log(['error', 'list', 'page'], err);
            return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        let totalPage = Math.ceil(total / itemsPerPage);
        let dataRes = { status: '1', totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items };
        return reply(dataRes);

    });
}

function edit(request, reply) {
    let promise = Category.findOne({ slug: request.params.slug }).populate({
        path: 'products',
        select: 'name'
    }).populate('parent_category').lean();

    promise.then(function (resp) {
        if (resp) {
            return reply({
                category: resp,
                productList: request.pre.productList
            });
        }
        else {
            return reply({
                status: false,
                message: 'Category is not found!'
            });
        }

    }).catch(function (err) {
        return reply({
            status: false,
            message: err
        });
    })
}

function add(request, reply) {
    return reply({
        productsList: request.pre.productList,
        categoryList: request.pre.categoryList
    })
}

function getOneById(request, reply) {
    const categories = request.pre.categories;
    request.auditLog.logEvent(
        request.auth.credentials.uid,
        'mongoose',         //origin ex: mongoose or route
        'edit', //action : function name
        'category',            // label: module name
        JSON.stringify({ new: null, old: categories }),   //data new, old
        'get a categories'    //change log description
    );
    if (categories) {
        return reply(categories);
    } else {
        reply(Boom.notFound('Category is not found'));
    }
}

function save(request, reply) {
    let list_product = request.payload.products;
    let categories = new Category(request.payload);
    request.auditLog.logEvent(
        request.auth.credentials.uid,
        'mongoose',         //origin ex: mongoose or route
        'save', //action : function name
        'category',            // label: module name
        JSON.stringify({ new: categories, old: null }),   //data new, old
        'add new categories'    //change log description
    );

    let promise = categories.save();
    promise.then(function (categories) {
        let list_func = [];
        list_product.forEach(function (item) {
            list_func.push(function (callback) {
                let promise = Product.findById(item).then(function (product) {
                    product.category.push(categories._id);
                    product.save().then(function (resp) {
                        callback(null, { success: true });
                    })
                })
            })
        })

        async.parallel(list_func, function (err, result) {
            return reply(categories);
        })
    }).catch(function (err) {
        reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}

function update(request, reply) {
    let categories = request.pre.categories;
    categories = _.extend(categories, request.payload);
    let list_old_product = categories.products.map(function (item) {
        return item._id;
    });
    let list_new_product = categories.products_new;

    let list_func_remove = [];

    request.auditLog.logEvent(
        request.auth.credentials.uid,
        'mongoose',         //origin ex: mongoose or route
        'update', //action : function name
        'category',            // label: module name
        JSON.stringify({ new: _.extend(categories, request.payload), old: categories }),   //data new, old
        'update category'    //change log description
    );

    list_old_product.forEach(function (item) {
        list_func_remove.push(function (callback) {
            let promise = Product.findById(item);
            promise.then(function (product) {
                let index = product.category.indexOf(categories._id);
                product.category.splice(index, 1);
                product.save().then(function (resp) {
                    callback(null, { success: true });
                })
            })
        })
    });

    async.parallel(list_func_remove, function (err, result) {
        let list_func_add = [];

        list_new_product.forEach(function (item) {
            list_func_add.push(function (callback) {
                let promise = Product.findById(item);
                promise.then(function (product) {
                    let index = product.category.push(categories._id);
                    product.save().then(function (resp) {
                        callback(null, { success: true });
                    })
                })
            })
        });

        async.parallel(list_func_add, function (err, result) {
            let promise = categories.save();
            promise.then(function (categories) {
                reply(categories);
            }).catch(function (err) {
                reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            });
        })
    })
}

function deleteItem(request, reply) {
    const categories = request.pre.categories;
    request.auditLog.logEvent(
        request.auth.credentials.uid,
        'mongoose',         //origin ex: mongoose or route
        'delete', //action : function name
        'category',            // label: module name
        JSON.stringify({ new: null, old: categories }),   //data new, old
        'delete category'    //change log description
    );

    categories.remove((err) => {
        if (err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        return reply(categories);
    });
}

function getAllChild(request, reply) {
    let page = request.query.page || 1;
    let config = request.server.configManager;
    let itemsPerPage = config.get('web.paging.itemsPerPage');
    let numberVisiblePages = config.get('web.paging.numberVisiblePages');

    let options = {};
    let parrentId = request.params.parrentId;
    options.parrent_id = parrentId;

    if (request.query.keyword && request.query.keyword.length > 0) {
        let keyword = request.query.keyword;
        let slug_keyword = slug(keyword);

        options.$or = [
            {
                name: new RegExp(keyword, 'i')
            },
            {
                slug: new RegExp(keyword, 'i')
            },
            {
                slug: new RegExp(slug_keyword, 'i')
            }
        ];
        // fix search all category
        delete options['parrent_id'];
    }

    Category.find(options).paginate(page, itemsPerPage, function (err, items, total) {
        if (err) {
            request.log(['error', 'list', 'page'], err);
            return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        let totalPage = Math.ceil(total / itemsPerPage);
        let dataRes = { status: '1', totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items };
        return reply(dataRes);
    });
}