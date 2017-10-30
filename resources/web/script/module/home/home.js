import initVue from './../../util/initVue.js';
import facebookComponent from './facebookComponent.vue';
import storeHome from './store';

let app = initVue.createVue('mod-home', {
    data: {
        message: 'VueJS: Include success'
    },
    computed: {
        facebookContent: function(){
            return storeHome.getters.getFacebook;
        },
    },
    components: { facebookComponent },
    mounted() {
    },
    
    methods: {
        
    }
})