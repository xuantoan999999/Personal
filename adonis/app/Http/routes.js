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
    Route.get('/error404', 'Web/ErrorController.error404')
    Route.get('/404', 'Web/ErrorController.error404')

    Route.get('/error500', 'Web/ErrorController.error500')
    Route.get('/500', 'Web/ErrorController.error500')
})

// Web Group
Route.group('web', function () {
    Route.get('/', 'Web/HomeController.index')
})

Route.group('auth', function () {
    Route.get('/dang-nhap', 'Web/AuthController.signin')
    Route.post('/dang-nhap', 'Web/AuthController.login')
})

// Api Group
Route.group('api', function () {
    // Start: Auth
    Route.get('/dang-xuat', 'Api/HomeController.logout')
    Route.post('/dang-nhap', 'Api/AuthController.login')
    // End: Auth

    // Start: User
    Route.get('/nguoi-dung', 'Api/UserController.index')
    Route.delete('/nguoi-dung/:id', 'Api/UserController.destroy')
    Route.post('/nguoi-dung', 'Api/UserController.store')
    Route.post('/nguoi-dung/:id', 'Api/UserController.update')
    Route.post('/nguoi-dung/doi-mat-khau', 'Api/UserController.changePassword')
    Route.post('/nguoi-dung/role/:id', 'Api/UserController.updateRole')
    // End: User

    // Start: Account
    Route.get('/tai-khoan', 'Api/AccountController.index')
    Route.post('/tai-khoan', 'Api/AccountController.store')
    Route.get('/tai-khoan/:id', 'Api/AccountController.edit')
    Route.post('/tai-khoan/:id', 'Api/AccountController.update')
    Route.delete('/tai-khoan/:id', 'Api/AccountController.destroy')
    // End: Account

}).prefix('/api/v1')

// Admin Group
Route.group('admin', function () {
    Route.get('/', 'Admin/HomeController.index')
    Route.get('/tai-khoan', 'Admin/AccountController.index')
    Route.get('/nguoi-dung', 'Admin/UserController.index')
}).prefix('admin').middleware('auth')
// .middleware('auth')