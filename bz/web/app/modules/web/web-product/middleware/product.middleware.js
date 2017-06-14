'use strict';

const mongoose = require('mongoose');
const _ = require('lodash');

const Category = mongoose.model('Category');

module.exports = {
    getCategory
}
/**
 * Middleware
 */

function getCategory(type) {
    return function (request, reply) {

        let promise = Category.find({ type: type }).lean();
        promise.then(function (data) {
            return reply(data);
        }).catch(function (err) {
            return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });
    }
}