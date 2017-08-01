<template>
    <div class="row">
        <div class="col-xs-12">
            <div class="card">
                <div class="header">
                    <div class="row">
                        <div class="col-xs-6">
                            <h2>Tài khoản</h2>
                        </div>
                        <div class="col-xs-6">
                            <addAccount v-on:add="init"></addAccount>
                        </div>
                    </div>
                </div>
                <div class="body" id="account">
                    <div class="row">
                        <div class="col-xs-4 text-center">
                            <strong>Tên</strong>
                        </div>
                        <div class="col-xs-4 text-center">
                            <strong>Link website</strong>
                        </div>
                        <div class="col-xs-4 text-center">
                            <strong>Action</strong>
                        </div>
                    </div>
                    <itemAccount :data="item" v-for="item in accounts"></itemAccount>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import addAccount from './../components/account/add_account.vue'
    import itemAccount from './../components/account/item_account.vue'
    import axios from 'axios'
    import Vue from 'vue'

    export default {
        components: { addAccount, itemAccount },
        data(){
            return {
                accounts: []
            }
        },
        mounted() {
            this.init(() => {});
        },
        methods: {
            init(callback){
                axios.get(`/api/v1/tai-khoan`, {}).then((resp) => {
                    this.accounts = resp.data.accounts;
                    if(callback) callback();
                })
            }
        }
    }
</script>
