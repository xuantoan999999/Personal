'use strict'
const Helpers = use('Helpers');
const mongoose = require('mongoose');
const Hash = use('Hash')
const _ = use('lodash')

const User = mongoose.model('User');

class AdminUserController {
    async index({ request, response }) {
        let params = request.all();
        let page = parseInt(params.page) || 1;
        let itemsPerPage = parseInt(params.limit) || 10;

        let usersQuery = () => {
            return new Promise((resolve, reject) => {
                User.find().select('email name roles').sort('-_id').lean()
                    .paginate(page, itemsPerPage, (err, items, total) => {
                        return resolve({
                            totalItems: total,
                            totalPage: Math.ceil(total / itemsPerPage),
                            currentPage: page,
                            itemsPerPage: itemsPerPage,
                            users: items,
                        });
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

    async store({ request, response }) {
        let data = request.input('data');
        delete data.confirm_password;
        data.password = await Hash.make(data.password);
        let newUser = new User(data);
        let saveUser = await newUser.save();

        return response.send({
            success: true,
        })
    }

    async info({ request, response, params }) {
        let user = await User.findById(params.id).lean();
        return response.send({
            success: true,
            user
        })
    }

    async update({ request, response, params }) {
        let userNew = request.input('data');
        let userOld = await User.findById(params.id);
        let userUpdate = _.extend(userOld, userNew);
        await userUpdate.save();
        return response.send({
            success: true,
        })
    }

    async changePassword({ request, response, params }) {
        let data = request.input('data');
        data.password = await Hash.make(data.password);
        await User.findByIdAndUpdate(params.id, {
            password: data.password
        });
        return response.send({
            success: true,
            data
        })
    }

    async destroy({ request, response, params }) {
        await User.findByIdAndRemove(params.id);
        return response.send({
            success: true,
        })
    }
}

module.exports = AdminUserController
