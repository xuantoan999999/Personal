angular.module('Core')
    .service("Socket", Socket)
    .service("PubSub", PubSub)
    .service("Cart", Cart)
    .constant('KEY_LOCAL_STORAGE', {
        key_id_verhicle: 'id_verhicle',
        key_info_checkout: 'info_checkout',
        key_shipping_info: 'info_shiping'
    });

// set key to save info local verhice

function Socket($http, $cookies, $window) {
    var cookieKey = window.cmsname + '-token';
    var jwt = $cookies.get(cookieKey);

    console.log('Token: ' + jwt);
    if (!jwt || !jwt.length) {
        console.log('There is no token');
    }

    var socket = io($window.settings.services.socketApi);
    socket.on('connect', function () {
        socket.emit('authenticate', { token: jwt }); //send the jwt
        socket.on('authenticated', function () {
            // use the socket as usual
            console.log('User is authenticated');
        });
        socket.on('unauthorized', function (msg) {
            console.log("unauthorized: " + JSON.stringify(msg.data));
            throw new Error(msg.data.type);
        });
    });
    return socket;
}

function PubSub(Socket) {
    var container = [];
    return {
        getChannel: function (options) {

            var collectionName = options.collectionName;
            var action = options.action;
            var modelId = options.modelId;
            var method = options.method;

            var names = [];

            names.push(collectionName, action, modelId, method);
            names = names.filter(function (item) { //remove empty element
                return item ? true : false;
            });
            var channel = names.join('/');
            return channel;
        },
        subscribe: function (options, callback) {
            if (options) {
                var channel = this.getChannel(options);
                console.log("subscribe: " + channel);
                Socket.on(channel, callback);
                container.push(channel);
            } else {
                throw 'Options must be an object';
            }
        },
        publish: function (options, data, callback) {
            if (options) {
                var channel = this.getChannel(options);
                console.log("publish: " + channel);
                Socket.emit(channel, data, callback);
            } else {
                throw 'Options must be an object';
            }
        },
        unSubscribe: function (options) {
            var channel = this.getChannel(options);
            var index = container.indexOf(channel);
            container.splice(index, 1);

        },
        unSubscribeAll: function () {
            for (var index = 0; index < container.length; index++) {
                Socket.removeAllListeners(container[index]);
            }
            container = [];
        }

    }
}

function Cart(KEY_LOCAL_STORAGE) {
    return {
        addProduct: addProduct,
        removeProduct: removeProduct,
        getCart: getCart,
        removeCart: removeCart,
        saveProduct: saveProduct,
        getVerhicleId: getVerhicleId
    };

    function addProduct(product, quantity) {
        return { msg: 'Ok' }
    }

    function removeProduct(product) {
        return { msg: 'Ok' }
    }

    function getCart() {
        return { msg: 'Ok' }
    }

    function removeCart() {
        return { msg: 'Ok' }
    }

    // save product (verhicle) to local Storage
    function saveProduct(id) {
        var time = 30 * 24 * 60 * 60;
        if (typeof (Storage) !== "undefined") {
            Storage.set(KEY_LOCAL_STORAGE.key_id_verhicle, id, time);
        } else {
            console.error('The browser does not support Storage.');
        }
    }

    // get product (verhicle) from local Storage
    function getVerhicleId() {
        if (typeof (Storage) !== "undefined") {
            var data = Storage.get(KEY_LOCAL_STORAGE.key_id_verhicle);
            return data;
        } else {
            console.error('The browser does not support Storage.');
            return null;
        }
    }
}