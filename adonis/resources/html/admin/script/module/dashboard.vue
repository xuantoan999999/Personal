<template>
    <div class="row">
        <div class="col-xs-12">
            <div class="card">
                <div class="header">
                    <h2>DASHBOARD</h2>
                </div>
                <div class="body" id="dashboard">
                    <button class="btn btn-danger waves-effect" @click="logout()">Đăng xuất</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import axios from 'axios'
    import inputEff from './../main/input'

    const input = new inputEff()

    export default {
        data(){
            return {
                formState:{}
            }
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
    }
</script>
