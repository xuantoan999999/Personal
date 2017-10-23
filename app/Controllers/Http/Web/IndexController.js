'use strict'

const mongoose = use('mongoose');
const axios = use('axios')
const Env = use('Env')

const Account = mongoose.model('Account');
const Facebook = mongoose.model('Facebook');

class WebIndexController {
    async index({ request, view, response }) {
        let facebookNews = await Facebook.find().lean();
        return view.render('web.index', {
            text: 'This is hello text',
            activePage: 'home',
            facebookNews
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

    async getNewsFacebook({ request, view, response, params }) {
        let facebookToken = Env.get('FACEBOOK_TOKEN');
        let urlDetailFanpage = `https://graph.facebook.com/${params.fanpage}?access_token=${facebookToken}`;
        let detailFanpage = await axios.get(urlDetailFanpage);
        let urlPost = `https://graph.facebook.com/${detailFanpage.data.id}/posts?access_token=${facebookToken}&limit=6&fields=from,name,description,picture,permalink_url,object_id,message`;
        let newsFacebook = await axios.get(urlPost);
        return response.send({
            success: true,
            news: newsFacebook.data,
            detail: detailFanpage.data,
        })
    }

    async learn({ request, view, response, params }) {
        return view.render(`web.${params.slug}`, {
        });
    }
}

module.exports = WebIndexController
