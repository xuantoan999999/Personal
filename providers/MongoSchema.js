'use strict'
const mongoose = use('mongoose');
const jwt = require('jsonwebtoken')
const NE = require('node-exceptions')
const CE = require('@adonisjs/auth/src/Exceptions')

const User = mongoose.model('User');

class MongoSchema {
    constructor(request, serializer, options) {
        this.request = request;
        this.serializer = serializer;
        this.options = options;
    }
}

module.exports = MongoSchema;
