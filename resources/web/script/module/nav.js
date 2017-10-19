import initVue from './../util/initVue.js'
import axios from 'axios';

let app_header = initVue.createVue('mod-header', {
    data() {
        return {
            classHeader: ''
        }
    },
    mounted() {
        this.changeClassHeader();
        window.addEventListener('scroll', e => {
            this.changeClassHeader();
        });
        axios.get('/api/v1/common-web', {
            headers: {
                'Authorization': localStorage['Personal_userInfo']
            }
        }).then(({ data }) => {
            window.settings = data;
        })
    },
    methods: {
        changeClassHeader: function () {
            if (window.pageYOffset > 0)
                this.classHeader = 'fixed';
            else this.classHeader = '';
        }
    }
})