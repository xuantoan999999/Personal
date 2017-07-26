'use strict'
const Redis = use('Redis')
const aguid = require('aguid');

class AuthController {

    * signin(request, response) {
        yield response.sendView('web.login');
    }

    * login(request, response) {
        // let user = yield request.auth.getUser();
        let data = request.all();
        let email = request.input('username');
        let password = request.input('password');

        let token = yield request.auth.attempt(email, password);
        let idRedis = aguid();
        let session = yield Redis.set('Personal:' + idRedis, token)
        console.log(session);

        if (token) {
            try {
                yield request.session.put('Authorization', idRedis);
                return response.send({ test: 'test', 'Authorization': idRedis });
            } catch (error) {
                console.log(error);
            }
        }
        return yield response.unauthorized('Invalid credentails')
    }
}

module.exports = AuthController
