'use strict'

class AuthController {

    * signin(request, response) {
        yield response.sendView('web.login');
    }

    * login(request, response) {
        let user = yield request.auth.getUser()

        yield response.json(user)
        // yield response.sendView('web.login');
    }
}

module.exports = AuthController
