'use strict';

/*Chứa config chung của dev frontend thường xuyên thay đổi mỗi dự án*/

module.exports = {
    assets: {
        required: [
            'jquery',
            'tether',
            'bootstrap',
            'angular',
            'angular-cookies',
            'angular-resource',
            'angular-animate',
            'angular-toastr',
            'angular-toastr/dist/angular-toastr.min.css',
            'socket.io-client',
            'magnific-popup',
            'slick-carousel',
            'bootstrap/dist/css/bootstrap.css',
            'magnific-popup/dist/magnific-popup.css',
            'slick-carousel/slick/slick-theme.scss',
            'slick-carousel/slick/slick.scss',
            'vue'
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
};