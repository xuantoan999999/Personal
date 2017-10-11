'use strict'

const Helpers = use('Helpers');
const mongoose = require('mongoose');
const _ = use('lodash');

const Facebook = mongoose.model('Facebook');

class AdminFacebookController {
    async index({ request, response }) {
        let params = request.all();
        let page = parseInt(params.page) || 1;
        let itemsPerPage = parseInt(params.limit) || 20;

        let option_and = [];
        let option = {};
        if (params.search) option_and.push({
            $or: [
                { name: new RegExp(params.search, 'i') },
                { link_website: new RegExp(params.search, 'i') },
            ]
        })
        if (option_and.length > 0) option = { $and: option_and };

        let find = () => {
            return new Promise((resolve, reject) => {
                Facebook.find(option).lean().sort('-createdAt')
                    .paginate(page, itemsPerPage, (err, items, total) => {
                        console.log(items);
                        let dataSend = {
                            totalItems: total,
                            totalPage: Math.ceil(total / itemsPerPage),
                            currentPage: page,
                            itemsPerPage: itemsPerPage,
                            facebooks: items,
                        };
                        resolve(dataSend);
                    });
            })
        }

        let data = await find();

        return response.send({
            success: true,
            data
        })
    }

    async store({ request, response }) {
        let data = request.input('data');
        let saveFacebook = new Facebook(data);
        await saveFacebook.save();

        return response.send({
            success: true,
        })
    }

    async info({ request, response, params }) {
        let facebook = await Facebook.findById(params.id).lean();
        return response.send({
            success: true,
            facebook
        })
    }

    async update({ request, response, params }) {
        let facebookNew = request.input('data');
        let facebookOld = await Facebook.findById(params.id);
        let facebookUpdate = _.extend(facebookOld, facebookNew);
        await facebookUpdate.save();

        return response.send({
            success: true,
        })
    }

    async destroy({ request, response, params }) {
        let removeWebsite = await Facebook.findByIdAndRemove(params.id);
        return response.send({
            success: true,
        })
    }
}

module.exports = AdminFacebookController
