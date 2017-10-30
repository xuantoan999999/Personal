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

//region web group
Route.get('/', 'Web/IndexController.index')
Route.get('/youtube', 'Web/IndexController.youtube')
Route.get('/convert-image', 'Web/IndexController.convert')
Route.get('/test-youtube', 'Web/IndexController.testYoutube')
Route.get('/facebook/:fanpage', 'Web/IndexController.getNewsFacebook')
Route.get('learn/:slug', 'Web/IndexController.learn')
Route.get('/facebook-post/:id', 'Web/IndexController.getDetailPostFacebook')

//endregion

//region Admin Group
Route.group(() => {
    Route.get('/', 'Admin/DashboardController.index')
    Route.get('/dash-board', 'Admin/DashboardController.getDashboard')
    Route.post('/dang-nhap', 'Admin/AuthController.login')

    /**
     * Module User
     */
    Route.get('/nguoi-dung', 'Admin/UserController.index')
    Route.delete('/nguoi-dung/:id', 'Admin/UserController.destroy')
    Route.post('/nguoi-dung', 'Admin/UserController.store')
    Route.get('/nguoi-dung/:id', 'Admin/UserController.info')
    Route.post('/nguoi-dung/:id', 'Admin/UserController.update')
    Route.post('/nguoi-dung-doi-mat-khau/:id', 'Admin/UserController.changePassword')

    /**
     * Module Account
     */
    Route.get('/tai-khoan', 'Admin/AccountController.index')
    Route.post('/tai-khoan', 'Admin/AccountController.store')
    Route.get('/tai-khoan/:id', 'Admin/AccountController.info')
    Route.post('/tai-khoan/:id', 'Admin/AccountController.update')
    Route.delete('/tai-khoan/:id', 'Admin/AccountController.destroy')

    /**
     * Module Website
     */
    Route.get('/website', 'Admin/WebsiteController.index')
    Route.post('/website', 'Admin/WebsiteController.store')
    Route.get('/website/:id', 'Admin/WebsiteController.info')
    Route.post('/website/:id', 'Admin/WebsiteController.update')
    Route.delete('/website/:id', 'Admin/WebsiteController.destroy')

    /**
     * Module Website
     */
    Route.get('/facebook', 'Admin/FacebookController.index')
    Route.post('/facebook', 'Admin/FacebookController.store')
    Route.get('/facebook/:id', 'Admin/FacebookController.info')
    Route.post('/facebook/:id', 'Admin/FacebookController.update')
    Route.delete('/facebook/:id', 'Admin/FacebookController.destroy')

}).prefix('admin')// .middleware('auth')
//endregion

//region Api
Route.group(() => {
    /**
     * Module Auth
     */
    Route.post('is-login', 'Api/AuthController.checkLogin')
    Route.get('common-web', 'Api/AuthController.commonWeb')
}).prefix('api/v1')
//endregion