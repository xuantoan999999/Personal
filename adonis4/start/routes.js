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

// Admin Group
Route.group(() => {
    Route.get('/', 'Admin/DashboardController.index')
    Route.post('/dang-nhap', 'Admin/AuthController.login')
    // Route.get('/', 'Admin/HomeController.index')
    // Route.get('/tai-khoan', 'Api/AccountController.index')
    // Route.get('/nguoi-dung', 'Admin/UserController.index')
}).prefix('admin')
// .middleware('auth')