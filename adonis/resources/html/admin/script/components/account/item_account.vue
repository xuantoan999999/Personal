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
            <button class="waves-effect btn btn-danger" @click="removeAccount">
                <i class="material-icons">delete</i>
                <span>Xóa</span>
            </button>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import updateAccount from './update_account.vue'

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
        updateAccount
    },
    mounted() {
        this.dataItem = (JSON.parse(JSON.stringify(this.data)));
    },
    methods:{
        updateAccount(data){
            this.dataItem = data.data;
        },
        removeAccount(){
            axios.delete(`/api/v1/tai-khoan/${this.dataItem._id}`).then((resp) => {
                this.$emit('deleteAcc', {data: this.dataItem})
            })
        }
    }
}
</script>