import initVue from './../util/initVue.js'

let app = initVue.createVue('mod-exercice-2', {
    data: {
    },
    components: {  },
    computed: {
    },
    mounted() {
    },
    methods: {
        show(){
            this.$modal.show('popup-download');
        },
        hide () {
            this.$modal.hide('popup-download');
        }
    }
})