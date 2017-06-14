const _ = require('lodash');
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const aguid = require('aguid');

const mongoose = require('mongoose');
const Promise = require("bluebird");
const Product = mongoose.model('Product');
const Order = mongoose.model('Order');
const User = mongoose.model('User');

class Cart {
    constructor(server) {
        this.redisClient = server.redis;
    }

    initCart(sessionId, product, quantity) {
        return initCart(this.redisClient, sessionId, product, quantity);
    }

    deleteCart(sessionId) {
        return deleteCart(this.redisClient, sessionId);
    }

    addProduct(sessionId, product, quantity) {
        return initCart(this.redisClient, sessionId, product, quantity);
    }

    removeProduct(sessionId, product) {
        return removeProduct(this.redisClient, sessionId, product)
    }

    setQuantity(sessionId, product, quantity) {
        let typeInit = 'SET_QTY'
        return initCart(this.redisClient, sessionId, product, quantity, typeInit);
    }

    getCart(sessionId) {
        return getCart(this.redisClient, sessionId);
    }
}

module.exports = Cart;

function initCart(redisClient, sessionId, product, quantity, typeInit) {
    return new Promise((resolve, reject) => {
        function createCart(sessionUser) {
            let id_cart = 'GU' + ':Cart:' + aguid();
            let cart = {
                id_cart: id_cart,
                items: [
                    {
                        id_product: product,
                        quantity: Number(quantity)
                    }
                ],
                createdAt: Date.now(),
                updatedAt: Date.now()
            };
            redisClient.set(id_cart, JSON.stringify(cart));
            sessionUser.id_cart = id_cart;
            redisClient.set(sessionId, JSON.stringify(sessionUser));
            return resolve({ success: true, msg: 'Created cart success' });
        };

        redisClient.get(sessionId, (err, sessionUser) => {
            if (err)
                return resolve({ success: false, msg: 'Can not get session user' })
            sessionUser = JSON.parse(sessionUser);
            if (!sessionUser) {
                return resolve({ success: false, msg: 'Can not get session user' })
            }
            // User đã chưa giỏ hàng
            if (sessionUser.hasOwnProperty('id_cart')) {
                redisClient.get(sessionUser.id_cart, (err, currentCart) => {
                    if (err) return createCart(sessionUser);
                    else {
                        currentCart = JSON.parse(currentCart);
                        let cartHasProduct = false; //flag product has in items
                        currentCart.items.forEach(function (item, index) {
                            if (item.id_product == product) {
                                cartHasProduct = true;
                                if (typeInit && typeInit == 'SET_QTY')
                                    currentCart.items[index].quantity = Number(quantity);
                                else
                                    currentCart.items[index].quantity = Number(currentCart.items[index].quantity) + Number(quantity);

                                if (currentCart.items[index].quantity <= 0)
                                    currentCart.items.splice(index, 1);

                            }
                        });
                        if (!cartHasProduct) {
                            currentCart.items.push({
                                id_product: product,
                                quantity: Number(quantity)
                            });
                        }
                        currentCart.updatedAt = Date.now();

                        redisClient.set(currentCart.id_cart, JSON.stringify(currentCart));
                        return resolve({ success: true, msg: 'Updated cart' });
                    }
                })
            }
            else {
                return createCart(sessionUser);
            }
        })
    })
}

function deleteCart(redisClient, sessionId) {
    return new Promise((resolve, reject) => {
        redisClient.get(sessionId, (err, sessionUser) => {
            if (err)
                return resolve({ success: false, msg: 'Can not get session user' })
            sessionUser = JSON.parse(sessionUser);
            if (sessionUser) {
                if (sessionUser.hasOwnProperty('id_cart')) {
                    redisClient.del(sessionUser.id_cart)
                    delete sessionUser.id_cart;
                    redisClient.set(sessionId, JSON.stringify(sessionUser));
                }
            }
            return resolve({ success: true, msg: 'Deleted cart' })
        });
    })
}

function removeProduct(redisClient, sessionId, product) {
    return new Promise(function (resolve, reject) {
        redisClient.get(sessionId, (err, sessionUser) => {
            if (err) {
                return resolve({ success: false, msg: 'Can not get session user' })
            }
            if (sessionUser) {
                sessionUser = JSON.parse(sessionUser);
                if (sessionUser.hasOwnProperty('id_cart')) {
                    redisClient.get(sessionUser.id_cart, function (err, cart) {
                        if (err) {
                            return resolve({ success: false, msg: 'Can not get cart' })
                        }
                        if (cart) {
                            cart = JSON.parse(cart);
                            cart.items.forEach((item, index) => {
                                if (item.id_product == product) {
                                    cart.items.splice(index, 1);
                                    cart.updatedAt = Date.now();
                                    redisClient.set(cart.id_cart, JSON.stringify(cart));
                                }
                            });
                        }
                    });
                }
            }
            return resolve({ success: true, msg: `Removed product ${product} cart` });
        });
    });
}

function getCart(redisClient, sessionId) {
    return new Promise((resolve, reject) => {
        var cart = {
            id_cart: null,
            items: [],
            createAt: null,
            updatedAt: null
        };
        let get = function () {
            redisClient.get(sessionId, function (err, sessionUser) {
                if (err) return reject(err);
                if (sessionUser) {
                    sessionUser = JSON.parse(sessionUser);

                    if (sessionUser.hasOwnProperty('id_cart')) {
                        redisClient.get(sessionUser.id_cart, function (err, resp) {
                            cart = JSON.parse(resp);
                            let setDetailProduct = function (index = 0) {
                                if (index == cart.items.length)
                                    return resolve(cart);
                                else {
                                    var query = Product.findOne({ _id: cart.items[index].id_product, type: 'PT' });
                                    query.select('name slug slug price_user price_agent stock status');
                                    // query.populate('brand model supplier');
                                    query.lean();
                                    query.exec(function (err, res) {
                                        if (err || !res) {
                                            cart.items.splice(index, 1);
                                            redisClient.set(cart.id_cart, JSON.stringify(cart));
                                            return get();
                                        }

                                        // Check status active product
                                        if (res.status != 1) {
                                            cart.items.splice(index, 1);
                                            redisClient.set(cart.id_cart, JSON.stringify(cart));
                                            return get();
                                        }

                                        // Check quanty in cart with qty in stock
                                        // remove qty's cart to max qty in stock if qty in cart > qty in stock

                                        if (res.stock < cart.items[index].quantity) {
                                            cart.items[index].quantity = res.stock;
                                            if (res.stock == 0) {
                                                cart.items.splice(index, 1);
                                            }
                                            cart.updatedAt = Date.now();
                                            redisClient.set(cart.id_cart, JSON.stringify(cart));
                                            // restart get process
                                            return get();
                                        }
                                        else {
                                            // continue get cart data and set detail product to cart
                                            cart.items[index].product = res;
                                            return setDetailProduct(index + 1);
                                        }
                                    });
                                }
                            };
                            if (err || !cart) {
                                return resolve({ cart });
                            }
                            return setDetailProduct(0);
                        });
                    }
                    else {
                        return resolve(cart);
                    }
                }
                else
                    return resolve(cart);
            })
        }
        return get();
    })
}