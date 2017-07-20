<template>
    
</template>

<script>
    import Vue from 'vue'
    import axios from 'axios'
    import inputEff from './../main/input'
    import $ from 'jquery';
    import Vodal from 'vodal';
    import VueForm from 'vue-form';
    import _ from 'lodash';

    if (document.getElementById('user')) {
        const input = new inputEff()
        Vue.use(VueForm);

        Vue.component(Vodal.name, Vodal);

        var user = new Vue({
            el: '#user',
            data: {
                users: [],
                users_tmp: [],
                modal:{
                    showButton: false,
                    width: 600
                },
                formState:{}
            },
            mounted() {
                axios.get('/api/v1/nguoi-dung').then((resp) => {
                    this.users = resp.data.users;
                    this.users.forEach((item, index)=> {
                        this.users_tmp.push((JSON.parse(JSON.stringify(item))))
                    });
                })
            },
            methods: {
                showEdit(data, index) {
                    data.extra.edit = true;
                    setTimeout(() => { input.activate() }, 100)
                },
                hideEdit(data, index) {
                    data.extra.edit = false;
                    _.extend(data,this.users_tmp[index]);
                },
                showDelete(data, index) {
                    data.extra.delete = true;
                },
                hideDelete(data, index) {
                    data.extra.delete = false;
                },
                showChangePassword(data,index){
                    data.extra.show = true;
                    setTimeout(() => { input.activate() }, 100);
                },
                closeChangePassword(data,index){
                    data.extra.show = false;
                },
                changePassword(data, index){
                    if(!this.formState.$valid){
                        return;
                    }
                    if(data.extra.new_password_confirm != data.extra.new_password){
                        return;
                    }
                    axios.post('/api/v1/nguoi-dung/doi-mat-khau',{user: data}).then((resp) => {
                        this.formState._reset();
                        data.extra.new_password_confirm = '';
                        data.extra.new_password = '';
                        this.closeChangePassword(data,index);
                    })
                },
                remove(data, index) {
                    axios.delete(`/api/v1/nguoi-dung/${data._id}`).then((resp) => {
                        this.users.splice(index,1);
                        this.users_tmp.splice(index,1);
                    })
                },
                update(data, index) {
                    axios.post(`/api/v1/nguoi-dung/${data._id}`, {data}).then((resp) => {
                        console.log(resp);
                        data.extra.edit = false;
                        this.users_tmp[index] = (JSON.parse(JSON.stringify(data)))
                    })
                },
            }
        })
    }
</script>
