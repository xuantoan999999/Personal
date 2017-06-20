'use strict';

let config = {};
const Pack = require(global.BASE_PATH + '/package');
const frontend = require('./general/frontend.js');
const backend = require('./general/backend.js');

config.web = {
    name: Pack.name,
    port: process.env.FRONT_PORT || 9006,
    sessionKey: '6ketaq3cgrggdfgdfgdfgdfgo315rk9',
    cookieOptions: {
        ttl: 365 * 24 * 60 * 60 * 1000, // expires a year from today
        // ttl: 7 * 24 * 60 * 60 * 1000, // expires a week from today
        encoding: 'none', // we already used JWT to encode
        path: '/',
        //isSecure: true,      // warm & fuzzy feelings
        isHttpOnly: false, // prevent client alteration
        clearInvalid: true, // remove invalid cookies
        strictHeader: true // don't allow violations of RFC 6265
    },
    paging: {
        defaultPageSize: 25,
        numberVisiblePages: 10,
        itemsPerPage: 20
    },
    db: backend.db,
    htmlCompress: false,
    isUseRedis: true,
    isUseVersionResource: true,
    mailer: {
        options: {
            pool: true,
            port: 465,
            host: 'email-smtp.eu-west-1.amazonaws.com',
            auth: {
                user: 'AKIAIALQZHWRD2AU7LCQ',
                pass: 'AtI4QGu8+oSEE1SAeXfsLlJQxLILpHUhsdeQsvKIB4TI'
            },
            logger: false, // log to console
            debug: false // include SMTP traffic in the logs
        },
        defaults: {
            from: 'info <sender@example.com>'
        }
    },
    email: {
        from: {
            "name": "info",
            "address": "info@bizzon.com.vn"
        },
        to: [{ //for admin
            "name": "admin",
            "address": "tu.tran@bizzon.com.vn"
        }],
        cc: [],
        bcc: []

    },
    log: {
        options: {
            transport: 'file',
            logFilePath: BASE_PATH + '/var/bunyan-log.log'
        }
    },
    redisOptions: {
        host: '127.0.0.1',
        port: 6379,
        detect_buffers: true
    },
    upload: {
        path: process.cwd() + '/public/files',
        bannerPath: process.cwd() + '/public/files/banner/',
        postPath: process.cwd() + '/public/files/post/',
        productPath: process.cwd() + '/public/files/product/',
        categoryPath: process.cwd() + '/public/files/category/'
    },
    connections: [
    {
        port: process.env.CMS_PORTAL_PORT || 9007,
        labels: ['portal'],
        routes: {
            cors: {
                origin: ['*'],
                credentials: true
            }
        },
        router: {
            stripTrailingSlash: false
        }
    },
    {
        port: process.env.CMS_WEB_PORT || 2207,
        labels: ['web'],
        routes: {
            cors: {
                origin: ['*'],
                credentials: true
            }
        },
        router: {
            stripTrailingSlash: false
        }
    },
    {
        port: process.env.CMS_ADMIN_PORT || 2206,
        labels: ['admin'],
        routes: {
            cors: {
                origin: ['*'],
                credentials: true
            },
            auth: {
                scope: ['admin']
            }
        }
    },
    {
        port: process.env.CMS_API_PORT || 9001,
        labels: 'api',
        routes: {
            cors: {
                origin: ['*'],
                credentials: true
            }
        }
    }
    ],
    jwt: {
        secret: process.env.JWT_SECRET_CMS || 'jKErFlFEktfafasfaKLfghLoPrlafasflsdf0werr'
    },

    error: {
        notfound: {
            url: '/error404' //404 URL
        },
        user: {
            login: '/login' // Login URL
        },
        admin: {
            login: '/GadminU/signin' // Login URL
        },
        portal: {
            login: '/portal/signin' // Login URL
        }
    },

    context: backend.context,

    facebook: backend.facebook,
    twitter: backend.twitter,
    google: backend.google,

    assets: frontend.assets,
    adminassets: backend.adminassets,
    portalassets: backend.portalassets,

    onepay: backend.onepay,
};

module.exports = config;