'use strict'
const Helpers = use('Helpers');
const mongoose = require('mongoose');
const Hash = use('Hash')
const _ = use('lodash')

const Account = mongoose.model('Account');

class AdminAccountController {
    async index({ request, response }) {
        let params = request.all();
        let page = parseInt(params.page) || 1;
        let itemsPerPage = parseInt(params.limit) || 10;

        let usersQuery = () => {
            return new Promise((resolve, reject) => {
                Account.find().lean()
                    .paginate(page, itemsPerPage, (err, items, total) => {
                        return resolve({
                            totalItems: total,
                            totalPage: Math.ceil(total / itemsPerPage),
                            currentPage: page,
                            itemsPerPage: itemsPerPage,
                            accounts: items,
                        });
                    });
            })
        }
        let accountList = await usersQuery();

        return response.send({
            success: true,
            accountList
        })
    }

    // * index(request, response) {
    //     let params = request.all();
    //     let page = parseInt(params.page) || 1;
    //     let itemsPerPage = parseInt(params.limit) || 10;

    //     let option_and = [];
    //     let option = {};
    //     if (params.search) option_and.push({
    //         $or: [
    //             { name: new RegExp(params.search, 'i') },
    //             { website: new RegExp(params.search, 'i') },
    //         ]
    //     })
    //     if (option_and.length > 0) option = { $and: option_and };

    //     let find = () => {
    //         return new Promise(function (resolve, reject) {
    //             Account.find(option).lean().sort('-createdAt').paginate(page, itemsPerPage, (err, items, total) => {
    //                 let dataSend = {
    //                     totalItems: total,
    //                     totalPage: Math.ceil(total / itemsPerPage),
    //                     currentPage: page,
    //                     itemsPerPage: itemsPerPage,
    //                     accounts: items,
    //                 };
    //                 resolve(dataSend);
    //             });
    //         })
    //     }
    //     let dataSend = yield find();
    //     yield response.json(dataSend);
    // }

    // * create(request, response) {
    //     yield response.json({ success: true })
    // }

    // * store(request, response) {
    //     let user = yield request.auth.check();
    //     let data = request.all().data;
    //     data.creater = user._id;
    //     let saveAccount = new Account(data);
    //     yield saveAccount.save();

    //     yield response.json({
    //         success: true,
    //     })
    // }

    // * show(request, response) {
    //     //
    // }

    // * edit(request, response) {
    //     let params = request.params();
    //     let account = yield Account.findById(params.id).lean();
    //     yield response.json({
    //         account
    //     })
    // }

    // * update(request, response) {
    //     let params = request.params();
    //     let data = request.all();
    //     let account = yield Account.findById(params.id);
    //     let accountUpdate = _.extend(account, data.data);
    //     let accountDone = yield accountUpdate.save();

    //     yield response.json({
    //         success: true,
    //         account: accountDone
    //     })
    // }

    // * destroy(request, response) {
    //     let params = request.params();
    //     let removeAccount = yield Account.findByIdAndRemove(params.id);
    //     yield response.json({
    //         success: true
    //     })
    // }
}

module.exports = AdminAccountController
