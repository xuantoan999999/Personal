'use strict'
const Redis = use('Redis')
const aguid = require('aguid');

class AuthController {

    * signin(request, response) {
        let checkLogin = yield request.auth.check();
        if (checkLogin) {
            return yield response.redirect('/admin');
        }
        return yield response.sendView('admin.login');
    }

    * login(request, response) {
        let data = request.all();
        let email = data.username;
        let password = data.password;

        let token = yield request.auth.attempt(email, password);
        let idRedis = aguid();
        let session = yield Redis.set('Personal:' + idRedis, token);

        yield response.json({
            token,
            success: true
        })
    }
}

module.exports = AuthController
