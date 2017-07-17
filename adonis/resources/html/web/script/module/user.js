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
        },
        showDelete(data, index) {
            data.delete = true;
        },
        hideDelete(data, index) {
            data.delete = false;
        },
        remove(data, index) {
            axios.delete(`/api/v1/nguoi-dung/${data._id}`).then((resp) => {
                this.users.splice(index,1);
                this.users_tmp.splice(index,1);
            })
        }
    }
})