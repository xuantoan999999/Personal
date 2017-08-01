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

                        <h5>Danh sách tài khoản</h5>
                        <div v-show="showAddAcc" style="margin-top: 30px;">
                            <div class="form-group form-float">
                                <div class="form-line">
                                    <input type="text" class="form-control" name="user_name" v-model="tmpDataAcc.user_name">
                                    <label class="form-label">Tên</label>
                                </div>
                            </div>
                            <div class="form-group form-float">
                                <div class="form-line">
                                    <input type="text" class="form-control" name="email" v-model="tmpDataAcc.email">
                                    <label class="form-label">Email</label>
                                </div>
                            </div>
                            <div class="form-group form-float">
                                <div class="form-line">
                                    <input type="text" class="form-control" name="password" v-model="tmpDataAcc.password">
                                    <label class="form-label">Mật khẩu</label>
                                </div>
                            </div>
                            <div class="form-group form-float">
                                <div class="form-line">
                                    <textarea rows="5" class="form-control" name="extra" v-model="tmpDataAcc.extra"></textarea>
                                    <label class="form-label">Bổ sung</label>
                                </div>
                            </div>
                        </div>
                        <button class="waves-effect btn btn-success m-b-15" type="button" @click="addAccEvent('add')">
                            <i class="material-icons">add</i>
                            <span>Thêm tài khoản</span>
                        </button>
                        <button class="waves-effect btn btn-warning m-b-15" type="button" @click="addAccEvent('remove')" v-if="showAddAcc">
                            <i class="material-icons">clear</i>
                            <span>Hủy</span>
                        </button>

                        <div v-for="item in tmpData.list_account">
                            <button class="btn btn-default waves-effect m-b-15 btn-block " type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample" >
                                dgsdg
                            </button>
                            <div class="collapse" id="collapseExample">
                                Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica,
                                craft beer labore wes anderson cred nesciunt sapiente ea proident.
                            </div>
                        </div>

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
            tmpDataAcc: this.defaultDataAcc()
        }
    },
    props:['data'],
    components: {
        Vodal
    },
    mounted() {
    },
    methods:{
        defaultDataAcc(){
            return {
                user_name: '',
                email: '',
                password: '',
                extra: ''
            }
        },
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
        },
        addAccEvent(type){
            if(this.showAddAcc){
                if(type == 'add'){
                    this.tmpData.list_account.push(this.tmpDataAcc);
                }
            }
            this.tmpDataAcc = this.defaultDataAcc()
            this.showAddAcc = !this.showAddAcc;
        },
    }
}
</script>