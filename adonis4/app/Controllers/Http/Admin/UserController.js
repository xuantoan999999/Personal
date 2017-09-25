'use strict'
const Helpers = use('Helpers');
const mongoose = use('mongoose');

const User = mongoose.model('User');

class AdminUserController {
    async index({ request, response }) {
        let params = request.all();
        let page = parseInt(params.page) || 1;
        let itemsPerPage = parseInt(params.limit) || 10;

        let usersQuery = () => {
            return new Promise((resolve, reject) => {
                User.find().lean().paginate(page, itemsPerPage, (err, items, total) => {
                    let dataSend = {
                        totalItems: total,
                        totalPage: Math.ceil(total / itemsPerPage),
                        currentPage: page,
                        itemsPerPage: itemsPerPage,
                        users: items,
                    };
                    return resolve(dataSend);
                });
            })
        }
        let usersList = await usersQuery();

        return response.send({
            success: true,
            params,
            page,
            itemsPerPage,
            usersList
        })
    }
    // * index(request, response) {
    //     let params = request.all();
    //     let page = parseInt(params.page) || 1;
    //     let itemsPerPage = parseInt(params.limit) || 10;

    //     let find = () => {
    //         return new Promise(function (resolve, reject) {
    //             User.find().lean().paginate(page, itemsPerPage, (err, items, total) => {
    //                 let dataSend = {
    //                     totalItems: total,
    //                     totalPage: Math.ceil(total / itemsPerPage),
    //                     currentPage: page,
    //                     itemsPerPage: itemsPerPage,
    //                     users: items,
    //                 };
    //                 resolve(dataSend);
    //             });
    //         })
    //     }
    //     let dataSend = yield find();

    //     dataSend.users.forEach((item) => {
    //         item.extra = {
    //             edit: false,
    //             delete: false,
    //             show: false,
    //             new_password: '',
    //             new_password_confirm: ''
    //         }
    //         if (!item.roles) item.roles = [];
    //     });
    //     yield response.json(dataSend)
    // }

    // * create(request, response) {
    //     //
    // }

    // * store(request, response) {
    //     let data = request.input('data');
    //     delete data.confirm_password;
    //     data.password = yield Hash.make(data.password);
    //     let newUser = new User(data);
    //     let saveUser = yield newUser.save();
    //     yield response.json({ success: true })
    // }

    // * show(request, response) {
    //     //
    // }

    // * edit(request, response) {
    //     //
    // }

    // * update(request, response) {
    //     let params = request.params();
    //     let data = request.all();
    //     let user = yield User.findById(params.id);
    //     let userUpdate = _.extend(user, data.data);
    //     yield userUpdate.save();
    //     yield response.json({ success: true })
    // }

    // * destroy(request, response) {
    //     let params = request.params();
    //     let removeUser = yield User.findByIdAndRemove(params.id);
    //     yield response.json({ success: true })
    // }

    // * changePassword(request, response) {
    //     let user = request.all().user;
    //     let userUpdate = yield User.findById(user._id);
    //     userUpdate.password = yield Hash.make(user.extra.new_password);
    //     yield userUpdate.save();
    //     yield response.json({ success: true })
    // }

    // * updateRole(request, response) {
    //     let params = request.params();
    //     let data = request.all();
    //     yield User.findByIdAndUpdate(params.id, { roles: data.roles })
    //     yield response.json({ success: true })
    // }
}

module.exports = AdminUserController
