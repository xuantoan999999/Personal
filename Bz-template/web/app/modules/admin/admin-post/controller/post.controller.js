'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const _ = require('lodash');
const regexp = require(BASE_PATH + '/app/utils/regexp');
const mongoose = require('mongoose');
const Post = mongoose.model('Post');

module.exports = {
    getAll,
    edit,
    save,
    update,
    remove,
    moveToTrash,
    changeStatus,
    changeStatusMultiRows,
    deleteMultiRows,
};

function getAll(request, reply) {
    let config = request.server.configManager;
    let page = request.query.page || 1;
    let itemsPerPage = config.get('web.paging.itemsPerPage');
    let numberVisiblePages = config.get('web.paging.numberVisiblePages');

    var options = request.pre.options;

    Post
    .find(options)
    .populate('category')
    .lean().sort('-created')
    .paginate(page, itemsPerPage, function(err, items, total) {
        if (err) {
            request.log(['error', 'list', 'post'], err);
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        let totalPage = Math.ceil(total / itemsPerPage);
        let dataRes = { status: 1, totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items };
        reply(dataRes);
    });

}

function edit(request, reply) {
    let post = request.pre.post;
    if (post) {
        return reply(post);
    } else {
        reply(Boom.notFound('Post is not found'));
    }
}

function save(request, reply) {
    let post = new Post(request.payload);
    let promise = post.save();
    promise.then(function(post) {
        reply(post);
    }).catch(function(err) {
        request.log(['error', 'post'], err);
        reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));

    });
}

function update(request, reply) {
    let post = request.pre.post;
    post = _.extend(post, request.payload);
    let promise = post.save();
    promise.then(function(post) {
        reply(post);
    }).catch(function(err) {
        reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}

function remove(request, reply) {
    const post = request.pre.post;
    post.remove((err) => {
        return reply(post);
    });
}

function moveToTrash(request, reply) {
    const post = request.pre.post;
    if (post) {
        post.status = 2;
        post.save().then(function() {
            return reply({
                status: true,
                message: 'This post has been move to trash!'
            });
        })
    } else {
        return reply(Boom.notFound('Post is not found'));
    }
}

function changeStatus(request, reply) {

    const post = request.pre.post;
    let status = request.payload.currentStatus == 1 ? 0 : 1;
    if (post) {
        post.status = status;
        post.save().then(function() {
            return reply({
                status: true,
                message: 'This post has been change status'
            });
        })
    } else {
        return reply(Boom.notFound('Post is not found'));
    }
}

function changeStatusMultiRows(request, reply) {
    let status = request.payload.status;
    let filter_ids = request.pre.currentSelect;

    if (filter_ids) {
        Post
        .find({
            _id: {
                $in: filter_ids
            }
        })
        .then(function(posts) {
            _.each(posts, function(post) {
                post.status = status;
                post.save();
            })
            return reply({
                status: 1,
                message: 'Change status success'
            })
        })
    }
}

function deleteMultiRows(request, reply) {
    let status = request.payload.status;
    let currentStatusFilter = request.payload.currentStatusFilter;
    let filter_ids = request.pre.currentSelect;
    if (filter_ids) {
        Post
        .find({
            _id: {
                $in: filter_ids
            }
        })
        .then(function(posts) {
            _.each(posts, function(post) {
                if (currentStatusFilter == 2) {
                            // Delete permanent                            
                            post.remove();
                        } else {
                            // Move to trash
                            post.status = 2;
                            post.save();
                        }
                    });

            return reply({
                status: 1,
                message: 'Remove success'
            })
        })
    } else {
        return reply({
            status: 0,
            message: 'Remove error'
        })
    }
}
