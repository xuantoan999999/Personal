'use strict'
const Database = use('Database')
const Env = use('Env')

class HomeController {

    * index(request, response) {
        yield response.sendView('web.welcome', {
            test: "Tesst"
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

module.exports = HomeController
