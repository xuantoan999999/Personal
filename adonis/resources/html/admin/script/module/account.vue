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
                <div class="body" id="account">
                    <div class="row">
                        <div class="col-xs-3">
                            <div class="form-group form-float">
                                <div class="form-line">
                                    <input type="text" class="form-control" name="search" v-model="filterData.search" placeholder="Tên hoặc link website">
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-3">
                            <div class="form-group">
                                <button class="btn btn-primary waves-effect" type="button" @click="filter()">
                                    <i class="material-icons">search</i>
                                    <span>Filter</span>
                                </button>
                                <button class="btn btn-warning waves-effect" type="button" @click="reset()">
                                    <i class="material-icons">clear</i>
                                    <span>Reset</span>
                                </button>
                            </div>
                        </div>
                    </div>
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
                    <div v-for="item in accounts" v-if="hasData">
                        <itemAccount :data="item" v-on:deleteAcc="changePage(1)"></itemAccount>
                    </div>
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
                pageCount: 1,
                totalItems: 1,
                hasData: false,
                filterData:{
                    search: ''
                }
            }
        },
        mounted() {
            this.filterData = (JSON.parse(JSON.stringify(this.$route.query)));
            this.init(() => {});
        },
        methods: {
            init(callback){
                this.hasData = false;
                let params = this.$route.query;
                axios.get(`/api/v1/tai-khoan`, {
                    params
                }).then((resp) => {
                    this.pageCount = resp.data.totalPage;
                    this.totalItems = resp.data.totalItems;
                    this.currentPage = resp.data.currentPage;
                    this.accounts = resp.data.accounts;
                    this.hasData = true;
                    let $this = this;
                    setTimeout(function () { $this.$refs.paginate.selected = $this.currentPage - 1; }, 50);
                    if(callback) callback();
                })
            },
            changePage(page){
                // Change url
                let query = (JSON.parse(JSON.stringify(this.$route.query)));
                query.page = page;
                console.log(query);
                this.$router.push({
                    name: 'account',
                    query,
                })

                // Query
                this.$route.query.page = page;
                this.init(function(){});
            },
            filter(){
                if(this.$route.query.search) delete this.$route.query.search;
                if(this.filterData.search) this.$route.query.search = this.filterData.search;

                this.changePage(1);
            },
            reset(){
                this.filterData = {
                    search: null
                }
                this.filter();
            }
        }
    }
</script>
