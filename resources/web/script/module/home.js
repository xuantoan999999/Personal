import initVue from './../util/initVue.js'
import axios from 'axios'

let app = initVue.createVue('mod-home', {
    data: {
        text: 'VueJS: Include success'
    },
    mounted() {
    }
})