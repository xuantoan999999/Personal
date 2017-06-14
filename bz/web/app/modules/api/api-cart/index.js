'use strict';

const CartController = require('./controller/cart.controller.js');
const CartMid = require('./middleware/cart.middleware.js');

exports.register = function (server, options, next) {

    var Cart = require('./util/cart.util.js');
    server.expose('cart-service', new Cart(server));

    server.route({
        method: 'GET',
        path: '/cart',
        handler: CartController.getCart,
        config: {
            auth: false,
            description: 'Get cart',
            tags: ['api'],
        }
    });

    server.route({
        method: ['GET', 'POST'],
        path: '/cart/{product}/{quantity?}',
        handler: CartController.addProduct,
        config: {
            auth: false,
            description: 'Add product to cart',
            tags: ['api'],
        }
    });

    server.route({
        method: 'DELETE',
        path: '/cart',
        handler: CartController.deleteCart,
        config: {
            auth: false,
            description: 'Delete cart',
            tags: ['api'],
        }
    });

    server.route({
        method: 'DELETE',
        path: '/cart/{product}',
        handler: CartController.removeProduct,
        config: {
            auth: false,
            description: 'Delete product in cart',
            tags: ['api'],
        }
    });

    server.route({
        method: ['PUT'],
        path: '/cart/{product}/{quantity}',
        handler: CartController.setQuantityProduct,
        config: {
            auth: false,
            description: 'Set quantity product cart',
            tags: ['api'],
        }
    });


    server.route({
        method: ['GET'],
        path: '/cart/verhicle/{id}',
        handler: CartController.getVerhicle,
        config: {
            pre: [
                { method: CartMid.getById, assign: 'product' }
            ],
            auth: false,
            description: 'Get verhicle info',
            tags: ['api'],
        }
    });

    return next();
};

exports.register.attributes = {
    name: 'api-cart'
};
