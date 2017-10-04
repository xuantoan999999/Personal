'use strict'
const mongoose = use('mongoose');
const jwt = require('jsonwebtoken')
const NE = require('node-exceptions')
const Encryption = use('Encryption')
const CE = require('@adonisjs/auth/src/Exceptions')
const BaseScheme = require('@adonisjs/auth/src/Schemes/Base')

const User = mongoose.model('User');
const Redis = use('Redis');

class MongoSchema extends BaseScheme {
    constructor() {
        super();
    }

    async currentUser() {
        let authorization = this._ctx.request.header('Authorization')
        let user = await this.getUserByToken(authorization);
        return user;
    }

    async getUserByToken(token) {
        let idRedis = jwt.verify(token, 'secret');
        let userCache = await Redis.get(idRedis);
        let decrypted = Encryption.decrypt(userCache);
        let user = await User.findById(decrypted.user_id).lean();
        return user;
    }
}

module.exports = MongoSchema;
