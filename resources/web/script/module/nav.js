import initVue from './../util/initVue.js'

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