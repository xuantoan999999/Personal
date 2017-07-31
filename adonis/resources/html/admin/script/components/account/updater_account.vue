<template>
    <div class="row">
        <div class="col-xs-4">
            {{data.name}}
        </div>
        <div class="col-xs-4">
            {{data.website}}
        </div>
        <div class="col-xs-4">
            <button class="waves-effect btn btn-primary" @click="showEdit(item, index)">
                <i class="material-icons">edit</i>
                <span>Sửa</span>
            </button>
            <button class="waves-effect btn btn-danger" @click="showDelete(item, index)">
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

const input = new inputEff()
Vue.use(VueForm);

export default {
    data() {
        return {
            showAdd: false,
            modal:{
                showButton: false,
                width: 600
            },
            formState: {},
            dataAdd: this.defaultDataAdd()
        }
    },
    props:['data'],
    components: {
        Vodal
    },
    mounted() {
        console.log(this.data);
    },
    methods:{
        defaultDataAdd(){
            return {
                name: '',
                website: ''
            }
        },
        showAddForm(){
            this.showAdd = true;
            setTimeout(() => { input.activate() }, 100);
        },
        hideAddForm(){
            this.showAdd = false;
        },
        add(){
            if(!this.formState.$valid) return;
            console.log(this.formState);
            // axios.post(`/api/v1/tai-khoan`, {
            //     data: this.dataAdd
            // }).then((resp) => {
            //     this.hideAddForm();
            //     this.dataAdd = this.defaultDataAdd();
            //     this.$emit('add')
            // })
        }
    }
}
</script>