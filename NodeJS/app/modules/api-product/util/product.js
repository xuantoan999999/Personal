'use strict';
const _ = require('lodash');
const moment = require("moment");
const async = require('asyncawait/async');
const asyncCao = require('async');
const await = require('asyncawait/await');
const globalWeb = global.configManager.getData();

module.exports = {
    autoPopCate,
    getCateSub,
    getCateParent,
    createOptDueDate,
    createOptBanner,
    checkImgOld,
    createOptDueDateObj,
    popuPromo,
    autoPro,
    popuIdPromo
};

// Auto create obj populate
function autoPopCate(path, count, obj) {
    let match = {};
    if (typeof count == 'undefined') {
        var category_level = global.config.web.category_level;
        var count = category_level || 5;
        var obj = {};
    }
    if (count == 0) {
        return obj;
    }
    return {
        path: path,
        populate: autoPopCate(path, count - 1),
        match: match,
    };
}

function getCateSub(category, cates_id) {
    if (!cates_id) cates_id = [];
    cates_id.push(category._id);
    if (category.sub_category && category.sub_category.length > 0) {
        category.sub_category.forEach(function (sub) {
            return getCateSub(sub, cates_id);
        })
    }
    return cates_id;
}

function getCateParent(category) {
    if (category.parent_category) return getCateParent(category.parent_category);
    return category;
}

function createOptDueDate(and_opt) {
    let time_present = moment();
    and_opt.active = true;
    return {
        $and: [
            and_opt,
            {
                $or: [
                    { 'due_date.end_date': null },
                    {
                        'due_date.start_date': { $lte: time_present },
                        'due_date.end_date': { $gte: time_present }
                    }
                ]
            }
        ]
    }
}

function createOptDueDateObj() {
    let time_present = moment();
    return {
        $or: [
            { 'due_date.end_date': null },
            {
                'due_date.start_date': { $lte: time_present },
                'due_date.end_date': { $gte: time_present }
            }
        ]
    }
}

function createOptBanner(page, position, type, category) {
    let opt = {
        page: page,
        position: position,
        type: type,
        status: true
    };

    if (category) {
        opt.category = category;
    }
    return opt;
}

function checkImgOld(new_url, image) {
    let tmp_arr = image.split('/');
    if (tmp_arr.length > 1) {
        let url = globalWeb.web.upload.oldMediaPathProduct.slice(0, -1);
        return url + image;
    }
    return new_url + image;
}


// Auto create obj promotion for populate
function autoPro() {
    let time_present = moment();
    return {
        $and: [{ status: true },
        {
            $or: [
                { expire_date: { $eq: null } },
                {
                    'expire_date.startDate': { $lte: time_present },
                    'expire_date.endDate': { $gte: time_present },
                }
            ]
        }]
    };
}
// Auto create obj promotion for populate
function popuPromo() {
    let time_present = moment();
    return {
        path: 'promotion',
        match: autoPro()
    }
}

function popuIdPromo() {
    let time_present = moment();
    return {
        path: 'id_promotion',
        match: autoPro()
    }
}