'use strict'
const Helpers = use('Helpers');
const mongoose = require('mongoose');
const Hash = use('Hash');
const _ = use('lodash');

const Account = mongoose.model('Account');

class AdminAccountController {
    async index({ request, response }) {
        let params = request.all();
        let page = parseInt(params.page) || 1;
        let itemsPerPage = parseInt(params.limit) || 10;

        let option_and = [];
        let option = {};
        if (params.search)
            option_and.push({
                $or: [
                    { name: new RegExp(params.search, 'i') },
                    { website: new RegExp(params.search, 'i') },
                ]
            })
        if (option_and.length > 0) option = { $and: option_and };

        let usersQuery = () => {
            return new Promise((resolve, reject) => {
                Account.find(option).lean().sort('-createdAt')
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

    async store({ request, response, auth }) {
        let data = request.input('data');
        let currentUser = await auth.currentUser();
        data.creater = currentUser._id;
        let saveAccount = new Account(data);
        await saveAccount.save();

        return response.send({
            success: true,
        })
    }

    async info({ request, response, params }) {
        let account = await Account.findById(params.id).lean();
        return response.send({
            success: true,
            account
        })
    }

    async update({ request, response, params }) {
        let accountNew = request.input('data');
        let accountOld = await Account.findById(params.id);
        let accountUpdate = _.extend(accountOld, accountNew);
        let accountDone = await accountUpdate.save();

        return response.send({
            success: true,
        })
    }

    async destroy({ request, response, params }) {
        let removeAccount = await Account.findByIdAndRemove(params.id);
        return response.send({
            success: true,
        })
    }
}

module.exports = AdminAccountController
