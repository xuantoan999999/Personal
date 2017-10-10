'use strict'

const mongoose = use('mongoose');
const axios = use('axios')
const Account = mongoose.model('Account');

class WebIndexController {
    async index({ request, view, response }) {
        // let test = await axios.get('https://graph.facebook.com/beatvn.troll/posts?access_token=1561899710537365|LAbHspQ9kH8pajrVUGgE2RpljHw');
        // return response.send({
        //     success: true,
        //     test: test.data
        // })
        return view.render('web.index', {
            text: 'This is hello text',
            activePage: 'home'
        });
    }

    async youtube({ request, view }) {
        return view.render('web.index', {
            text: 'This is hello text',
            activePage: 'youtube'
        });
    }

    async convert({ request, view }) {
        return view.render('web.index', {
            text: 'This is hello text',
            activePage: 'tinyPNG'
        });
    }
}

module.exports = WebIndexController
