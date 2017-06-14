'use strict';

const Hapi = require('hapi');
var HapiCo = require("hapi-plugin-co");
const HapiKeaConfig = require('hapi-kea-config');
const server = new Hapi.Server();
global.BASE_PATH = __dirname;
global.TEMPLATES_PATH = __dirname + '/app/templates/';
global.SAMPLE_DATA_PATH = __dirname + '/app/templates/web/sample-data/';

server.register({
    register: HapiKeaConfig,
    options: {
        confPath: BASE_PATH + '/app/config',
        decorateServer: true
    }
});

const config = server.plugins['hapi-kea-config'];

let connections = config.get('web.connections');
connections.forEach(function (config) {
    server.connection(config);
}, this);
//registering hapi plugins and bootstrap app
require('./app/bootstrap/bootstrap.js')(server);

server.register(HapiCo, function () {
    server.start((err) => {
        if (err) {
            throw err;
        }
        server.log('info', 'Server ENV: ' + process.env.NODE_ENV);
        server.connections.forEach(function (connectionSetting) {
            server.log('info', 'Server running at: ' + connectionSetting.info.uri);
        });
    });
});

module.exports = server;