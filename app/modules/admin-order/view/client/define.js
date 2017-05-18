;
(function () {
    'use strict';

    Application.registerModule('bzOrder');

    angular
        .module('bzOrder', [])
        .constant('statusOrderList', [
            {
                value: 'PROCCESS',
                name: 'Đang xử lý',
                group: '',
                bgColor: '#6d90f5'
            },
            {
                value: 'FINISH',
                name: 'Hoàn thành',
                group: '',
                bgColor: '#0dd077'
            },
            {
                value: 'CANCEL',
                name: 'Đã hủy',
                group: '',
                bgColor: '#ed7a7c',
                showPopup: true
            },
        ]).constant('shipperList', [
            {
                value: 'MHV',
                name: 'Mua Hàng Việt',
                group: ''
            },
            {
                value: 'SPT',
                name: 'SPT',
                group: ''
            },
            {
                value: 'AHM',
                name: 'Ahamove',
                group: ''
            },
            {
                value: 'GHN',
                name: 'GHN',
                group: ''
            }
        ]).constant('listVocative', [
            { name: "Anh", value: "Anh" },
            { name: "Chị", value: "Chị" },
            { name: "Cô", value: "Cô" },
            { name: "Chú", value: "Chú" },
            { name: "Bác", value: "Bác" },
            { name: "Ông", value: "Ông" },
            { name: "Bà", value: "Bà" }
        ]);
})();