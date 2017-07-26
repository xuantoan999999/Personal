'use strict'

class ErrorController {
    * error404(request, response) {
        yield response.sendView('web.404');
    }
    * error500(request, response) {
        yield response.sendView('web.500');
    }
}

module.exports = ErrorController
