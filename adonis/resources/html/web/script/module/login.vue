<template>
    <notifications></notifications>
</template>

<script>
    import Vue from 'vue'
    import axios from 'axios'
    import VueForm from 'vue-form';
    import vToastr from '../main/vue-toastr.js';

    if (document.getElementById('login')) {
        Vue.use(VueForm);
        let toastr = new vToastr();

        var acccount = new Vue({
            el: '#login',
            data: {
                formState: {},
                data:{
                    username: '',
                    password: ''
                }
            },
            mounted(){
            },
            methods:{
                login(){
                    if(!this.formState.$valid) return;
                    axios.post(`/api/v1/dang-nhap`, {
                        data: this.data
                    }).then((resp) => {
                        window.location.href = '/admin';
                    }).catch((resp) => {
                        toastr.error(resp.response.data.error.message, 'Lỗi')
                    })
                }
            }
        })
    }
</script>
