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
                            
                        </div>
                    </div>
                </div>
                <div class="body" id="account">
                    <div class="row">
                        <div class="col-xs-3">
                            <div class="form-group form-float">
                                <div class="form-line">
                                    <input type="text" class="form-control" name="search" placeholder="Link website">
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-3">
                            <div class="form-group">
                                <button class="btn btn-primary waves-effect" type="button">
                                    <i class="material-icons">search</i>
                                    <span>Filter</span>
                                </button>
                                <button class="btn btn-warning waves-effect" type="button">
                                    <i class="material-icons">clear</i>
                                    <span>Reset</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <Test></Test>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import Vue from 'vue'
    import Paginate from 'vuejs-paginate';
    import Vuex from 'vuex';
    import Test from './../components/website/test.vue';

    Vue.use(Vuex);

    const store = new Vuex.Store({
        state: {
            count: 0,
            todos: [
                { id: 1, text: '...', done: true },
                { id: 2, text: '...', done: false }
            ]

        },
        mutations: {
            increment: state => state.count++,
            decrement: state => state.count--
        },
        getters: {
            doneTodos: state => state.todos.filter(todo => todo.done),
            lengthTodos: (state, getters) => getters.doneTodos.length
        },
        actions: {
            increment (context, payload) {
                context.commit('increment')
            }
        }

    })

    export default {
        components: {Test, Paginate },
        store,
        data(){
            return {
                // selected: null,
                // route: this.$route,
                // pageCount: 1,
                // totalItems: 1,
                // hasData: false,
                // filterData:{
                //     search: ''
                // }
            }
        },
        mounted() {
            // this.filterData = (JSON.parse(JSON.stringify(this.route.query)))
            // this.init(() => {});
        },
        computed: {
            // count () {
            //     return store.state.count
            // }
        },
        methods: {
            // increment () {
            //     console.log("increment");
            //     store.commit('increment')
            // },
            // decrement () {
            //     console.log("decrement");
            //     store.commit('decrement')
            // },
            init(callback){
                // this.hasData = false;
                // let params = this.route.query;
                // axios.get(`/api/v1/tai-khoan`, {
                //     params
                // }).then((resp) => {
                //     this.pageCount = resp.data.totalPage;
                //     this.totalItems = resp.data.totalItems;
                //     this.currentPage = resp.data.currentPage;
                //     this.accounts = resp.data.accounts;
                //     this.hasData = true;
                //     let $this = this;
                //     setTimeout(function () { $this.$refs.paginate.selected = $this.currentPage - 1; }, 50);
                //     if(callback) callback();
                // })
            },
            changePage(page){
                // // Change url
                // let query = (JSON.parse(JSON.stringify(this.route.query)));
                // query.page = page;
                // this.$router.push({
                //     name: 'account', query
                // })

                // // Query
                // this.route.query.page = page;
                // this.init(function(){});
            },
            filter(){
                // if(this.route.query.search) delete this.route.query.search;
                // if(this.filterData.search) this.route.query.search = this.filterData.search;

                // this.changePage(1);
            },
            reset(){
                // this.filterData = {
                //     search: null
                // }
                // this.filter();
            }
        }
    }
</script>
