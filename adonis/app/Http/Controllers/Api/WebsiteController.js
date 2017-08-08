'use strict'
const mongoose = use('mongoose');
const _ = require('lodash');

const Website = mongoose.model('Website');

class WebsiteController {

    * index(request, response) {
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

        let data = yield find();
        yield response.json({
            success: true,
            data
        })
    }

    * create(request, response) {
        //
    }

    * store(request, response) {
        let user = yield request.auth.check();
        let data = request.all().data;
        data.creater = user._id;
        let saveWebsite = new Website(data);
        let addWebsite = yield saveWebsite.save();

        yield response.json({
            success: true,
            addWebsite
        })
    }

    * show(request, response) {
        let params = request.params();
        let website = yield Website.findById(params.id).lean();
        yield response.json({
            website
        })
    }

    * edit(request, response) {
        //
    }

    * update(request, response) {
        let params = request.params();
        let data = request.all();
        let website = yield Website.findById(params.id);
        let websiteUpdate = _.extend(website, data.data);
        let websiteDone = yield websiteUpdate.save();

        yield response.json({
            success: true,
            website: websiteDone
        })
    }

    * destroy(request, response) {
        let params = request.params();
        let removeWebsite = yield Website.findByIdAndRemove(params.id);
        yield response.json({
            success: true
        })
    }

}

module.exports = WebsiteController
