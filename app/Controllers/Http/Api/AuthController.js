'use strict'
const mongoose = use('mongoose');
const jwt = require('jsonwebtoken');
const Encryption = use('Encryption');
const aguid = require('aguid');
const Redis = use('Redis');
const Helpers = use('Helpers');
const Env = use('Env')

const User = mongoose.model('User');

class ApiAuthController {
    async checkLogin({ request, response, auth }) {
        try {
            let data = request.all();
            let userLogin = await auth.getUserByToken(data.token);

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

    async commonWeb({ request, response, auth }) {
        let userLogin = await auth.currentUser();
        let facebookToken = Env.get('FACEBOOK_TOKEN');
        return response.send({
            userLogin,
            facebookToken
        });
    }
}

module.exports = ApiAuthController
