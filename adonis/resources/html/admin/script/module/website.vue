<template>
    <div class="row">
        <div class="col-xs-12">
            <div class="card">
                <div class="header">
                    <div class="row">
                        <div class="col-xs-6">
                            <h2>Website</h2>
                        </div>
                        <div class="col-xs-6">
                            <addWebsite @add="changePage(1)"></addWebsite>
                        </div>
                    </div>
                </div>
                <div class="body">
                    <div class="row">
                        <div class="col-xs-3">
                            <div class="form-group form-float">
                                <div class="form-line">
                                    <input type="text" class="form-control" name="search" placeholder="Link website" v-model="filterData.search">
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-3">
                            <div class="form-group">
                                <button class="btn btn-primary waves-effect" type="button" @click="filter">
                                    <i class="material-icons">search</i>
                                    <span>Filter</span>
                                </button>
                                <button class="btn btn-warning waves-effect" type="button" @click="reset">
                                    <i class="material-icons">clear</i>
                                    <span>Reset</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div v-if="hasData">
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
                        <div v-for="item in websites">
                            <itemWebsite :data="item"></itemWebsite>
                        </div>
                        <div class="text-center">
                            <paginate :pageCount="pageCount" :containerClass="'pagination'" :clickHandler="changePage" ref="paginate" :prev-text="'Prev'" :next-text="'Next'"></paginate>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import Vue from 'vue'
    import Paginate from 'vuejs-paginate';
    import { mapGetters, mapActions, mapState } from 'vuex'

    import itemWebsite from './../components/website/item_website.vue'
    import addWebsite from './../components/website/add_website.vue'

    export default {
        data(){
            return {
                selected: null,
                route: this.$route,
                filterData:{
                    search: ''
                },
            }
        },
        components: { Paginate, itemWebsite, addWebsite },
        computed: {
            ...mapState({
                websites: state => state.website.listWeb,
                hasData: state => state.website.hasData,
                currentPage: state => state.website.currentPage,
                totalItems: state => state.website.totalItems,
                pageCount: state => state.website.totalPage,
            }),
        },
        mounted() {
            this.init(() => {});
        },
        methods: {
            init(callback){
                let params = this.route.query;
                this.$store.dispatch('getListWeb', {
                    params,
                }).then(() => {
                    let $this = this;
                    setTimeout(function () { $this.$refs.paginate.selected = $this.currentPage - 1; }, 200);
                    if(callback) callback();
                });
            },
            changePage(page){
                // Change url
                let query = (JSON.parse(JSON.stringify(this.route.query)));
                query.page = page;
                this.$router.push({
                    name: 'website', query
                })

                // Query
                this.route.query.page = page;
                this.init(function(){});
            },
            filter(){
                if(this.route.query.search) delete this.route.query.search;
                if(this.filterData.search) this.route.query.search = this.filterData.search;

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
