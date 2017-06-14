'use strict';

let config = {};

config.web = {
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
    assets: {
        required: [
            'jquery',
            'tether',
            'bootstrap',
            'angular',
            'angular-cookies',
            'socket.io-client',
            'magnific-popup',
            'bootstrap/dist/css/bootstrap.css',
            'magnific-popup/dist/magnific-popup.css'
        ],
        include: {
            css: [
                'public/assets/dist/styles/vendor.css',
                'public/assets/dist/styles/main.css'
            ],
            js: [
                'public/assets/dist/scripts/vendor.js',
                'public/assets/dist/scripts/main.js'
            ]
        }
    },
    adminassets: {
        css: [
            'adminassets/admin-lte/bootstrap/css/bootstrap.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css',
            'adminassets/admin-lte/plugins/datatables/dataTables.bootstrap.css',
            'adminassets/admin-lte/dist/css/skins/skin-blue.min.css',
            'adminassets/admin-lte/dist/css/AdminLTE.min.css',
            'adminassets/jsoneditor/dist/jsoneditor.min.css',
            'adminassets/angular-toastr/dist/angular-toastr.min.css',
            'adminassets/bootstrap-daterangepicker/daterangepicker.css',
            'adminassets/admin-lte/plugins/select2/select2.min.css',
            'app/templates/admin/html/admin-*/client/style/*.css',
        ],
        js: [
            'adminassets/jquery/dist/jquery.min.js',
            'http://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js',
            'https://cloud.tinymce.com/stable/tinymce.min.js',
            'adminassets/bootstrap/dist/js/bootstrap.min.js',
            'adminassets/admin-lte/dist/js/app.min.js',
            'adminassets/angular/angular.js',
            'adminassets/angular-resource/angular-resource.js',
            'adminassets/angular-animate/angular-animate.js',
            'adminassets/angular-ui-router/release/angular-ui-router.js',
            'adminassets/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
            'adminassets/angular-file-upload/dist/angular-file-upload.min.js',
            'adminassets/angular-sanitize/angular-sanitize.min.js',
            'adminassets/ui-select/dist/select.js',
            'adminassets/tinymce/tinymce.min.js',
            'adminassets/angular-ui-tinymce/dist/tinymce.min.js',
            'adminassets/admin-lte/plugins/select2/select2.min.js',
            'adminassets/angular-messages/angular-messages.min.js',
            'adminassets/angular-input-masks/releases/angular-input-masks-standalone.min.js',
            'adminassets/angular-local-storage/dist/angular-local-storage.js',
            'adminassets/moment/min/moment.min.js',
            'adminassets/bootstrap-ui-datetime-picker/dist/datetime-picker.min.js',
            'adminassets/bootstrap-daterangepicker/daterangepicker.js',
            'adminassets/jsoneditor/dist/jsoneditor.min.js',
            'adminassets/ng-jsoneditor/ng-jsoneditor.js',
            'adminassets/angular-file-upload-shim/dist/angular-file-upload-shim.min.js',
            'adminassets/ng-file-upload/dist/ng-file-upload.min.js',
            'adminassets/angular-toastr/dist/angular-toastr.min.js',
            'adminassets/angular-ui-select2/src/select2.js',
            'app/templates/admin/html/admin-core/client/js/app.js',
            'app/templates/admin/html/admin-core/client/js/config.js',
            'app/templates/admin/html/admin-core/client/js/service.js',
            'app/templates/admin/html/admin-*/client/js/*.js',
        ]
    },
    portalassets: {
        css: [
            'portalassets/admin-lte/bootstrap/css/bootstrap.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css',
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
            'http://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js',
            'https://cloud.tinymce.com/stable/tinymce.min.js',
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
};

module.exports = config;
