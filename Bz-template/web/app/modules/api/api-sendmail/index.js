'use strict';

const SendmailController = require('./controller/sendmail.controller.js');
const SendmailVal = require('./validate/sendmail.validate.js');

const internals = {};

exports.register = function (server, options, next) {
    var config = server.configManager;
    let queue = server.plugins['hapi-kue'];
    let emailHelper = require('./util/mail')(server, options);

    server.expose('sendMail', emailHelper.sendMail);

    server.route({
        method: 'GET',
        path: '/sendmail',
        handler: SendmailController.index,
        config: {
            auth: false,
            description: 'Service status',
            tags: ['api']
        }
    });

    server.route({
        method: 'POST',
        path: '/sendmail',
        handler: SendmailController.sendmail,
        config: {
            validate: SendmailVal.sendmail,
            description: 'Send email',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responses: { '400': { 'description': 'Bad Request' } },
                }
            }
        }
    });

    queue.processJob('api-sendmail', function (job, done) {
        // console.log('receive message');
        // console.log(job.data);
        let emailData = job.data;
        emailHelper.sendMail(emailData);
        done();
    });

    next();
};

exports.register.attributes = {
    name: 'api-sendmail'
};
