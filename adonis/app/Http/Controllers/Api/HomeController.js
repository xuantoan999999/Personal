'use strict'
const Redis = use('Redis')

class HomeController {
    * logout(request, response) {
        let token = yield request.session.get('Authorization')
        let session = yield Redis.set(`Personal:${token}`, null)
        yield request.session.forget('Authorization');
        yield response.json({ success: true })
    }
}

module.exports = HomeController
