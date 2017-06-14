'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const _ = require('lodash');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const mongoose = require('mongoose');
const Message = mongoose.model('Message');

module.exports = {
    getAll,
    add,
    edit,
    save,
    update,
    remove
}

function getAll(request, reply) {
    let promise = Message.find({});
    promise.then(function(items) {
        console.log(items);
        return reply.view('web/html/web-message/list', { items: items });
    }).catch(function(err) {
        request.log(['error'], err);
        reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    })
}

function add(request, reply) {
    return reply.view('web/html/web-message/add');
}

function edit(request, reply) {
    const message = request.pre.message;
    if (message) {
        return reply.view('web/html/web-message/edit', { message: message });
    } else {
        reply(Boom.notFound('Message is not found'));
    }
}

function save(request, reply) {
    let message = new Message(request.payload);
    let promise = message.save();
    promise.then(function(message) {
        var io = request.server.plugins['hapi-io'].io;
        if (io) {
            let socketio = io.sockets;
            if (message.channel !== 'global') {
                socketio = socketio.in(message.channel);
            }
            socketio.emit('message/created', message);
        }
        request.log(['info', 'message'], message);
        reply.redirect('/message');
    }).catch(function(err) {
        request.log(['error', 'message'], err);
        reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}

function update(request, reply) {
    let message = request.pre.message;
    message = _.extend(message, request.payload);
    let promise = message.save();
    promise.then(function(message) {
        var io = request.server.plugins['hapi-io'].io;
        if (io) {
            let socketio = io.sockets;
            if (message.channel !== 'global') {
                socketio = socketio.in(message.channel);
            }
            socketio.emit('message/updated', message);
        }
        reply.redirect('/message');
    }).catch(function(err) {
        reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}

function remove(request, reply) {
    const message = request.pre.message;
    message.remove((err) => {
        var io = request.server.plugins['hapi-io'].io;
        if (io) {
            let socketio = io.sockets;
            if (message.channel !== 'global') {
                socketio = socketio.in(message.channel);
            }
            socketio.emit('message/deleted', message);
        }
        return reply.redirect('/message');
    });
}
