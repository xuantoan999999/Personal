'use strict'

class AdminAuthController {
    async login({ request, response }) {
        let data = request.all();
        let email = data.username;
        let password = data.password;

        // let token = yield request.auth.attempt(email, password);
        // let idRedis = aguid();
        // let session = yield Redis.set('Personal:' + idRedis, token);

        yield response.json({
            // token,
            success: true
        })
    }
}

module.exports = AdminAuthController
