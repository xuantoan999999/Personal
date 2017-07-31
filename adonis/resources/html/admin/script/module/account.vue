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
                    <div class="form-group" v-for="item in accounts">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatum suscipit aperiam quos, nostrum, est earum autem impedit quidem labore, id debitis eius hic alias quo rerum obcaecati doloremque reprehenderit architecto!
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import addAccount from './../components/account/add_account.vue'
    import axios from 'axios'
    // <img src="https://icons.better-idea.org/icon?url=www.google.com.vn&size=40" alt="">

    export default {
        components: { addAccount },
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
                axios.get(`/api/v1/tai-khoan`, {
                    
                }).then((resp) => {
                    this.accounts = resp.data.accounts;
                    console.log(resp);
                    if(callback) callback();
                })
            }
        }
    }
</script>
