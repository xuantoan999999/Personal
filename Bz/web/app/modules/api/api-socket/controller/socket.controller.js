'use strict';

const Boom = require('boom');
const Joi = require('joi');
const _ = require('lodash');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const mongoose = require('mongoose');
const Message = mongoose.model('Message');

module.exports = {
  getAllMessage,
  joinRoom,
  leaveRoom
};

function getAllMessage(request, reply) {
  console.log('handle get messages');
  let promise = Message.find({});
  promise.then(function(items) {
    return reply(items);
  }).catch(function(err){
    request.log(['error'], err);
    reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
  })
}

function joinRoom(request, reply) {
  console.log('handle join joom');
  /*@TODO validate room and user before join*/
  reply({message: 'OK', room: request.params.roomId});
}

function leaveRoom(request, reply) {
  console.log('handle leave joom');
  /*@TODO validate room and user before join*/
  reply({message: 'OK', room: request.params.roomId});
}