'use strict'

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

        if (token) {
            return response.send({
                message: 'Logged In Successfully',
                token
            }).header('authorization', token).state(COOKIE_NAME_WEB, token);
        }

        return response.unauthorized('Invalid credentails')
    }
}

module.exports = AuthController
