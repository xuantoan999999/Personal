<template>
    <div class="inline-block">
        <button class="waves-effect btn btn-primary" @click="showUpdate()">
            <i class="material-icons">edit</i>
            <span>Sửa</span>
        </button>
        <vodal :show="showAdd" animation="slideDown" :width="modal.width" :close-button="modal.showButton" @hide="showAdd = false" >
            <div class="card">
                <div class="header">
                    <h2>Sửa</h2>
                </div>
                <div class="body">
                    <vue-form :state="formState" v-model="formState" @submit.prevent="update()">
                       <validate auto-label class="form-group">
                            <label>Tên</label>
                            <div class="form-line">
                                <input type="text" name="name" class="form-control" v-model="tmpData.name" required>
                            </div>
                        </validate>
                        <field-messages auto-label name="name" show="$submitted" class="color-danger form-group">
                            <p slot="required">Chưa nhập tên.</p>
                        </field-messages>

                        <validate auto-label class="form-group">
                            <label>Link website</label>
                            <div class="form-line">
                                <input type="text" name="website" class="form-control" v-model="tmpData.link_website" placeholder="Link website">
                            </div>
                        </validate>

                        <div class="form-group text-right">
                            <button class="waves-effect btn btn-primary" type="submit" :disabled="formState.$invalid && formState.$submitted">
                                <i class="material-icons">edit</i>
                                <span>Sửa</span>
                            </button>
                            <a class="waves-effect btn btn-warning" @click="showAdd = false">
                                <i class="material-icons">clear</i>
                                <span>Đóng</span>
                            </a>
                        </div>
                    </vue-form>
                </div>
            </div>
        </vodal>
    </div>
</template>

<script>

import Vodal from 'vodal';
import VueForm from 'vue-form';
import Vue from 'vue'
import axios from 'axios'
import inputEff from './../../main/input.js'
// import updateAccountList from './update_account_list.vue'

export default {
    data() {
        return {
            modal:{
                showButton: false,
                width: 600
            },
            formState: {},
            showAdd: false,
            showAddAcc: false,
            tmpData: {},
        }
    },
    props: ['data'],
    components: {
        Vodal
    },
    mounted() {
    },
    methods:{
        showUpdate(){
            axios.get(`/api/v1/website/${this.data._id}`).then((resp) => {
                this.tmpData = resp.data.website;
                this.showAdd = true;
                let input = new inputEff();
                setTimeout(() => { input.activate() }, 100);
            })
        },
        update(){
            let params = this.$route.query;
            if(!this.formState.$valid) return;
            this.$store.dispatch('updateWeb', {
                data: this.tmpData
            }).then(() => {
                this.$store.dispatch('getListWeb', {
                    params,
                }).then(() => {
                    this.showAdd = false;
                });
            });
        },
    }
}
</script>