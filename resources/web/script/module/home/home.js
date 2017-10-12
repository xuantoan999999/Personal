import initVue from './../../util/initVue.js'
import facebookComponent from './facebookComponent'

// console.log(facebook);
let app = initVue.createVue('mod-home', {
    data: {
        text: 'VueJS: Include success'
    },
    components: { facebookComponent },
    mounted() {
    }
})