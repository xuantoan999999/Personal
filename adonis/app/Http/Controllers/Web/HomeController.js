'use strict'
const Database = use('Database')
const Env = use('Env')
const mongoose = use('mongoose');
const Test = mongoose.model('Test');

class HomeController {

    * index(request, response) {
        let test = yield Test.find();
        yield response.sendView('web.dashboard', {
            test
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
