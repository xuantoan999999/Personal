'use strict'
const Redis = use('Redis')
const aguid = require('aguid');

class AuthController {

    * signin(request, response) {
        let checkLogin = yield request.auth.check();
        if (checkLogin) {
            return yield response.redirect('/admin');
        }
        return yield response.sendView('web.login');
    }

    * login(request, response) {
        let data = request.all();
        let email = request.input('username');
        let password = request.input('password');

        let token = yield request.auth.attempt(email, password);
        let idRedis = aguid();
        let session = yield Redis.set('Personal:' + idRedis, token);

        if (token) {
            try {
                yield request.session.put('Authorization', idRedis);
                return yield response.json({ success: true });
            } catch (error) {
                console.log(error);
            }
        }
        return yield response.unauthorized('Invalid credentails')
    }
}

module.exports = AuthController
