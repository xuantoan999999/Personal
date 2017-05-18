'use strict';
const Boom = require('boom');
const Joi = require('joi');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Auditlog = mongoose.model('Auditlog');

const arrays = require('async-arrays')
arrays.proto();

const _ = require('lodash');
const fs = require('fs');
const util = require('util');
const moment = require('moment');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');

module.exports = {
    getAll,
    getAllUser,
};

function getAll(request, reply) {
    let options = {};
    let config = request.server.configManager;
    let page = parseInt(request.query.page) || 1;
    let itemsPerPage = parseInt(request.query.limit) || config.get('web.paging.itemsPerPage');

    if (request.query.action) {
        options.$or = [
            {
                action: new RegExp(request.query.action, 'i')
            },
            {
                description: new RegExp(request.query.action, 'i')
            }
        ]
    }

    if (request.query.actor) {
        options.actor = request.query.actor
    }

    if (request.query.label) {
        options.label = request.query.label;
    }

    if (request.query.date) {
        let date = request.query.date.split(' - ');
        // console.log(date[0],date[1]);
        let startDate = moment(date[0], 'DD/MM/YYYY').startOf('day')
        let endDate = moment(date[1], 'DD/MM/YYYY').endOf('day');
        options.date = {
            $gte: startDate,
            $lte: endDate,
        };
    }

    Auditlog.find(options)
        .sort('-date')
        .paginate(page, itemsPerPage, function (err, items, total) {
            let totalPage = Math.ceil(total / itemsPerPage);
            let dataSend = {
                totalItems: total,
                totalPage: totalPage,
                currentPage: page,
                itemsPerPage: itemsPerPage,
                items: items,
            };
            if (dataSend.items) {
                dataSend.items.forAllEmissions(function (item, index, next) {
                    dataSend.items[index] = item.toObject();
                    if (item.actor != 'guest') {
                        User.findById(item.actor, 'name email', function (err, user) {
                            if (err || !user)
                                next();
                            else {
                                dataSend.items[index].actor = user.toObject();
                                next();
                            }
                        });
                    }
                    else next();
                }, function () {
                    return reply(dataSend);
                });
            }
            else {
                return reply(dataSend);
            }
        });
}


function getAllUser(request, reply) {
    User.find({}, ' _id name email phone').lean().then(function (users) {
        return reply({
            success: true,
            data: users
        })
    }).catch(function (err) {
        return reply({
            success: true,
            data: err
        })
    })
}