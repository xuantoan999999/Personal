<template>
    <div v-if="detail.name">
        <h3>Fanpage: {{detail.name}}</h3>
        <div class="row">
            <div v-for="item in news.data" class="col-md-6">
                <div class="item-news">
                    <div class="content" @click="show(item)">
                        <p v-if="item.name">{{item.name}}</p>
                        <p v-if="item.message">{{item.message}}</p>
                    </div>
                    <img :src="item.picture" class="thumb-image">
                </div>
            </div>
            <div class="col-md-6">
                <a @click="changePost(news.paging.previous)" v-if="news.paging.previous" class="change-post">Bài mới hơn</a>
            </div>
            <div class="col-md-6 text-right">
                <a @click="changePost(news.paging.next)" v-if="news.paging.next" class="change-post">Bài cũ hơn</a>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import axios from 'axios';
    import storeHome from './store';

    export default {
        data() {
            return {
                news: {},
                detail: {}
            }
        },
        props: ['fanpage'],
        mounted() {
            axios.get(`/facebook/${this.fanpage}`).then(resp => {
                this.news = resp.data.news;
                this.detail = resp.data.detail;
            }).catch(error => {
                console.log(error);
            })
        },
        methods: {
            changePost(url) {
                axios.get(url).then(({ data }) => {
                    this.news = data;
                }).catch(error => {
                    console.log(error);
                })
            },
            show(item) {
                storeHome.commit('mutateFacebook',item)
                this.$modal.show('hello-world');
            },
            hide() {
                this.$modal.hide('hello-world');
            }
        }
    }
</script>

<style lang=""></style>