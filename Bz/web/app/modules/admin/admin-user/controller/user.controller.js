'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const Bcrypt = require('bcrypt');
const pagination = require('pagination');
const _ = require('lodash');
const crypto = require('crypto');
const regexp = require(BASE_PATH + '/app/utils/regexp');

module.exports = {
    getAll,
    edit,
    save,
    update,
    remove,
    moveToTrash,
    changeStatus,
    changeStatusMultiRows,
    deleteMultiRows,
};

function getAll (request, reply) {
    let page = request.query.page || 1;
    let config = request.server.configManager;
    let itemsPerPage = config.get('web.paging.itemsPerPage');
    let numberVisiblePages = config.get('web.paging.numberVisiblePages');

    let options = request.pre.options;
    let { notPage } = request.payload || request.query;

    /* có phân trang hay không*/
    if(notPage){
        User.find(options,'_id name email phone status agent supplier roles').sort('id')
        .then(users => {
           let dataRes = { status: 1,items: users };
           return reply(dataRes);
       }).catch(err => {
        return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
   }else{
    User.find(options).sort('id').paginate(page, itemsPerPage, function (err, items, total) {
        if (err) {
            request.log(['error', 'list', 'user'], err);
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        let totalPage = Math.ceil(total / itemsPerPage);
        let dataRes = { status: 1, totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items };
        reply(dataRes);
    });
}
}

function changeStatus (request, reply) {

    User.update({ _id: request.params.id }, { $set: { status: request.params.status } }, function (err) {
        if (err) {
            return reply(Boom.forbidden("403"));
        }
    });
    return reply.redirect('/user/list');
}

function edit (request, reply) {
    let user = request.pre.user;
    if (user) {
        return reply(user);
    } else {
        reply(Boom.notFound('User is not found'));
    }
}

function save(request, reply) {
    if (request.pre.userByEmail) {
        return reply(Boom.badRequest('Email taken'));
    }
    if (request.payload.password != request.payload.cfpassword) {
        return reply(Boom.badRequest('Confirm new password does not match'));
    }
    delete request.payload.cfpassword;

    let user = new User(request.payload);
    user.provider = 'local';
    user.hashPassword(request.payload.password, function (err, hash) {
        user.password = hash;
            // const token = crypto.randomBytes(20).toString('hex');
            // user.activeToken = token;
            const promise = user.save();
            promise.then(user => {
                user = user.toObject();
                delete user.password;
                //@TODOsend email welcome here
                return reply(user);
            }).catch(err => {
                return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            });
        });
}

function update (request, reply) {
    let user = request.pre.user;
    if (!request.payload.password) {
        delete request.payload.password;
    } else if (request.payload.password !== request.payload.cfpassword) {
        return reply(Boom.badRequest('Confirm new password does not match'));
    }
    delete request.payload.cfpassword;
    user = _.assignIn(user, request.payload);
    console.log(user);
    let saveUser = function (user) {
        let promise = user.save();
        promise.then(function (user) {
            reply(user);
        }).catch(function (err) {
            return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });
    }
    if (request.payload.password) {
        user.hashPassword(request.payload.password, function (err, hash) {
            user.password = hash;
            saveUser(user);

        });
    } else {
        saveUser(user);
    }
}

function remove (request, reply) {
    const user = request.pre.user;
    user.remove((err) => {
        return reply(user);
    });
}

function moveToTrash (request, reply) {

    const user = request.pre.user;
    if (user) {
        user.status = 2;
        user.save().then(function () {
            return reply({
                status: true,
                message: 'This user has been move to trash!'
            });
        })
    } else {
        return reply(Boom.notFound('User is not found'));
    }
}

function changeStatus(request, reply) {

    const user = request.pre.user;
    let status = request.payload.currentStatus == 1 ? 0 : 1;
    if (user) {
        user.status = status;
        user.save().then(function () {
            return reply({
                status: true,
                message: 'This user has been change status'
            });
        })
    } else {
        return reply(Boom.notFound('User is not found'));
    }
}

function changeStatusMultiRows(request, reply) {
    let status = request.payload.status;
    let filter_ids = request.pre.currentSelect;

    if (filter_ids) {
        User
        .find({
            _id: {
                $in: filter_ids
            }
        })
        .then(function (users) {
            _.each(users, function (user) {
                user.status = status;
                user.save();
            })
            return reply({
                status: 1,
                message: 'Change status success'
            })
        })
        .catch(err => {
            return reply({
                status: 0,
                message: Boom.badRequest(ErrorHandler.getErrorMessage(err))
            })
        });
    }
}

function deleteMultiRows(request, reply) {
    let status = request.payload.status;
    let currentStatusFilter = request.payload.currentStatusFilter;
    let filter_ids = request.pre.currentSelect;
    if (filter_ids) {
        User
        .find({
            _id: {
                $in: filter_ids
            }
        })
        .then(users => {
            _.each(users, function (user) {
                if (currentStatusFilter == 2) {
                            // Delete permanent                            
                            user.remove();
                        } else {
                            // Move to trash
                            user.status = 2;
                            user.save();
                        }
                    });

            return reply({
                status: 1,
                message: 'Remove success'
            })
        })
        .catch(err => {
            return reply({
                status: 0,
                message: Boom.badRequest(ErrorHandler.getErrorMessage(err))
            })
        });
    }
}
