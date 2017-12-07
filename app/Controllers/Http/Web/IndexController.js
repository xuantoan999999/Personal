'use strict'

const mongoose = use('mongoose');
const axios = use('axios');
const Env = use('Env');
const tinify = use("tinify");
const fs = use("fs");

const Account = mongoose.model('Account');
const Facebook = mongoose.model('Facebook');

class WebIndexController {
  async index({
    request,
    view,
    response
  }) {
    let facebookNews = await Facebook.find().lean();
    return view.render('web.index', {
      text: 'This is hello text',
      activePage: 'home',
      facebookNews
    });
  }

  async youtube({
    request,
    view
  }) {
    return view.render('web.index', {
      text: 'This is hello text',
      activePage: 'youtube'
    });
  }

  async convert({
    request,
    view
  }) {
    return view.render('web.convert_image', {
      text: 'This is hello text',
      activePage: 'tinyPNG'
    });
  }

  async getNewsFacebook({
    request,
    view,
    response,
    params
  }) {
    let facebookToken = Env.get('FACEBOOK_TOKEN');
    let urlDetailFanpage = `https://graph.facebook.com/${params.fanpage}?access_token=${facebookToken}`;
    let detailFanpage = await axios.get(urlDetailFanpage);
    let urlPost = `https://graph.facebook.com/${detailFanpage.data.id}/posts?access_token=${facebookToken}&limit=6&fields=from,name,description,picture,permalink_url,object_id,message,full_picture`;
    let newsFacebook = await axios.get(urlPost);
    return response.send({
      success: true,
      news: newsFacebook.data,
      detail: detailFanpage.data,
    })
  }

  async learn({
    request,
    view,
    response,
    params
  }) {
    return view.render(`web.${params.slug}`, {});
  }

  async getDetailPostFacebook({
    request,
    view,
    response,
    params
  }) {
    let facebookToken = Env.get('FACEBOOK_TOKEN');
    let urlDetailPost = `https://graph.facebook.com/${params.id}?access_token=${facebookToken}&fields=from,name,description,picture,permalink_url,object_id,message`;
    let detailPost = await axios.get(urlDetailPost);
    let imagesPost = [];
    if (detailPost.object_id) {
      let imagesPost = await axios.get(`https://graph.facebook.com/${detailPost.object_id}/posts?access_token=${facebookToken}&fields=images`);
      imagesPost = imagesPost.data.images;
    }
    return response.send({
      success: true,
      detail: detailPost.data,
      images: imagesPost
    })
  }

  async testOptimize({
    request,
    view,
    response,
    params
  }) {
    tinify.key = Env.get('TINY_PNG_KEY');
    let path = `${process.cwd()}/public//files/`;
    let issetFolder = fs.existsSync(path + 'upload-image');
    if (!issetFolder) {
      fs.mkdirSync(path + 'upload-image');
    }
    // const filesUpload = fs.readdirSync(path+ 'upload');
    // filesUpload.forEach(item => {
    //     console.log(item);
    //     let source = tinify.fromFile(`${path}upload/${item}`);
    //     source.toFile(`${path}upload-image/${item}`);
    // });

    return response.send({
      success: true,
      path,
    })
  }
}

module.exports = WebIndexController
