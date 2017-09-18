'use strict'
const Redis = use('Redis')
const aguid = require('aguid');

class AuthController {

    * index(request, response) {
        //
    }

    * create(request, response) {
        //
    }

    * store(request, response) {
        //
    }

    * show(request, response) {
        //
    }

    * edit(request, response) {
        //
    }

    * update(request, response) {
        //
    }

    * destroy(request, response) {
        //
    }

    * login(request, response) {
        let data = request.all().data;
        let email = data.username;
        let password = data.password;

        let token = yield request.auth.attempt(email, password);

        if (token) {
            try {
                let idRedis = aguid();
                let session = yield Redis.set('Personal:' + idRedis, token);
                yield request.session.put('Authorization', idRedis);
                return yield response.json('/admin');
            } catch (error) {
                console.log(error);
            }
        }
        return yield response.unauthorized('Invalid credentails')
    }

    * getUserInfo(request, response) {
        return yield response.json({
            test: true
        })
    }

}

module.exports = AuthController
