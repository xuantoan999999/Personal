'use strict'

class UserController {

    * index(request, response) {
        yield response.sendView('web.user', {
            sidebar_active: 'user',
        });
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

}

module.exports = UserController
