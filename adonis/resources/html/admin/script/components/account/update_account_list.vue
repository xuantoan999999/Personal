<template>
    <div class="row">
        <div class="col-xs-10" style="padding-right: 0;">
            <button class="btn btn-lg waves-effect btn-block " type="button" @click="showUpdate()">
                <span v-if="data.user_name && data.user_name != ''">{{data.user_name}} - </span>
                <span>{{data.email}}</span>
            </button>
        </div>
        <div class="col-xs-2" style="padding-left: 0;">
            <button class="btn btn-danger waves-effect btn-block " type="button" @click="deleteAcc()">
                <i class="material-icons">delete</i>
                <span>Xóa</span>
            </button>
        </div>
        <div class="col-xs-12" v-if="showEdit">
            <div class="form-group form-float">
                <div class="form-line focused" :class="{focused: data.user_name && data.user_name != ''}">
                    <input type="text" class="form-control" name="user_name" v-model="data.user_name">
                    <label class="form-label">Tên</label>
                </div>
            </div>
            <div class="form-group form-float">
                <div class="form-line focused" :class="{focused: data.email && data.email != ''}">
                    <input type="text" class="form-control" name="email" v-model="data.email">
                    <label class="form-label">Email</label>
                </div>
            </div>
            <div class="form-group form-float">
                <div class="form-line focused" :class="{focused: data.password && data.password != ''}">
                    <input type="text" class="form-control" name="password" v-model="data.password">
                    <label class="form-label">Mật khẩu</label>
                </div>
            </div>
            <div class="form-group form-float">
                <div class="form-line" :class="{focused: tmpData.extra && tmpData.extra != ''}">
                    <textarea rows="5" class="form-control" name="extra" v-model="tmpData.extra"></textarea>
                    <label class="form-label">Bổ sung</label>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Vodal from 'vodal';
import VueForm from 'vue-form';
import Vue from 'vue'
import axios from 'axios'
import inputEff from './../../main/input.js'

export default {
    data() {
        return {
            tmpData: {},
            showEdit: false,
        }
    },
    props:['data'],
    components: {
        Vodal
    },
    mounted() {
        this.tmpData = (JSON.parse(JSON.stringify(this.data)));
    },
    methods:{
        showUpdate(){
            this.showEdit = !this.showEdit;
            let input = new inputEff();
            setTimeout(() => { input.activate() }, 100);
        },
        deleteAcc(){
            this.$emit('deleteAcount',{})
        }
    }
}
</script>