import Vue from 'vue';
import axios from 'axios';

Vue.component('facebook', {
    data() {
        return {
            news: {},
            detail: {}
        }
    },
    template: `
        <div v-if="detail.name">
            <h3>Fanpage: {{detail.name}}</h3>
            <div class="row">
                <div v-for="item in news.data" class="col-md-6">
                    <div class="item-news">
                        <p v-if="item.name">{{item.name}}</p>
                        <p v-if="item.message">{{item.message}}</p>
                        <img :src="item.picture" class="thumb-image">
                    </div>
                </div>
                <div class="col-md-6">
                    <a @click="changePost(news.paging.previous)" v-if="news.paging.previous">Bài mới hơn</a>
                </div>
                <div class="col-md-6 text-right">
                    <a @click="changePost(news.paging.next)"  v-if="news.paging.next">Bài cũ hơn</a>
                </div>
            </div>
        </div>
    `,
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
        }
    }
})