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
        <div>
            <p>Fanpage: {{detail.name}}</p>
            <div v-for="item in news.data" class="item-news">
                <p>{{item.name}}</p>
                <p><img :src="item.picture"></p>
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

    }
})