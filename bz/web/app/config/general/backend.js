'use strict';

/*Chứa những config chung của dev thường xuyên thay đổi mỗi dự án*/

module.exports = {
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
    db: {
        uri: 'mongodb://localhost/db_gearup',
        options: {
            user: '',
            pass: ''
        }
    },
    context: {
        cmsprefix: '/tims',
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
    },
    adminassets: {
        css: [
            'adminassets/admin-lte/bootstrap/css/bootstrap.min.css',
            'adminassets/font-awesome/css/font-awesome.min.css',
            'adminassets/adminbsb-materialdesign/plugins/node-waves/waves.min.css',
            'adminassets/adminbsb-materialdesign/plugins/animate-css/animate.min.css',
            'adminassets/adminbsb-materialdesign/plugins/morrisjs/morris.css',
            'adminassets/adminbsb-materialdesign/css/style.min.css',
            'adminassets/adminbsb-materialdesign/css/themes/all-themes.min.css',
            // 'app/templates/admin/html/admin-*/client/style/*.css',
        ],
        js: [
            'adminassets/vue/dist/vue.min.js',
            'adminassets/jquery/dist/jquery.min.js',
            'adminassets/moment/min/moment.min.js',
            'adminassets/tether/dist/js/tether.min.js',
            'adminassets/bootstrap/dist/js/bootstrap.min.js',
            'adminassets/adminbsb-materialdesign/plugins/bootstrap-select/js/bootstrap-select.js',
            'adminassets/adminbsb-materialdesign/plugins/jquery-slimscroll/jquery.slimscroll.js',
            'adminassets/adminbsb-materialdesign/plugins/node-waves/waves.js',
            'adminassets/adminbsb-materialdesign/plugins/jquery-countto/jquery.countTo.js',
            'adminassets/adminbsb-materialdesign/plugins/raphael/raphael.min.js',
            'adminassets/adminbsb-materialdesign/plugins/morrisjs/morris.js',
            'adminassets/adminbsb-materialdesign/plugins/chartjs/Chart.bundle.js',
            'adminassets/adminbsb-materialdesign/plugins/flot-charts/jquery.flot.js',
            'adminassets/adminbsb-materialdesign/plugins/flot-charts/jquery.flot.resize.js',
            'adminassets/adminbsb-materialdesign/plugins/flot-charts/jquery.flot.pie.js',
            'adminassets/adminbsb-materialdesign/plugins/flot-charts/jquery.flot.categories.js',
            'adminassets/adminbsb-materialdesign/plugins/flot-charts/jquery.flot.time.js',
            'adminassets/adminbsb-materialdesign/plugins/jquery-sparkline/jquery.sparkline.js',
            'adminassets/adminbsb-materialdesign/js/admin.js',
            'adminassets/adminbsb-materialdesign/js/pages/index.js',
            'adminassets/adminbsb-materialdesign/js/demo.js',
            'app/templates/admin/html/admin-*/client/js/*.js',
        ]
    },
    portalassets: {
        css: [
            'portalassets/admin-lte/bootstrap/css/bootstrap.min.css',
            'portalassets/font-awesome/css/font-awesome.min.css',
            'portalassets/ionicons/dist/css/ionicons.min.css',
            'portalassets/admin-lte/plugins/datatables/dataTables.bootstrap.css',
            'portalassets/admin-lte/dist/css/skins/skin-blue.min.css',
            'portalassets/admin-lte/plugins/select2/select2.min.css',
            'portalassets/admin-lte/dist/css/AdminLTE.min.css',
            'portalassets/jsoneditor/dist/jsoneditor.min.css',
            'portalassets/angular-toastr/dist/angular-toastr.min.css',
            'app/templates/portal/html/portal-*/client/style/*.css',
        ],
        js: [
            'portalassets/jquery/dist/jquery.min.js',
            'portalassets/tether/dist/js/tether.min.js',
            'portalassets/tinymce/tinymce.js',
            'portalassets/bootstrap/dist/js/bootstrap.min.js',
            'portalassets/admin-lte/dist/js/app.min.js',
            'portalassets/angular/angular.js',
            'portalassets/angular-resource/angular-resource.js',
            'portalassets/angular-animate/angular-animate.js',
            'portalassets/angular-ui-router/release/angular-ui-router.js',
            'portalassets/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
            'portalassets/angular-file-upload/dist/angular-file-upload.min.js',
            'portalassets/angular-sanitize/angular-sanitize.min.js',
            'portalassets/ui-select/dist/select.js',
            'portalassets/tinymce/tinymce.min.js',
            'portalassets/angular-ui-tinymce/dist/tinymce.min.js',
            'portalassets/admin-lte/plugins/select2/select2.min.js',
            'portalassets/angular-messages/angular-messages.min.js',
            'portalassets/angular-input-masks/releases/angular-input-masks-standalone.min.js',
            'portalassets/angular-local-storage/dist/angular-local-storage.js',
            'portalassets/bootstrap-ui-datetime-picker/dist/datetime-picker.min.js',
            'portalassets/jsoneditor/dist/jsoneditor.min.js',
            'portalassets/ng-jsoneditor/ng-jsoneditor.js',
            'portalassets/angular-file-upload-shim/dist/angular-file-upload-shim.min.js',
            'portalassets/ng-file-upload/dist/ng-file-upload.min.js',
            'portalassets/angular-toastr/dist/angular-toastr.min.js',
            'app/templates/portal/html/portal-core/client/js/app.js',
            'app/templates/portal/html/portal-core/client/js/config.js',
            'app/templates/portal/html/portal-core/client/js/service.js',
            'app/templates/portal/html/portal-*/client/js/*.js',
        ]
    },
}