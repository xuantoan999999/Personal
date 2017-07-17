'use strict'

class AccountController {

    * index(request, response) {
        const isLoggedIn = yield request.auth.check()
        console.log(isLoggedIn);

        yield response.sendView('web.account', {
            sidebar_active: 'account',
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

module.exports = AccountController
