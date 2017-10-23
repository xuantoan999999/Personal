import initVue from './../../util/initVue.js';
import facebookComponent from './facebookComponent.vue';

let app = initVue.createVue('mod-home', {
    data: {
        text: 'VueJS: Include success'
    },
    components: { facebookComponent },
    mounted() {
    },
    methods: {
        show() {
            this.$modal.show('hello-world');
        },
        hide() {
            this.$modal.hide('hello-world');
        }
    }
})