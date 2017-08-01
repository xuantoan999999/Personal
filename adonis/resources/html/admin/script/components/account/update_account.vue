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
                                <input type="text" name="website" class="form-control" v-model="tmpData.website" placeholder="Link website">
                            </div>
                        </validate>

                        <div class="form-group text-right">
                            <button class="waves-effect btn btn-success" type="submit" :disabled="formState.$invalid && formState.$submitted">
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

export default {
    data() {
        return {
            modal:{
                showButton: false,
                width: 600
            },
            formState: {},
            showAdd: false,
            tmpData: {}
        }
    },
    props:['data'],
    components: {
        Vodal
    },
    mounted() {
    },
    methods:{
        showUpdate(){
            axios.get(`/api/v1/tai-khoan/${this.data._id}`).then((resp) => {
                this.tmpData = resp.data.account;
                this.showAdd = true;
                let input = new inputEff();
                setTimeout(() => { input.activate() }, 100);
            })
        },
        hideAddForm(){
            this.showAdd = false;
        },
        update(){
            if(!this.formState.$valid) return;
            axios.post(`/api/v1/tai-khoan/${this.data._id}`, {
                data: this.tmpData
            }).then((resp) => {
                this.hideAddForm();
                this.$emit('reloadAccount', {
                    data: resp.data.account
                });
            })
        }
    }
}
</script>