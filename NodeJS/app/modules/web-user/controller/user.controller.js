'use strict';
const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const _ = require('lodash');

const User = mongoose.model('User');
const Order = mongoose.model('Order');
const productUtil = require('./../../api-product/util/product');

module.exports = {
    info,
    favoriteProduct,
    shippingAddress,
    order,
    changePass
};

function info(request, reply) {
    const Meta = request.server.plugins['service-meta'];
    var meta = JSON.parse(JSON.stringify(Meta.getMeta('user-info')));
    let uid = request.auth.credentials.uid;

    if (!uid) {
        return reply.redirect('/');
    }
    let promise = User.findOne({ _id: uid });
    promise.then(function (user) {
        return reply.view('web-user/view/client/info/view', { data: user, meta: meta }, { layout: 'web/layout' });
    });

}


function favoriteProduct(request, reply) {
    let uid = request.auth.credentials.uid;
    const Meta = request.server.plugins['service-meta'];
    var meta = JSON.parse(JSON.stringify(Meta.getMeta('user-note')));
    if (!uid) {
        return reply.redirect('/');
    }
    let promise = User.findById(uid).populate({
        path: 'favorite_product',
        populate: [
            productUtil.popuIdPromo(),
        ],
        match: productUtil.createOptDueDate({})
    }).lean();
    promise.then(function (user) {
        return reply.view('web-user/view/client/favorite-product/view', { data: user.favorite_product, meta: meta }, { layout: 'web/layout' });
    });
}


function shippingAddress(request, reply) {
    let uid = request.auth.credentials.uid;
    const Meta = request.server.plugins['service-meta'];
    var meta = JSON.parse(JSON.stringify(Meta.getMeta('user-address')));
    if (!uid) {
        return reply.redirect('/');
    }
    let shippingfee = request.pre.shippingfee;
    let promise = User.findOne({ _id: uid }).populate('customer.shipping_address.id_shipping_fee');
    promise.then(function (user) {
        return reply.view('web-user/view/client/shipping-address/view', { data: { user, shippingfee }, meta: meta }, { layout: 'web/layout' });
    });
}


function order(request, reply) {
    let uid = request.auth.credentials.uid;
    const Meta = request.server.plugins['service-meta'];
    var meta = JSON.parse(JSON.stringify(Meta.getMeta('user-order')));
    if (!uid) {
        return reply.redirect('/');
    }
    let promise = Order.find({
        'payment_info.info.user_id': {
            $in: [uid]
        }
    }).sort('-id_order').populate('order_detail.product').lean();
    promise.then(function (order) {
        return reply.view('web-user/view/client/order/view', { data: order, meta: meta }, { layout: 'web/layout' });
    });
}


function changePass(request, reply) {
    let uid = request.auth.credentials.uid;
    const Meta = request.server.plugins['service-meta'];
    var meta = JSON.parse(JSON.stringify(Meta.getMeta('user-change-pass')));
    if (!uid) {
        return reply.redirect('/');
    }
    let promise = User.findOne({ _id: uid });
    promise.then(function (user) {
        return reply.view('web-user/view/client/change-pass/view', { data: "", meta: meta }, { layout: 'web/layout' });
    });
}
