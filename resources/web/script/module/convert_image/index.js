import initVue from './../../util/initVue.js';
import axios from 'axios';

let app = initVue.createVue('mod-convert-image', {
  data: {},
  computed: {},
  components: {},
  mounted() {},
  methods: {
    testOptimizeImage() {
      axios.get(`/test-optimize`).then(resp => {
        console.log(resp.data);
      }).catch(error => {
        console.log(error);
      })
    }
  }
})
