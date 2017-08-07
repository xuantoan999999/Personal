// CSS
import './css/main.scss';

// Library
import 'jquery';
import 'bootstrap';
import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'

// Script file main
import './script/main/left-sidebar.js';
import './script/main/search.js';
import './script/main/navbar.js';
import './script/main/input.js';
import './script/main/select.js';
import './script/main/dropdown-menu.js';
import './script/main/browser.js';
import './script/main/input.js';
import './script/main/done-loading.js';
import routes from './script/main/routes.js';

// Store module
import website from './script/store/website.js'
/**
 * Vue Router
 */
Vue.use(VueRouter);

const router = new VueRouter({
    routes: routes.list,
    linkActiveClass: 'active',
})

router.beforeEach((to, from, next) => {
    next();
})

/**
 * Vuex
 */
Vue.use(Vuex);
const store = new Vuex.Store({
    modules: {
        website
    }
})

const app = new Vue({
    router,
    store
}).$mount('#app')