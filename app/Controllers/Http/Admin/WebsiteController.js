'use strict'
const Helpers = use('Helpers');
const mongoose = require('mongoose');
const Hash = use('Hash');
const _ = use('lodash');

const Website = mongoose.model('Website');

class AdminWebsiteController {
    async index({ request, response }) {
        let params = request.all();
        let page = parseInt(params.page) || 1;
        let itemsPerPage = parseInt(params.limit) || 10;

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
            return new Promise(function (resolve, reject) {
                Website.find(option).lean().sort('-createdAt').paginate(page, itemsPerPage, (err, items, total) => {
                    let dataSend = {
                        totalItems: total,
                        totalPage: Math.ceil(total / itemsPerPage),
                        currentPage: page,
                        itemsPerPage: itemsPerPage,
                        websites: items,
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

    async store({ request, response, auth }) {
        let data = request.input('data');
        let currentUser = await auth.currentUser();
        data.creater = currentUser._id;
        let saveWebsite = new Website(data);
        await saveWebsite.save();

        return response.send({
            success: true,
        })
    }

    async info({ request, response, params }) {
        let website = await Website.findById(params.id).lean();
        return response.send({
            success: true,
            website
        })
    }

    async update({ request, response, params }) {
        let websiteNew = request.input('data');
        let websiteOld = await Website.findById(params.id);
        let websiteUpdate = _.extend(websiteOld, websiteNew);
        await websiteUpdate.save();

        return response.send({
            success: true,
        })
    }

    async destroy({ request, response, params }) {
        let removeWebsite = await Website.findByIdAndRemove(params.id);
        return response.send({
            success: true,
        })
    }
}

module.exports = AdminWebsiteController
