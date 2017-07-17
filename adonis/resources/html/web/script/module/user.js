import Vue from 'vue'
import axios from 'axios'
import inputEff from './../main/input'
import $ from 'jquery';

const input = new inputEff()

var user = new Vue({
    el: '#user',
    data: {
        users: [],
        users_tmp: [],
    },
    mounted() {
        axios.get('/api/v1/nguoi-dung').then((resp) => {
            this.users = resp.data.users;
            this.users.forEach(function (item, index) {
                this.users_tmp.push(item)
            }, this);
        })
    },
    methods: {
        showEdit(data, index) {
            data.edit = true;
            setTimeout(() => { input.activate() }, 100)
        },
        hideEdit(data, index) {
            data.edit = false;
        }
    }
})