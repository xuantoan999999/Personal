'use strict'

const mongoose = use('mongoose');

const Account = mongoose.model('Account');

class WebIndexController {
    async index({ request, view }) {
        // let data = await Account.find().lean();
        return view.render('web.game', {
            // data,
            text: 'This is hello text'
        });
    }
}

module.exports = WebIndexController
