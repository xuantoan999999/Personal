'use strict';

const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const Category = mongoose.model('Category');
const regexp = require(BASE_PATH + '/app/utils/regexp');

module.exports = {
	getBySlug,
	getCategoryBySlug,
	getPrelink
}

/**
 * Middleware
 */
 
function getBySlug(request, reply) {
    const slug = request.params.slug || request.payload.slug;
    let promise = Post.findOne({ 'slug': slug, 'status': 1 }).exec();
    promise.then(function (post) {
        reply(post);
    }).catch(function (err) {
        request.log(['error'], err);
        return reply(err);
    })
}

function getCategoryBySlug(request, reply) {
    if (request.params && request.params.category) {
        const slug = request.params.category
        let promise = Category.findOne({ 'slug': slug, 'status': 1 });
        promise.then(function (category) {
            reply(category);
        }).catch(function (err) {
            request.log(['error'], err);
            return reply.continue();
        })
    } else {
        return reply.continue();
    }
}

function getPrelink(request) {
    if (request.pre.category) {
        return '/' + request.pre.category.slug;
    }
    return '';
}
