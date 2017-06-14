const mongoose = require('mongoose');
const Page = mongoose.model('Page');

module.exports = {
    about,
    faq,
    term,
    help,
    support,
    error404,
    html
}

function about(request, reply) {
    let promise = Page.findOne({ 'slug': 'about' });
    promise
    .then(function (page) {
        let meta = {
            title: page.title,
            description: ''
        }
        return reply.view('web/html/web-page/about', { page: page, meta: meta });
    })
    .catch(function (err) {
        request.log(['error'], err);
        return reply.continue();
    });
}

function faq(request, reply) {
    let promise = Page.findOne({ 'slug': 'faq' });
    promise
    .then(function (page) {
        let meta = {
            title: page.title,
            description: ''
        }
        return reply.view('web/html/web-page/default', { page: page, meta: meta });
    })
    .catch(function (err) {
        request.log(['error'], err);
        return reply.continue();
    });
}

function term(request, reply) {
    let promise = Page.findOne({ 'slug': 'terms' });
    promise
    .then(function (page) {
        let meta = {
            title: page.title,
            description: ''
        }
        return reply.view('web/html/web-page/default', { page: page, meta: meta });
    })
    .catch(function (err) {
        request.log(['error'], err);
        return reply.continue();
    });
}

function help(request, reply) {
    let promise = Page.findOne({ 'slug': 'help' });
    promise
    .then(function (page) {
        let meta = {
            title: page.title,
            description: ''
        }
        return reply.view('web/html/web-page/default', { page: page, meta: meta });
    })
    .catch(function (err) {
        request.log(['error'], err);
        return reply.continue();
    });
}

function support(request, reply) {
    let promise = Page.findOne({ 'slug': 'support' });
    promise
    .then(function (page) {
        let meta = {
            title: page.title,
            description: ''
        }
        return reply.view('web/html/web-page/default', { page: page, meta: meta });
    })
    .catch(function (err) {
        request.log(['error'], err);
        return reply.continue();
    });
}

function error404(request, reply) {
    let promise = Page.findOne({ 'slug': 'error404' });
    promise
    .then(function (page) {
        let meta = {
            title: page.title,
            description: ''
        }
        return reply.view('web/html/web-page/404', { page: page, meta: meta }).code(404);
    })
    .catch(function (err) {
        request.log(['error'], err);
        return reply.continue();
    });
}

function html(request, reply) {
    const slug = request.params.slug || request.payload.slug;
    return reply.view('web/html/web-page/' + slug);
}
