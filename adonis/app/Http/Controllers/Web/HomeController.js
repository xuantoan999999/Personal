'use strict'

class HomeController {

    * index(request, response) {
        return yield response.sendView('web.home', {
            sidebar_active: 'dashboard',
        });
        // return yield response.redirect('/admin');
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

module.exports = HomeController
