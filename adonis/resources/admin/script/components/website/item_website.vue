<template>
    <div class="row">
        <div class="col-xs-4">
            {{dataItem.name}}
        </div>
        <div class="col-xs-4">
            <a :href="dataItem.link_website" target="_blank" >{{dataItem.link_website}}</a>
        </div>
        <div class="col-xs-4">
            <updateWebsite :data="dataItem"></updateWebsite>
            <button class="waves-effect btn btn-danger" @click="remove">
                <i class="material-icons">delete</i>
                <span>Xóa</span>
            </button>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'

import updateWebsite from './update_website.vue'

export default {
    data() {
        return {
            show: false,
            modal:{
                showButton: false,
                width: 600
            },
            formState: {},
            dataItem: {}
        }
    },
    components: {
        updateWebsite
    },
    props:['data'],
    mounted() {
        this.dataItem = (JSON.parse(JSON.stringify(this.data)));
    },
    methods:{
        remove(){
            let params = this.$route.query;
            this.$store.dispatch('removeWeb', {
                data: this.dataItem
            }).then(() => {
                this.$store.dispatch('getListWeb', {
                    params,
                }).then(() =>{});
            });
        }
    }
}
</script>