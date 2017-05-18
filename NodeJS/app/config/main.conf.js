'use strict';
// const Bluebird = require('bluebird');

let config = {};

config.web = {

    port: process.env.FRONT_PORT || 9020,
    sessionKey: '6ketaq3cgrggdfgdfgdfgdfgo315rk9',
    cookieOptions: {
        ttl: 365 * 24 * 60 * 60 * 1000, // expires a year from today
        encoding: 'none',    // we already used JWT to encode
        path: '/',
        //isSecure: true,      // warm & fuzzy feelings
        isHttpOnly: false,    // prevent client alteration
        clearInvalid: true, // remove invalid cookies
        strictHeader: true   // don't allow violations of RFC 6265
    },
    paging: {
        defaultPageSize: 25,
        numberVisiblePages: 10,
        itemsPerPage: 10
    },
    db: {
        uri: 'mongodb://localhost/db_muahangviet',
        // options: {
        //     user: '',
        //     pass: ''
        // },
        prefixCollection: 'bz_'
    },
    elasticsearch: {
        ES_Sync: false,
        config: {
            hosts: [
            {
                protocol: 'http',
                host: 'localhost',
                port: 9200,
            },
            ],
            /*log: 'trace',*/
        }
    },
    mailer: {
        options: {
            pool: true,
            service: 'Gmail',
            auth: {
                user: 'muahangvietstaging@gmail.com',
                pass: 'muahangviet2017'
            },
            // host: 'smtp.kuikoo.com',
            // port: 465,
            // secure: true,
            // tls: {
            //     rejectUnauthorized: false /* allow invalid certificates*/
            // },
            logger: false, // log to console
            debug: false // include SMTP traffic in the logs
        },
        defaults: {
            from: 'info <sender@gmail.com>'
        }
    },
    email: {
        from: {
            "name": "Mua Hang Viet - Support",
            "address": "support@muahangviet.com.vn"
        },
        to: [],
        cc: [],
        bcc: []

    },
    log: {
        options: {
            transport: 'console',
            logFilePath: BASE_PATH + '/var/bunyan-log.log'
        }
    },
    redisOptions: {
        host: 'localhost',
        port: 6379,
        detect_buffers: true
    },
    upload: {
        path: process.cwd() + '/public/files',
        bannerPath: process.cwd() + '/public/files/banner/',
        postPath: process.cwd() + '/public/files/post/',
        productPath: process.cwd() + '/public/files/product/',
        productContentPath: process.cwd() + '/public/files/product_image_content/',
        productImgPath: '/files/product_image/',
        bannerImgPath: process.cwd() + '/files/banner_image/',

        thumbImgPath: '/public/files/thumb_image/',
        thumbImgContentPath: process.cwd() + '/public/files/thumb_image/',

        tempImgContentPath: process.cwd() + '/public/files/tmp/',
        thumbImgPathProduct: '/public/files/thumb_image/product_image/',
        thumbImgContentPathProduct: process.cwd() + '/public/files/thumb_image/product_image/',
        avatarImgPath: process.cwd() + '/public/files/avatar_image/',
        oldMediaPathProduct: '/files/media_old/product/',
        oldMediaContentPathProduct: process.cwd() + '/public/files/media_old/product/',
        oldMediaPath: '/files/media_old/',
        oldMediaContentPath: process.cwd() + '/public/files/media_old/',
    },
    connections: [
    {
        port: 2206,
        labels: ['web'],
        routes: {
            cors: {
                origin: ['*'],
                credentials: true
            }
        }
    },
    {
        port: 2207,
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
        port: 2208,
        labels: 'api',
        routes: {
            cors: {
                origin: ['*'],
                credentials: true
            }
        }
    },
    {
        port: 2209,
        labels: 'socket',
        routes: {
            cors: {
                origin: ['*'],
                credentials: true
            }
        }
    }
    ],
    allRoles: ['super-admin', 'admin', 'customer'],
    jwt: {
        secret: process.env.JWT_SECRET_CMS || 'jKErFlFEktfafasfaKLfghLoPrlafasflsdf0werr'
    },

    error: {
        notfound: {
            url: '/error404' //404 URL
        },
        permission: {
            url: '/error403' //403 URL
        },
        user: {
            login: '/admimhv/signin' // Login URL
        }
    },
    facebook: {
        clientID: process.env.FACEBOOK_ID || '427079307489462',
        clientSecret: process.env.FACEBOOK_SECRET || 'd78875d70774594c0b93d646c07cb6ab',
        callbackURL: '/auth/facebook/callback'
    },
    twitter: {
        clientID: process.env.TWITTER_KEY || 'yXwFK6ff3fOc8dvessqKvd9Z8',
        clientSecret: process.env.TWITTER_SECRET || 'k0w9heOObYwlwchdRBQ6tmHiPQN5O26nwz5XDzxPWPtby6llNx',
        callbackURL: '/auth/twitter/callback'
    },
    google: {
        clientID: process.env.GOOGLE_ID || '941481178075-mrmusgvq3asuq1relija3smn7psmogkh.apps.googleusercontent.com',
        clientSecret: process.env.GOOGLE_SECRET || 'sSIpuxYkac8r8LgXtVJ9pM6W',
        callbackURL: '/auth/google/callback'
    },

    context: {
        cmsprefix: '/admimhv',
        apiprefix: '/v1/api',
        app: {
            title: 'Mua Hàng Việt - Thực phẩm an toàn cho người Việt ',
            description: 'Mua Hàng Việt là dự án kết nối nông sản sạch dưới sự bảo trợ của Báo Thanh Niên, là nguồn cung cấp thực phẩm, rau, củ, quả hữu cơ tươi, sạch, an toàn tại Tp.HCM, ',
            keywords: '',
            og_title: 'Mua Hàng Việt - Thực phẩm an toàn cho người Việt ',
            og_description: 'Mua Hàng Việt là dự án kết nối nông sản sạch dưới sự bảo trợ của Báo Thanh Niên, là nguồn cung cấp thực phẩm, rau, củ, quả hữu cơ tươi, sạch, an toàn tại Tp.HCM, ',
            og_image: 'https://www.muahangviet.com.vn/assets/Logo.png',
            og_url: '/',
            og_type: 'website'
        },
        settings: {
            versionJs: '1.204',
            env: 'development',
            server: 'staging', //local, dev, staging, live
            GA: 'UA-78527913-2',
            GTM: 'GTM-TLQLQ4L',
            facebookId: process.env.FACEBOOK_ID || '870470899727751',
            services: {
                admin: 'http://localhost:2207',
                userApi: 'http://localhost:2208',
                contactApi: 'http://localhost:2208',
                socketApi: 'http://localhost:2208',
                uploadApi: 'http://localhost:2209',
                webUrl: 'http://localhost:2206'
            }

        },
        assets: {
            js: [
            ],
            css: [
            ]
        },
        adminassets: {
            js: [
            ],
            css: [
            ]
        }
    },
    category_level: 5,
    thumb_image_config:{
        product:{
            width: 248,
            height: 248
        }
    }
};

module.exports = config;