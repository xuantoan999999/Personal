'use strict'

const mongoose = use('mongoose');

const Account = mongoose.model('Account');

class WebIndexController {
    async index({ request, view }) {
        return view.render('web.index', {
            text: 'This is hello text'
        });
    }
}

module.exports = WebIndexController
