'use strict'
const Database = use('Database')
const Env = use('Env')
const mongoose = use('mongoose');
const Test = mongoose.model('Test');

class HomeController {

    * index(request, response) {
        yield response.sendView('admin.dashboard', {
            sidebar_active: 'dashboard',
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