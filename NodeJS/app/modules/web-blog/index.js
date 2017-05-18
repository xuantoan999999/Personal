'use strict';

const WebOrderController = require('./controller/web_blog.controller.js');

exports.register = function (server, options, next) {
    ///////// MẸO VẶT////////////
    server.route({
        method: ['GET'],
        path: '/meo-vat/{params*}',
        handler: WebOrderController.getListPostTips
    });
    server.route({
        method: 'GET',
        path: '/meo-vat/{articleName}-{articleId}',
        handler: WebOrderController.getDetailTip
    });

    ///////// GÓC BẾP ////////////
    server.route({
        method: ['GET', 'POST', 'PUT'],
        path: '/goc-bep/{params*}',
        handler: WebOrderController.listPostByTag
    });
    server.route({
        method: 'GET',
        path: '/goc-bep/{articleName}-{articleId}',
        handler: WebOrderController.getDetailPost
    });

    ///////// POLICY ////////////
    server.route({
        method: 'GET',
        path: '/{namePage}',
        handler: WebOrderController.getPolicyPage
    });

    ///////// KHUYẾN MÃI ////////////
    server.route({
        method: 'GET',
        path: '/chuong-trinh-khuyen-mai/{namePage}',
        handler: WebOrderController.getDetailPageKhuyenMai
    });

    //////////// NEWS ////////////
    server.route({
        method: ['GET', 'POST', 'PUT'],
        path: '/tin-tuc/{params*}',
        handler: WebOrderController.listNewsPost
    });
    server.route({
        method: 'GET',
        path: '/tin-tuc/{articleName}-{articleId}',
        handler: WebOrderController.getDetailNewsPost
    });

    //////////// REFULL API ////////////
    server.route({
        method: 'GET',
        path: '/blogs',
        handler: WebOrderController.getAllPost
    });
    server.route({
        method: 'GET',
        path: '/tags-blog',
        handler: WebOrderController.getAllTagBlog
    });


    next();
};

exports.register.attributes = {
    name: 'web-blog'
};
