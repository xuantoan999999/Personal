'use strict'
const mongoose = use('mongoose');
const jwt = require('jsonwebtoken');
const Encryption = use('Encryption');
const aguid = require('aguid');
const Redis = use('Redis');
const Helpers = use('Helpers');

const User = mongoose.model('User');

class ApiAuthController {
    async checkLogin({ request, response }) {
        try {
            let data = request.all();
            let token = data.token;
            let idRedis = jwt.verify(token, 'secret');
            let userCache = await Redis.get(idRedis);
            let decrypted = Encryption.decrypt(userCache);
            let userLogin = await User.findById(decrypted.user_id).lean();

            return response.send({
                user: userLogin
            });
        } catch (error) {
            console.log(error);
            return response.send({
                user: null
            });
        }
    }
}

module.exports = ApiAuthController
