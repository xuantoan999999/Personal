'use strict'
const mongoose = use('mongoose');
const jwt = require('jsonwebtoken')
const CE = require('@adonisjs/auth/src/Exceptions')
const Hash = use('Hash')
const Encryption = use('Encryption')
const aguid = require('aguid');
const Redis = use('Redis');
const Helpers = use('Helpers');

const User = mongoose.model('User');

class AdminAuthController {
    async login({ request, response }) {
        let data = request.all();
        let username = data.username;
        let password = data.password;

        // Get user
        let userLogin = await User.findOne(
            {
                $or: [
                    { email: new RegExp(username, 'i') },
                    { name: new RegExp(username, 'i') }
                ],
                roles: { $in: ['admin'] }
            }
        ).lean();

        if (!userLogin)
            throw new CE.UserNotFoundException(`Không tìm thấy user hoặc user không phải là admin`);

        // Check password user login
        let checkPassword = await Hash.verify(data.password, userLogin.password);
        if (!checkPassword)
            throw new CE.PasswordMisMatchException('Mật khẩu không khớp');


        let encrypted = Encryption.encrypt({
            user_id: userLogin._id
        });

        let idRedis = `PersonalUserLogin:${aguid()}`;
        let redis = await Redis.set(idRedis, encrypted);
        let token = jwt.sign(idRedis, 'secret');

        // let token = yield request.auth.attempt(email, password);
        return response.send({
            token
        })
    }
}

module.exports = AdminAuthController
