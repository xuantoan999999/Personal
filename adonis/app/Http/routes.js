'use strict'

/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
|
| AdonisJs Router helps you in defining urls and their actions. It supports
| all major HTTP conventions to keep your routes file descriptive and
| clean.
|
| @example
| Route.get('/user', 'UserController.index')
| Route.post('/user', 'UserController.store')
| Route.resource('user', 'UserController')
*/

const Route = use('Route')

Route.group('error', function () {
    Route.get('/error404', function* (request, response) {
        yield response.sendView('web.404');
    })
    Route.get('/404', function* (request, response) {
        yield response.sendView('web.404');
    })

    Route.get('/error500', function* (request, response) {
        yield response.sendView('web.500');
    })
    Route.get('/500', function* (request, response) {
        yield response.sendView('web.500');
    })
})

Route.group('web', function () {
    Route.get('/', 'Web/HomeController.index')
    Route.get('/tai-khoan', 'Web/AccountController.index')
})

Route.group('api', function () {
}).prefix('api/v1')