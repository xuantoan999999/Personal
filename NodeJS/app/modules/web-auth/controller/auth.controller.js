'use strict';
const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const _ = require('lodash');


module.exports = {
    resetPass
};


function resetPass(request, reply) {
    let user = request.pre.userByToken;
    const Meta = request.server.plugins['service-meta'];
    var meta = JSON.parse(JSON.stringify(Meta.getMeta('user-resset-pass')));
    if (!user || user.resetPasswordExpires < Date.now()) {
        return reply.redirect('/');
    }
    return reply.view('web-auth/view/client/reset-pass/view', { data: user, meta: meta }, { layout: 'web/layout' });
}







