// CSS
import './css/main.scss';

// Library
import 'jquery';
import 'bootstrap';
import Vue from 'vue'
import VueRouter from 'vue-router'

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

Vue.use(VueRouter)

const router = new VueRouter({
    routes: routes.list,
    linkExactActiveClass: 'active',
})

router.beforeEach((to, from, next) => {
    next();
})

const app = new Vue({
    router
}).$mount('#app')