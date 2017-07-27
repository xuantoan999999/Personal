'use strict'

const mongoose = use('mongoose');
const _ = require('lodash');
const Hash = use('Hash')

const User = mongoose.model('User');

class UserController {

    * index(request, response) {
        // let new_user = new User({ email: 'skecgash@gmail.com', name: 'skecgash' });
        // yield new_user.save();
        let users = yield User.find().lean();
        users.forEach(function (item) {
            item.extra = {
                edit: false,
                delete: false,
                show: false,
                new_password: '',
                new_password_confirm: ''
            }
            if(!item.roles) item.roles = [];
        });
        yield response.json({ users })
    }

    * create(request, response) {
        //
    }

    * store(request, response) {
        let data = request.input('data');
        delete data.confirm_password;
        data.password =  yield Hash.make(data.password);
        let newUser = new User(data);
        let saveUser = yield newUser.save();
        yield response.json({ success: true })
    }

    * show(request, response) {
        //
    }

    * edit(request, response) {
        //
    }

    * update(request, response) {
        let params = request.params();
        let data = request.all();
        let user = yield User.findById(params.id);
        let userUpdate = _.extend(user, data.data);
        yield userUpdate.save();
        yield response.json({ success: true })
    }

    * destroy(request, response) {
        let params = request.params();
        let removeUser = yield User.findByIdAndRemove(params.id);
        yield response.json({ success: true })
    }

    * changePassword(request, response) {
        let user = request.all().user;
        let userUpdate = yield User.findById(user._id);
        userUpdate.password = yield Hash.make(user.extra.new_password);
        yield userUpdate.save();
        yield response.json({ success: true })
    }
}

module.exports = UserController
