<template>
    <div class="row">
        <div class="col-xs-12">
            <div class="card">
                <div class="header">
                    <h2>Người dùng</h2>
                </div>
                <div class="body" id="user">
                    <button class="btn btn-success waves-effect" @click="showAddForm()">
                        <i class="material-icons">add</i>
                        <span>Thêm</span>
                    </button>

                    <vodal :show="showAdd" animation="slideDown" :width="modal.width" :close-button="modal.hideAdd" @hide="hideAddForm()">
                        <div class="card">
                            <div class="header">
                                <h2>Thêm người dùng</h2>
                            </div>
                            <div class="body">
                                <vue-form :state="formState" v-model="formState" @submit.prevent="add()" v-if="showAdd">
                                    <validate auto-label class="form-group">
                                        <label>Tên</label>
                                        <div class="form-line">
                                            <input type="text" name="name" class="form-control" v-model="dataAdd.name" required>
                                        </div>
                                    </validate>
                                    <field-messages auto-label name="name" show="$submitted" class="color-danger form-group">
                                        <p slot="required">Chưa nhập tên.</p>
                                    </field-messages>

                                    <validate auto-label class="form-group">
                                        <label>Email</label>
                                        <div class="form-line">
                                            <input type="email" name="email" class="form-control" v-model="dataAdd.email" required>
                                        </div>
                                    </validate>

                                    <field-messages auto-label name="email" show="$submitted" class="color-danger form-group">
                                        <p slot="required">Chưa nhập email.</p>
                                        <p slot="email">Email chưa nhập đúng định dạng.</p>
                                    </field-messages>

                                    <validate auto-label class="form-group">
                                        <label>Mật khẩu</label>
                                        <div class="form-line">
                                            <input type="password" name="password" class="form-control" v-model="dataAdd.password" required>
                                        </div>
                                    </validate>

                                    <field-messages auto-label name="password" show="$submitted" class="color-danger form-group">
                                        <p slot="required">Chưa nhập mật khẩu.</p>
                                    </field-messages>

                                    <validate auto-label class="form-group">
                                        <label>Nhập lại mật khẩu</label>
                                        <div class="form-line">
                                            <input type="password" name="confirm_password" class="form-control" v-model="dataAdd.confirm_password" required :matches="dataAdd.password">
                                        </div>
                                    </validate>

                                    <field-messages auto-label name="confirm_password" show="$submitted" class="color-danger form-group">
                                        <p slot="required">Chưa xác nhận mật khẩu.</p>
                                        <p slot="matches">Nhập lại mật khẩu không đúng</p>
                                    </field-messages>

                                    <div class="form-group">
                                        <multiselect v-model="dataAdd.roles" :options="options" :multiple="true"></multiselect>
                                    </div>

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

                    <div class="body table-responsive">
                        <div class="col-xs-3 text-center">
                            <strong>Tên</strong>
                        </div>
                        <div class="col-xs-3 text-center">
                            <strong>Email</strong>
                        </div>
                        <div class="col-xs-3 text-center">
                            <strong>Quyền</strong>
                        </div>
                        <div class="col-xs-3 text-center">
                            <strong>Action</strong>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                    <div class="row" v-for="(item,index) in users" v-if="users.length > 0">
                        <div class="col-xs-3">
                            <p v-if="!item.extra.edit" v-text="item.name"></p>
                            <div class="form-group" v-if="item.extra.edit">
                                <div class="form-line">
                                    <input type="text" class="form-control" v-model="item.name">
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-3">
                            <p v-if="!item.extra.edit" v-text="item.email"></p>
                            <div class="form-group" v-if="item.extra.edit">
                                <div class="form-line">
                                    <input type="text" class="form-control" v-model="item.email">
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-3">
                             <multiselect v-model="item.roles" :options="options" :multiple="true" placeholder="Chọn quyền" @input="changeRole(item)"></multiselect>
                        </div>
                        <div class="col-xs-3">
                            <div v-if="!item.extra.edit && !item.extra.delete">
                                <button class="waves-effect btn btn-primary" @click="showEdit(item, index)">
                                    <i class="material-icons">edit</i>
                                    <span>Sửa</span>
                                </button>
                                <button class="waves-effect btn btn-danger" @click="showDelete(item, index)">
                                    <i class="material-icons">delete</i>
                                    <span>Xóa</span>
                                </button>
                                <button class="waves-effect btn btn-warning" @click="showChangePassword(item, index)">
                                    <i class="material-icons">lock</i>
                                    <span>Đổi mật khẩu</span>
                                </button>

                                <vodal :show="item.extra.show" animation="slideDown" :width="modal.width" :close-button="modal.showButton" @hide="item.extra.show = false">
                                    <div class="card">
                                        <div class="header">
                                            <h2>Đổi mật khẩu</h2>
                                        </div>
                                        <div class="body">
                                            <vue-form :state="formState" v-model="formState" @submit.prevent="changePassword(item, index)" v-if="item.extra.show">
                                                <validate auto-label class="form-group">
                                                    <label>Mật khẩu mới</label>
                                                    <div class="form-line">
                                                        <input type="password" name="new_password" class="form-control" v-model="item.extra.new_password" required>
                                                    </div>
                                                </validate>
                                                <field-messages auto-label name="new_password" show="$submitted" class="color-danger form-group">
                                                    <p slot="required">Chưa nhập mật khẩu mới.</p>
                                                </field-messages>

                                                <validate auto-label class="form-group">
                                                    <label>Nhập lại mật khẩu mới</label>
                                                    <div class="form-line">
                                                        <input type="password" :matches="item.extra.new_password" name="new_password_confirm" class="form-control" v-model="item.extra.new_password_confirm" required>
                                                    </div>
                                                </validate>

                                                <field-messages auto-label name="new_password_confirm" show="$submitted" class="color-danger form-group">
                                                    <p slot="required">Chưa nhập mật khẩu mới.</p>
                                                    <p slot="matches">Mật khẩu mới không khớp</p>
                                                </field-messages>
                                                <div class="form-group color-danger" v-if="formState.$submitted && item.extra.new_password_confirm != item.extra.new_password && formState.new_password_confirm.$valid">
                                                    <p>Mật khẩu mới không khớp</p>
                                                </div>

                                                <div class="form-group text-right">
                                                    <button class="waves-effect btn btn-success" type="submit" :disabled="formState.$invalid && formState.$submitted">
                                                        <i class="material-icons">edit</i>
                                                        <span>Sửa</span>
                                                    </button>
                                                    <a class="waves-effect btn btn-warning" @click="closeChangePassword(item, index)">
                                                        <i class="material-icons">clear</i>
                                                        <span>Đóng</span>
                                                    </a>
                                                </div>
                                            </vue-form>
                                        </div>
                                    </div>
                                </vodal>

                            </div>
                            <div v-if="item.extra.edit">
                                <button class="waves-effect btn btn-success" @click="update(item, index)">
                                    <i class="material-icons">check</i>
                                    <span>Sửa</span>
                                </button>
                                <button class="waves-effect btn btn-warning" @click="hideEdit(item, index)">
                                    <i class="material-icons">clear</i>
                                    <span>Hủy</span>
                                </button>
                            </div>
                            <div v-if="item.extra.delete">
                                <button class="waves-effect btn btn-warning" @click="remove(item, index)">
                                    <i class="material-icons">delete</i>
                                    <span>Xóa</span>
                                </button>
                                <button class="waves-effect btn btn-success" @click="hideDelete(item, index)">
                                    <i class="material-icons">clear</i>
                                    <span>Hủy</span>
                                </button>
                            </div>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                    <div class="text-center">
                        <paginate :pageCount="pageCount" :containerClass="'pagination'" :clickHandler="clickCallback" ref="paginate" v-if="hasData"></paginate>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import axios from 'axios'
    import inputEff from './../main/input'
    import $ from 'jquery';
    import Vodal from 'vodal';
    import VueForm from 'vue-form';
    import Multiselect from 'vue-multiselect';
    import Paginate from 'vuejs-paginate';
    import _ from 'lodash';

    Vue.use(VueForm,{
        validators: {
            matches: function (value, attrValue) {
                if(!attrValue) {
                    return true;
                }
                return value === attrValue;
            }
        }
    });
    const input = new inputEff()

    export default {
        data (){
            return {
                users: [],
                users_tmp: [],
                modal:{
                    showButton: false,
                    width: 600
                },
                formState:{},
                showAdd: false,
                dataAdd:{
                    name: '',
                    email: '',
                    password: '',
                    confirm_password: '',
                    roles: []
                },
                selected: null,
                options: ['admin', 'user'],
                route: this.$route,
                pageCount: 1,
                totalItems: 1,
                hasData: false
            }
        },
        mounted() {
            let $this = this;
            this.init(function(){
                setTimeout(function () { $this.$refs.paginate.selected = $this.currentPage - 1; }, 50);
            });
        },
        components: {
            // Vodal.name,
            Vodal,
            Multiselect,
            Paginate
        },
        methods: {
            clickCallback: function(page) {
                this.$router.push({
                    name: 'user', query: { page, limit: this.route.query.limit }
                })
                this.route.query.page = page;
                this.init(function(){});
            },
            init(cb) {
                let params = this.route.query;
                axios.get('/api/v1/nguoi-dung', {
                    params
                }).then((resp) => {
                    this.pageCount = resp.data.totalPage;
                    this.totalItems = resp.data.totalItems;
                    this.currentPage = resp.data.currentPage;
                    this.users = resp.data.users;
                    this.users.forEach((item, index)=> {
                        this.users_tmp.push((JSON.parse(JSON.stringify(item))))
                    });
                    this.hasData = true;
                    cb();
                })
            },
            resetDataAdd() {
                this.dataAdd = {
                    name: '',
                    email: '',
                    password: '',
                    confirm_password: '',
                    roles: []
                }
            },
            showEdit(data, index) {
                data.extra.edit = true;
                setTimeout(() => { input.activate() }, 100)
            },
            hideEdit(data, index) {
                data.extra.edit = false;
                _.extend(data,this.users_tmp[index]);
            },
            showDelete(data, index) {
                data.extra.delete = true;
            },
            hideDelete(data, index) {
                data.extra.delete = false;
            },
            showChangePassword(data,index){
                data.extra.show = true;
                setTimeout(() => { input.activate() }, 100);
            },
            closeChangePassword(data,index){
                data.extra.show = false;
            },
            changePassword(data, index){
                if(!this.formState.$valid) return;
                if(data.extra.new_password_confirm != data.extra.new_password) return;
                axios.post('/api/v1/nguoi-dung/doi-mat-khau',{user: data}).then((resp) => {
                    this.formState._reset();
                    data.extra.new_password_confirm = '';
                    data.extra.new_password = '';
                    this.closeChangePassword(data,index);
                })
            },
            remove(data, index) {
                axios.delete(`/api/v1/nguoi-dung/${data._id}`).then((resp) => {
                    this.users.splice(index,1);
                    this.users_tmp.splice(index,1);
                    this.clickCallback(1);
                    this.$refs.paginate.selected = 0;
                })
            },
            update(data, index) {
                axios.post(`/api/v1/nguoi-dung/${data._id}`, {data}).then((resp) => {
                    data.extra.edit = false;
                    this.users_tmp[index] = (JSON.parse(JSON.stringify(data)))
                })
            },
            showAddForm(){
                this.showAdd = true;
                setTimeout(() => { input.activate() }, 100);
            },
            hideAddForm(){
                this.showAdd = false;
                this.resetDataAdd();
            },
            add(){
                if(!this.formState.$valid) return;
                let $this = this;

                axios.post(`/api/v1/nguoi-dung`, {
                    data: this.dataAdd
                }).then((resp) => {
                    this.init(function(){
                        $this.hideAddForm();
                    })
                })
            },
            changeRole(data){
                axios.post(`/api/v1/nguoi-dung/role/${data._id}`, {roles: data.roles}).then((resp) => {})
            }
        }
    }
</script>
