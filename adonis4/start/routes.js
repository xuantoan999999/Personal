'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/guides/routing
|
*/

const Route = use('Route')

Route.get('/', 'Web/IndexController.index')
Route.get('/test', 'Api/AuthController.checkLogin')

// Admin Group
Route.group(() => {
    Route.get('/', 'Admin/DashboardController.index')
    Route.post('/dang-nhap', 'Admin/AuthController.login')
    // Route.get('/', 'Admin/HomeController.index')
    // Route.get('/tai-khoan', 'Api/AccountController.index')
    // Route.get('/nguoi-dung', 'Admin/UserController.index')
}).prefix('admin')
// .middleware('auth')



Route.group(() => {
    /**
     * Module Auth
     */
    Route.post('is-login', 'Api/AuthController.checkLogin')
    // Route.post('/dang-nhap', 'Api/AuthController.login')
    // Route.post('/thong-tin-user', 'Api/AuthController.getUserInfo')

    /**
     * Module User
     */
    // Route.get('/nguoi-dung', 'Api/UserController.index')
    // Route.delete('/nguoi-dung/:id', 'Api/UserController.destroy')
    // Route.post('/nguoi-dung', 'Api/UserController.store')
    // Route.post('/nguoi-dung/:id', 'Api/UserController.update')
    // Route.post('/nguoi-dung/doi-mat-khau', 'Api/UserController.changePassword')
    // Route.post('/nguoi-dung/role/:id', 'Api/UserController.updateRole')

    /**
     * Module Account
     */
    // Route.get('/tai-khoan', 'Api/AccountController.index')
    // Route.post('/tai-khoan', 'Api/AccountController.store')
    // Route.get('/tai-khoan/:id', 'Api/AccountController.edit')
    // Route.post('/tai-khoan/:id', 'Api/AccountController.update')
    // Route.delete('/tai-khoan/:id', 'Api/AccountController.destroy')

    /**
     * Module Website
     */
    // Route.get('/website', 'Api/WebsiteController.index')
    // Route.post('/website', 'Api/WebsiteController.store')
    // Route.get('/website/:id', 'Api/WebsiteController.show')
    // Route.post('/website/:id', 'Api/WebsiteController.update')
    // Route.delete('/website/:id', 'Api/WebsiteController.destroy')
}).prefix('api/v1')