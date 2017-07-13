'use strict'
const Banner = use('App/Model/Banner')
const Category = use('App/Model/Category')
const Database = use('Database')
const Env = use('Env')

class HomeController {

    * index(request, response) {
        var test = Category.all();
        console.log(test);
        try {
            yield Database.connection('mongodb');
            console.log("connected");
        } catch (error) {
            console.log("err", error);
        }
        yield response.sendView('web.welcome', {
            test: test
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
