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
                            <addAccount v-on:add="changePage(1)"></addAccount>
                        </div>
                    </div>
                </div>
                <div class="body" id="account" v-if="hasData">
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
                    <itemAccount :data="item" v-for="item in accounts" v-on:deleteAcc="changePage(1)"></itemAccount>
                </div>
                <div class="text-center">
                    <paginate :pageCount="pageCount" :containerClass="'pagination'" :clickHandler="changePage" ref="paginate" v-if="hasData" :prev-text="'Prev'" :next-text="'Next'"></paginate>
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
    import Paginate from 'vuejs-paginate';

    export default {
        components: { addAccount, itemAccount, Paginate },
        data(){
            return {
                accounts: [],
                selected: null,
                route: this.$route,
                pageCount: 1,
                totalItems: 1,
                hasData: false
            }
        },
        mounted() {
            this.init(() => {
                
            });
        },
        methods: {
            init(callback){
                this.hasData = false;
                let params = this.route.query;
                axios.get(`/api/v1/tai-khoan`, {
                    params
                }).then((resp) => {
                    this.pageCount = resp.data.totalPage;
                    this.totalItems = resp.data.totalItems;
                    this.currentPage = resp.data.currentPage;
                    this.accounts = resp.data.accounts;
                    this.hasData = true;
                    let $this = this;
                    setTimeout(function () { console.log($this.currentPage); $this.$refs.paginate.selected = $this.currentPage - 1; }, 50);
                    if(callback) callback();
                })
            },
            changePage(page){
                this.$router.push({
                    name: 'account', query: { page, limit: this.route.query.limit }
                })
                this.route.query.page = page;
                this.init(function(){});
            },
        }
    }
</script>
