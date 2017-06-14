'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const Order = mongoose.model('Order');
const User = mongoose.model('User');
const _ = require('lodash');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');

module.exports = {
    getCart,
    addProduct,
    removeProduct,
    setQuantityProduct,
    deleteCart,

    getVerhicle,
};


// 592e8adbfa0c0b58a972c713
// 592e8ab5fa0c0b58a972c712	
function getCart(request, reply) {
    let Cart = request.server.plugins['api-cart']['cart-service'];
    let sessionID = request.auth.credentials ? request.auth.credentials.uid : '';

    Cart.getCart(sessionID).then(cart => {
        return reply({ sucess: true, cart })
    })
}

function addProduct(request, reply) {
    let Cart = request.server.plugins['api-cart']['cart-service'];
    let product = request.params.product || null;
    let quantity = request.params.quantity || 1;
    let sessionID = request.auth.credentials ? request.auth.credentials.uid : '';
    Cart.addProduct(sessionID, product, quantity).then(data => {
        return Cart.getCart(sessionID).then(cart => {
            return reply({ data, cart })
        })
    });
}

function removeProduct(request, reply) {
    let Cart = request.server.plugins['api-cart']['cart-service'];
    let product = request.params.product || null;
    let sessionID = request.auth.credentials ? request.auth.credentials.uid : '';
    Cart.removeProduct(sessionID, product).then(data => {
        return Cart.getCart(sessionID).then(cart => {
            return reply({ data, cart })
        })
    });
}


function setQuantityProduct(request, reply) {
    let Cart = request.server.plugins['api-cart']['cart-service'];
    let product = request.params.product || null;
    let quantity = request.params.quantity || 1;
    let sessionID = request.auth.credentials ? request.auth.credentials.uid : '';
    Cart.setQuantity(sessionID, product, quantity).then(data => {
        return Cart.getCart(sessionID).then(cart => {
            return reply({ data, cart })
        })
    });
}


function deleteCart(request, reply) {
    let Cart = request.server.plugins['api-cart']['cart-service'];
    let sessionID = request.auth.credentials ? request.auth.credentials.uid : '';
    Cart.deleteCart(sessionID).then(data => {
        return reply(data)
    }).catch(err => {
        return reply({ sucess: false, err: ErrorHandler.getErrorMessage(err) });
    })
}


function getVerhicle(request, reply) {
    let verhicle = request.pre.product;
    if (verhicle) {
        return reply(verhicle);
    }
    else {
        return reply(Boom.badRequest("Verhicle not found"))
    }
}