'use strict'
const mongoose = use('mongoose');
const _ = require('lodash');

const Account = mongoose.model('Account');

class AccountController {

    * index(request, response) {
        let params = request.all();
        let page = parseInt(params.page) || 1;
        let itemsPerPage = parseInt(params.limit) || 10;

        let find = () => {
            return new Promise(function (resolve, reject) {
                Account.find().lean().paginate(page, itemsPerPage, (err, items, total) => {
                    let dataSend = {
                        totalItems: total,
                        totalPage: Math.ceil(total / itemsPerPage),
                        currentPage: page,
                        itemsPerPage: itemsPerPage,
                        accounts: items,
                    };
                    resolve(dataSend);
                });
            })
        }

        let dataSend = yield find();
        yield response.json(dataSend);
    }

    * create(request, response) {
        yield response.json({ success: true })
    }

    * store(request, response) {
        let user = yield request.auth.check();
        let data = request.all().data;
        data.creater = user._id;
        let saveAccount = new Account(data);
        yield saveAccount.save();

        yield response.json({
            success: true,
        })
    }

    * show(request, response) {
        //
    }

    * edit(request, response) {
        let params = request.params();
        let account = yield Account.findById(params.id).lean();
        yield response.json({
            account
        })
        //
    }

    * update(request, response) {
        let params = request.params();
        let data = request.all();
        let account = yield Account.findById(params.id);
        let accountUpdate = _.extend(account, data.data);
        let accountDone = yield accountUpdate.save();

        yield response.json({
            success: true,
            account: accountDone
        })
    }

    * destroy(request, response) {
        //
    }
}

module.exports = AccountController
