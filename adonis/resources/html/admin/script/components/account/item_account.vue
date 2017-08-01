<template>
    <div class="row">
        <div class="col-xs-4">
            {{dataItem.name}}
        </div>
        <div class="col-xs-4">
            <a :href="dataItem.website" target="_blank" >{{dataItem.website}}</a>
        </div>
        <div class="col-xs-4">
            <updateAccount :data="dataItem" @reloadAccount="updateAccount"></updateAccount>
            <button class="waves-effect btn btn-danger">
                <i class="material-icons">delete</i>
                <span>Xóa</span>
            </button>
        </div>
    </div>
</template>

<script>
import Vodal from 'vodal';
import VueForm from 'vue-form';
import Vue from 'vue'
import axios from 'axios'
import inputEff from './../../main/input.js'
import updateAccount from './update_account.vue'

const input = new inputEff()
Vue.use(VueForm);

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
    props:['data'],
    components: {
        Vodal,
        updateAccount
    },
    mounted() {
        this.dataItem = (JSON.parse(JSON.stringify(this.data)));
    },
    methods:{
        updateAccount(data){
            this.dataItem = data.data;
        }
    }
}
</script>