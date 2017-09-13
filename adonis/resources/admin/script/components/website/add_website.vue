<template>
    <div id="mod-add-account">
        <div class="text-right">
            <button class="btn btn-success waves-effect" @click="showAddForm()">
                <i class="material-icons">add</i>
                <span>Thêm</span>
            </button>
        </div>
        <vodal :show="showAdd" animation="slideDown" :width="modal.width" :close-button="modal.hideAdd" @hide="hideAddForm()">
            <div class="card">
                <div class="header">
                    <h2>Thêm website</h2>
                </div>
                <div class="body">
                    <vue-form :state="formState" v-model="formState" @submit.prevent="add()" v-if="showAdd">
                        <validate auto-label class="form-group" name="name">
                            <label>Tên</label>
                            <div class="form-line">
                                <input type="text" name="name" class="form-control" v-model="dataAdd.name" placeholder="Tên website" required>
                            </div>
                        </validate>
                        <field-messages auto-label name="name" show="$submitted" class="color-danger form-group">
                            <p slot="required">Chưa nhập tên website.</p>
                        </field-messages>

                        <validate auto-label class="form-group">
                            <label>Link website</label>
                            <div class="form-line">
                                <input type="text" name="website" class="form-control" v-model="dataAdd.link_website" placeholder="Link website">
                            </div>
                        </validate>

                        <div class="form-group text-right">
                            <button class="waves-effect btn btn-success" type="submit" :disabled="formState.$invalid && formState.$submitted">
                                <i class="material-icons">add</i>
                                <span>Thêm</span>
                            </button>
                            <a class="waves-effect btn btn-warning" @click="hideAddForm()">
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
    components: {
        Vodal
    },
    methods:{
        defaultDataAdd(){
            return {
                name: '',
                link_website: ''
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
            let params = this.$route.query;
            this.$store.dispatch('addWeb', {
                data: this.dataAdd
            }).then(() => {
                this.hideAddForm();
                this.dataAdd = this.defaultDataAdd();
                this.$store.dispatch('getListWeb', {
                    params,
                }).then(() =>{});
            });
        }
    }
}
</script>