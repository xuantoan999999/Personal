<template>
    
</template>

<script>
    import Vue from 'vue'
    import axios from 'axios'
    import inputEff from './../main/input'

    if (document.getElementById('dashboard')) {
        const input = new inputEff()

        var dashboard = new Vue({
            el: '#dashboard',
            data: {
                formState:{}
            },
            mounted() {
            },
            methods: {
                logout(){
                    axios.get('/api/v1/dang-xuat').then((resp) => {
                        window.location.href = '/dang-nhap';
                    })
                }
            }
        })
    }
</script>
