'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const Coupon = mongoose.model('Coupon');
const _ = require('lodash');
const array_sync = require('async-arrays').proto();
const async = require('async');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');

module.exports = {
    getAll,
    edit,
    save,
    update,
    del,
    getByCode,
    checkIsset
};

// Start : Handler list method
function getAll(request, reply) {
    let config = request.server.configManager;
    let page = request.query.page || 1;
    let itemsPerPage = parseInt(request.query.limit) || config.get('web.paging.itemsPerPage');
    let options = {};
    if (request.query.type == 'group') {
        options.type = 'group';
    }
    else {
        options.type = { $ne: 'group' };
    }

    if (request.query.keyword && request.query.keyword.length > 0) {
        let message = new RegExp(request.query.keyword, 'i');
        options.$or = [
            { code: message },
            { 'code_group.code': message },
            { name: message }
        ]
    }

    Coupon.find(options).populate({
        path: 'order',
        select: 'id_order'
    }).populate({
        path: 'order_group',
        select: 'id_order',
        match: { status: { $ne: 'CANCEL' } }
    }).sort('id').sort('-createdAt').lean().paginate(page, itemsPerPage, function (err, items, total) {
        if (err) {
            request.log(['error', 'list', 'coupon'], err);
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        let totalPage = Math.ceil(total / itemsPerPage);
        return reply({
            status: 1,
            totalItems: total,
            totalPage: totalPage,
            currentPage: page,
            itemsPerPage: itemsPerPage,
            items: items
        });
    });
}

function edit(request, reply) {
    const coupon = request.pre.coupon;
    if (coupon) {
        return reply(coupon)
    } else {
        return reply(Boom.notFound('Coupon is not found'));
    }
}

function getByCode(request, reply) {
    const coupon = request.pre.couponByCode;
    if (coupon) {
        return reply({ success: true, coupon: coupon });
    } else {
        return reply({ success: false, coupon: null });
    }
}


function save(request, reply) {
    if (request.pre.couponByCode) {
        return reply(Boom.badRequest('Mã đã tồn tại.'));
    }
    let dataRep = {
        number_success: 0,
        number_failed: 0,
    }
    let arr_coupon = request.payload.code.split(',');
    let createMany = function () {
        arr_coupon.splice(0, 1); // Xoa coupon dau tien da tao
        if (arr_coupon.length > 0) {
            arr_coupon.forAllEmissions(function (code, index, done) {
                if (code != '') {
                    let coupon = new Coupon(request.payload);
                    coupon.code = code;
                    coupon.name = coupon.name
                    let promise = coupon.save();
                    promise.then(function (coupon) {
                        request.auditLog.logEvent(
                            request.auth.credentials.uid,
                            'mongoose',
                            'save',
                            'coupon',
                            JSON.stringify({ new: coupon, old: null }),
                            'add new coupon'
                        );
                        dataRep.number_success++;
                        done();
                    }).catch(function (err) {
                        dataRep.number_failed++;
                        // request.log(['error', 'coupon'], err);
                        done()
                    });
                }
                else done();
            }, function () {
                return reply({ message: 'Tạo ' + dataRep.number_success + ' thành công và ' + dataRep.number_failed + ' lỗi' });
            })
        }
        else {
            return reply('Tạo thành công');
        }
    }

    let coupon = new Coupon(request.payload);
    coupon.code = arr_coupon[0];
    let promise = coupon.save();
    promise.then(function (coupon) {
        request.auditLog.logEvent(
            request.auth.credentials.uid,
            'mongoose',
            'save',
            'coupon',
            JSON.stringify({ new: coupon, old: null }),
            'add new coupon'
        );
        dataRep.number_success++;
        return createMany();
    }).catch(function (err) {
        return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}

function update(request, reply) {
    let coupon = request.pre.coupon;
    let codeCouponOld = coupon.code
    let codeCouponNew = request.payload.code;
    if (codeCouponNew != codeCouponOld) {
        if (request.pre.couponByCode) {
            return reply(Boom.badRequest('Mã đã tồn tại.'));
        }
    }
    request.auditLog.logEvent(
        request.auth.credentials.uid,
        'mongoose',
        'update',
        'coupon',
        JSON.stringify({ new: _.extend(coupon, request.payload), old: coupon }),
        'update coupon'
    );

    coupon = _.extend(coupon, request.payload);
    ;
    let promise = coupon.save();
    promise.then(function (coupon) {
        return reply(coupon);
    }).catch(function (err) {
        return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}

function del(request, reply) {
    const coupon = request.pre.coupon;
    request.auditLog.logEvent(
        request.auth.credentials.uid,
        'mongoose',
        'delete',
        'coupon',
        JSON.stringify({ new: null, old: coupon }),
        'delete coupon'
    );

    coupon.remove((err) => {
        if (err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        return reply(coupon);
    });
}

function checkIsset(request, reply) {
    let list_code = request.payload.data;
    let list_func = [];

    list_code.forEach(function (item) {
        list_func.push(function (cb) {
            let opt = [{
                $or: [
                    { code: item },
                    { 'code_group.code': item }
                ]
            }];
            if (request.query.coupon_id) {
                opt.push({
                    _id: { $ne: request.query.coupon_id }
                })
            }
            let check_coupon = Coupon.findOne({ $and: opt }).lean().select('code');

            check_coupon.then(function (resp) {
                if (resp) {
                    cb(null, { isset: true, code: item });
                }
                else {
                    cb(null, { isset: false });
                }
            })
        })
    })
    async.parallel(list_func, function (err, result) {
        let data = { isset: false };
        result.forEach(function (item) {
            if (item.isset && !data.isset) {
                data = item;
            }
        })
        return reply(data);
    })
}
