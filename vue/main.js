/* eslint-disable*/

// import 'jquery'
import Vue from 'vue'
import Search from './client/Search.vue'
import App from './client/App.vue'
import 'bootstrap'
import 'adminbsb-materialdesign'

// Axios doesn't include Promise polyfill (e.g. 'es6-promise'), if you need one, here is a good place to initiate it

new Vue({
  el: '#app',
  components: {
    App,
    Search
  }
})