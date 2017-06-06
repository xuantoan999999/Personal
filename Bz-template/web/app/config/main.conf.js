'use strict';

let config = {};
const Pack = require(global.BASE_PATH + '/package');

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
    db: {
        uri: 'mongodb://localhost/db_gearup',
        options: {
            user: '',
            pass: ''
        }
    },
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
        port: process.env.CMS_WEB_PORT || 9006,
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
        port: process.env.CMS_ADMIN_PORT || 9002,
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
        }
    },

    context: {
        cmsprefix: '/GadminU',
        portalprefix: '/portal',
        app: {
            title: 'GearUp',
            description: 'This is description bz cms',
            keywords: ''
        },
        settings: {
            services: {
                userApi: 'http://localhost:9001/v1',
                apiUrl: 'http://localhost:9001/v1/api',
                contactApi: 'http://localhost:9001/v1',
                socketApi: 'http://localhost:9001/v1',
                uploadApi: 'http://localhost:9001/v1',
                webUrl: 'http://localhost:9006'
            }
        }
    },
    onepay: {
        general: {
            'Title': 'VPC+3-Party',
            //Version module cổng thanh toán, cố định và mặc định là “2”
            'vpc_Version': '2',
            //Chức năng thanh toán,
            'vpc_Command': 'pay',
            //Ngôn ngữ hiển thị trên website. 
            'vpc_Locale': 'vn',
        },
        domestic: {
            config: {
                'secret': 'A3EFDFABA8653DF2342E8DAC29B51AF0',
                'vpcUrl': 'https://mtf.onepay.vn/onecomm-pay/vpc.op?',
                //Cặp tài khoản của mỗi đơn vị do
                'vpc_AccessCode': 'D67342C2',
                //Cặp tài khoản của mỗi đơn vị do
                'vpc_Merchant': 'ONEPAY',
            }
        },
        internal: {
            config: {
                secret: '6D0870CDE5F24F34F3915FB0045120DB',
                vpcUrl: 'https://mtf.onepay.vn/vpcpay/vpcpay.op?',
                //Cặp tài khoản của mỗi đơn vị do
                'vpc_AccessCode': '6BEB2546',
                //Cặp tài khoản của mỗi đơn vị do
                'vpc_Merchant': 'TESTONEPAY',
            }
        }
    }

};

module.exports = config;