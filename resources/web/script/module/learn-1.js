import initVue from './../util/initVue.js'
import Slick from 'vue-slick';

// console.log(facebook);
let app = initVue.createVue('mod-exercice-1', {
    data: {
        text: 'VueJS: Include success',
        slickOptions: {
        },

    },
    components: { Slick  },
    mounted() {
    },
    methods: {
        next() {
            this.$refs.slick.next();
        },

        prev() {
            this.$refs.slick.prev();
        },
    }
})